import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BEACON_DEPOSIT_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const BLOCK_DATA_FILE = path.join(__dirname, 'data.json');

if (!ALCHEMY_URL) {
    console.error('ALCHEMY_URL is not set in the environment variables');
    process.exit(1);
}

if (!ALCHEMY_URL.startsWith('https://')) {
    console.error('ALCHEMY_URL must start with https://');
    process.exit(1);
}

console.log('Using Alchemy URL:', ALCHEMY_URL);

let isMonitoring = false;
let processedBlocks = [];  // Ensure processedBlocks is initialized as an array
let totalDeposits = 0;
let lastCheckTime = null;

async function getAssetTransfers(fromBlock = '0x0', toBlock = 'latest') {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
            {
                fromBlock: fromBlock,
                toBlock: toBlock,
                toAddress: BEACON_DEPOSIT_CONTRACT,
                withMetadata: true,
                excludeZeroValue: true,
                maxCount: "0x3e8",
                category: ["external"]
            }
        ]
    });

    try {
        const response = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: headers,
            body: body
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(`Alchemy API error: ${data.error.message}`);
        }
        return data.result.transfers;
    } catch (error) {
        console.error('Error fetching asset transfers:', error);
        throw error;
    }
}

async function saveDepositData(deposits) {
    try {
        let existingData = [];
        try {
            const fileContent = await fs.readFile(BLOCK_DATA_FILE, 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (error) {
            console.log(`File not found or unable to read. Creating a new file: ${BLOCK_DATA_FILE}`);
        }

        existingData = existingData.concat(deposits);

        await fs.writeFile(BLOCK_DATA_FILE, JSON.stringify(existingData, null, 2));
        console.log(`Deposit data successfully saved to ${BLOCK_DATA_FILE}`);
    } catch (error) {
        console.error('Error saving deposit data:', error);
    }
}

async function processDeposits(transfers) {
    return transfers.map(transfer => ({
        blockNum: transfer.blockNum,
        hash: transfer.hash,
        from: transfer.from,
        to: transfer.to,
        value: transfer.value,
        asset: transfer.asset,
        category: transfer.category,
        timestamp: transfer.metadata.blockTimestamp
    }));
}

async function monitorDeposits(callback) {
    try {
        let lastProcessedBlock = '0x0';
        console.log('Starting to monitor deposits');

        const checkDeposits = async () => {
            lastCheckTime = new Date().toISOString();
            const transfers = await getAssetTransfers(lastProcessedBlock);
            if (transfers.length > 0) {
                console.log(`Found ${transfers.length} new deposits`);
                const deposits = await processDeposits(transfers);
                await saveDepositData(deposits);
                lastProcessedBlock = `0x${BigInt(transfers[transfers.length - 1].blockNum).toString(16)}`;
                totalDeposits += transfers.length;
                callback(deposits);  // Pass the deposits directly
            } else {
                console.log('No new deposits found');
            }
        };

        setInterval(checkDeposits, 30000); // Check every 30 seconds
    } catch (error) {
        console.error('Error in monitorDeposits:', error);
    }
}

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/start-monitoring', (req, res) => {
    if (!isMonitoring) {
        isMonitoring = true;
        monitorDeposits((deposits) => {
            processedBlocks.push(...deposits);
            if (processedBlocks.length > 100) {
                processedBlocks = processedBlocks.slice(-100);  // Ensure it slices an array
            }
        });
        res.status(200).json({ message: 'Monitoring started' });
    } else {
        res.status(400).json({ message: 'Monitoring already in progress' });
    }
});

app.get('/api/get-processed-blocks', (req, res) => {
    res.status(200).json({ 
        deposits: processedBlocks.slice(0, 5),  // Return only the first 5 deposits
        totalDeposits: totalDeposits,
        lastCheckTime: lastCheckTime,
        isMonitoring: isMonitoring
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', () => {
    console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
    process.exit();
});
