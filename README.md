# Ethereum Deposit Tracker

## Overview

The Ethereum Deposit Tracker is a tool designed to monitor deposits on the Beacon Deposit Contract and store related block data. The project utilizes Node.js and Docker for a seamless setup and deployment experience.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Running with Node.js](#running-with-nodejs)
  - [Running with Docker](#running-with-docker)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker (optional, for containerized deployment)
- Alchemy API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Tanmay4803/Ethereum-Deposit-Tracker.git
   cd Ethereum-Deposit-Tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running with Node.js

To start the Ethereum Deposit Tracker:

```
node index.js
```

The script will run continuously, checking for new deposits every minute and saving the data to `deposit_data.json`.

### Running with Docker

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
   This command runs the container in detached mode, uses the environment variables from your `.env` file, and mounts the `deposit_data.json` file to persist data between container restarts.

Alternatively, you can use Docker Compose:

1. Ensure your `docker-compose.yml` file is correctly configured.

2. Run the following command:
   ```
   docker-compose up -d
   ```

To stop the container:
```
docker-compose down
```

## Project Structure

```
Ethereum-Deposit-Tracker/
├── node_modules/
├── index.js
├── .env
├── deposit_data.json
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

- `index.js`: Main script for monitoring Ethereum deposits
- `.env`: Environment configuration file
- `deposit_data.json`: JSON file storing deposit data
- `Dockerfile`: Instructions for building the Docker image
- `docker-compose.yml`: Docker Compose configuration file

## Usage Instructions

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
  ```