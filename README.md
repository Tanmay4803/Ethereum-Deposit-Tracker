# Ethereum Deposit Tracker

## Overview

The Ethereum Deposit Tracker is a tool designed to monitor deposits on the Beacon Deposit Contract and store related block data. The project utilizes Node.js and Docker for a seamless setup and deployment experience.

## Project Structure and Architecture
The project directory contains the following files and folders:
<pre>
Ethereum-Deposit-Tracker/
├── node_modules/
├── index.js
├── .env
├── deposit_data.json
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
</pre>

## Setup and Installation

### Prerequisites

Before setting up the project, ensure you have the following installed:
- Docker (v20.10 or later)
- Docker Compose (v1.29 or later)
- Node.js (v16 or later) [Optional: If running outside Docker]

### Environment Configuration

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd project-folder
    ```

2. **Configure Environment Variables:**

    - Copy the `.env.example` file to `.env`:

      ```bash
      cp .env.example .env
      ```

    - Open the `.env` file in a text editor and set the required environment variables:

      ```ini
      # .env file

      # Alchemy API key for Ethereum RPC calls
      ALCHEMY_API_KEY=your_alchemy_api_key_here

      # Ethereum network to monitor (e.g., mainnet, ropsten)
      ETH_NETWORK=mainnet
      ```

      Replace `your_alchemy_api_key_here` with your actual Alchemy API key.

### Dependency Installation

#### Using Docker

1. **Build and Start the Docker Containers:**

    ```bash
    docker-compose up --build
    ```

   This command will build the Docker image based on the `Dockerfile` and start the application using Docker Compose.

#### Locally (Without Docker)

1. **Install Node.js Dependencies:**

    ```bash
    npm install
    ```

2. **Ensure the `.env` File is Configured:**

    Verify that the `.env` file contains the correct environment variables as described in the Environment Configuration section.

### Running the Application

#### Using Docker

1. **Start the Application:**

    ```bash
    docker-compose up
    ```

    This command will start the application in the background, and you can monitor its logs for activity.

2. **Check Logs:**

    To view the logs of the running Docker containers, use:

    ```bash
    docker-compose logs
    ```

#### Locally (Without Docker)

1. **Start the Application:**

    ```bash
    npm start
    ```

2. **Verify Application Status:**

    Check the terminal output for any errors or confirmation that the application is running successfully.

### Usage Instructions

1. **Monitoring Ethereum Deposits:**

    The application will automatically start monitoring the Beacon Deposit Contract for any deposits on the configured Ethereum network. Deposits and related block data will be stored as per the application's implementation.

2. **Check Logs for Activity:**

    Logs will provide information about the ongoing monitoring process, including any deposits detected and any errors encountered.

3. **Stopping the Application:**

    - **Using Docker:**

      ```bash
      docker-compose down
      ```

      This command will stop and remove the Docker containers.

    - **Locally (Without Docker):**

      Stop the application by pressing `Ctrl+C` in the terminal where `npm start` was run.

## Troubleshooting

- **Connection Issues:**

  Ensure that your Alchemy API key is valid and that the network specified in the `.env` file is correct. Verify that you have a stable internet connection.

- **Dependency Issues:**

  If encountering issues with Node.js dependencies, run:

  ```bash
  npm install

**If using Docker, ensure that the Dockerfile and docker-compose.yml are correctly configured and try rebuilding the containers with:**
    ```sh
    docker-compose up --build
    ```

