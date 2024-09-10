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
   git clone https://github.com/yourusername/Ethereum-Deposit-Tracker.git
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

1. Build the Docker image:
   ```
   docker build -t eth-deposit-tracker .
   ```

2. Run the container:
   ```
   docker run -d --name eth-deposit-tracker --env-file .env -v $(pwd)/deposit_data.json:/app/deposit_data.json eth-deposit-tracker
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
docker stop eth-deposit-tracker
```

or with Docker Compose:
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