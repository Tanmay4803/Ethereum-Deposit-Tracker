const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

// Beacon Deposit Contract address
const BEACON_DEPOSIT_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

// Alchemy API URL
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const BLOCK_DATA_FILE = path.join(__dirname, 'deposit_data.json');

if (!ALCHEMY_URL) {
    console.error('ALCHEMY_URL is not set in the environment variables');
    process.exit(1);
}

if (!ALCHEMY_URL.startsWith('https://')) {
    console.error('ALCHEMY_URL must start with https://');
    process.exit(1);
}

console.log('Using Alchemy URL:', ALCHEMY_URL);

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

async function monitorDeposits() {
    try {
        let lastProcessedBlock = '0x0';
        console.log('Starting to monitor deposits');

        setInterval(async () => {
            const transfers = await getAssetTransfers(lastProcessedBlock);
            if (transfers.length > 0) {
                console.log(`Found ${transfers.length} new deposits`);
                const deposits = await processDeposits(transfers);
                await saveDepositData(deposits);
                lastProcessedBlock = `0x${BigInt(transfers[transfers.length - 1].blockNum).toString(16)}`;
            } else {
                console.log('No new deposits found');
            }
        }, 60000); // Check every minute

    } catch (error) {
        console.error('Error in monitorDeposits:', error);
    }
}

monitorDeposits().catch(console.error);

process.on('SIGINT', () => {
    console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
    process.exit();
});