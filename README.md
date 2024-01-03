> # Pulse Energy - WebSocket Data Streaming Project

## Overview

This project is designed to showcase a WebSocket server capable of handling data streaming from over 50,000 clients simultaneously. It simulates a scenario where clients continuously send meter reading data to the server.

## Features

-   Scalable WebSocket server for handling multiple client connections using.
    -  multiple cores of processor/ CPU
    -  Horizontal Pod Autoscaler (HPA) in kubernetes
      
-   Client scripts to simulate data streaming from numerous sources and mock clients can be tested using artillery.io.
-   Data parsing and handling from Excel files.
-   Development environment setup for real-time TypeScript compilation (For the bonus point 😉)

## Technology Stack

-   **Node.js**
-   **TypeScript**
-   **kubernetes**
-   **minikube**
-   **ingress**
-   **kafka**
-   **zookeeper**
-   **WebSocket** (using the `ws` library)
-   **Excel File Handling** (using the `xlsx` library)

> [!TIP]
> **FOR DEPLOYING ON KUBERNETES USING MINIKUBE, an article is coming soon..**

## Project Structure

-   `server/`: Contains WebSocket server implementation and express server.
-   `client/`: Contains WebSocket client implementation and script for sending data from Excel.
-   `kubernetes/`: Contains services, deployments, HPA, pvc for kafka service, websocket service (created in this project) and zookeeper
-   `Files/`: Contains sample data files.
-   `controllers/`: Contains controller of APIs.
-   `helpers/`: Contains batch processing of saving data to DB and helper for API controllers
-   `logic/`: Contains query builder
-   `routes/`: Contains routes of APIs
-   `store/`: Contains DB connection, kafka producer and consumer, Enums, interfaces, schema, models and data validators

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

## Running the Application (Production)

1. **Start the Server**

```
npm run start-server
```

2. **Run the Client Script to start manual client of websocket** (in a separate terminal)

```
npm run start-client
```

3. **Send Excel Data to Server** (in a separate terminal)

```
npm run start-sendData
```

4. **Start express server**
```
npm run start
```

5. **Load Testing using Artillery.io**
```
npm run loadTesting
```

## Development Mode

To run the server, client, or sendData script in development mode with real-time TypeScript compilation:

1. **Start the Server**

```
npm run dev-server
```

2. **Run the Client Script to start manual client of websocket** (in a separate terminal)

```
npm run dev-client
```

3. **Send Excel Data to Server** (in a separate terminal)

```
npm run dev-sendData
```

4. **Start express server**
```
npm run dev
```

5. **Load Testing using Artillery.io**
```
npm run loadTesting
```

## Testing

> [!TIP]
> To view API documentation for the required enpoints [click here](https://documenter.getpostman.com/view/20345587/2s9YsFFEUo)
> 

## Author

-   [**Satyam Anand**](https://github.com/SatyamAnand98)

## Screenshots

<p align="center">
  <img src="https://github.com/SatyamAnand98/pulseEnergy/blob/main/Files/screenshot.png" width="350" title="Screenshot of both websocket server(running on kubernetes) and client(running locally)">
  <img src="[your_relative_path_here_number_2_large_name](https://github.com/SatyamAnand98/pulseEnergy/blob/main/Files/screenshot2.png)" width="350" alt="Screenshot of websocket server(running on kubernetes)">
</p>

