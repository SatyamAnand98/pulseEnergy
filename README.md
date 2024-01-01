> # Pulse Energy - WebSocket Data Streaming Project

## Overview

This project is designed to showcase a WebSocket server capable of handling data streaming from over 50,000 clients simultaneously. It simulates a scenario where clients continuously send meter reading data to the server.

## Features

-   Scalable WebSocket server for handling multiple client connections.
-   Client scripts to simulate data streaming from numerous sources.
-   Data parsing and handling from Excel files.
-   Development environment setup for real-time TypeScript compilation.

## Technology Stack

-   **Node.js**
-   **TypeScript**
-   **WebSocket** (using the `ws` library)
-   **Excel File Handling** (using the `xlsx` library)

## Project Structure

-   `server/`: Contains WebSocket server implementation.
-   `client/`: Contains WebSocket client implementation and script for sending data from Excel.
-   `Files/`: Contains sample data files.

## Setup and Installation

Make sure you have Node.js (version 16 or later) installed on your system.

1. **Clone the Repository**

```
git clone https://github.com/SatyamAnand98/pulseEnergy.git
cd pulse-energy
```

3. **Install Dependencies**

```
npm install
```

4. **Build the Project**

```
npm run build
```

## Running the Application

1. **Start the Server**

```
npm run start-server
```

2. **Run the Client Script** (in a separate terminal)

```
npm run start-client
```

3. **Send Excel Data to Server** (in a separate terminal)

```
npm run start-sendData
```

## Development Mode

To run the server, client, or sendData script in development mode with real-time TypeScript compilation:

-   **Server**: `npm run dev-server`
-   **Client**: `npm run dev-client`
-   **Send Data**: `npm run dev-sendData`

## Testing

> [!TIP]
> The project includes scripts to simulate multiple clients sending data to the server. You can adjust the number of simulated clients and the frequency of data transmission in the `sendExcelData.ts` script.

## Author

-   [**Satyam Anand**](https://github.com/SatyamAnand98)
