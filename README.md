> # Pulse Energy - WebSocket Data Streaming Project

## Overview

This project is designed to showcase a WebSocket server capable of handling data streaming from over 50,000 clients simultaneously. It simulates a scenario where clients continuously send meter reading data to the server.

> [!TIP]
> **In theory, a server can handle up to 65,536 sockets per single IP address**

## Features

- [x] Scalable WebSocket server for handling multiple client connections using.
    -  [x] multiple cores of processor/ CPU
    -  [x] Horizontal Pod Autoscaler (HPA) in kubernetes
    -  [x] Including pub/sub to handle unpredictable scalability
      
-   [x] Client scripts to simulate data streaming from numerous sources and mock clients can be tested using artillery.io.
-   [x] Saving load on machine by batch processing of data with a flexibility of batch processing by size of buffer or sampling frequency
-   [x] handling the race condition of batch processing.
-   [x] Data parsing and handling from Excel files.
-   [x] Development environment setup for real-time TypeScript compilation (For the bonus point 😉)
-   [x] For API endpoint, to fetch data at better pace, created a balance of indexing data while storing.
-   [x] used OLAP method to store and fetch data from DB.

## Improvements (did not include in current submission as the clients connection and load shed was handled by artillery)

-    [ ] Load Shedding of rejected/ idle websocket connections on server and client ends
-    [ ] Restoring connections by storing the connection config into zookeeper.
-    [ ] Increasing the waiting time between retries to maximum backoff time.
-    [ ] Making backoff time random, so that not all clients reconnect simultaneously.
-    [ ] Manage stream resumes after reconnection of clients by maintaining cache/ persistant storage.
-    [ ] Managing frequency of heartbeats, to keep track of idle connection, so that longer idle clients create a new connection when needed rather than keeping the connection alive.

-    [ ] Use of master and slave database, to ensure faster accessibility of data from analytical database that offers only read only operation.
-    [ ] Use of multiple slave databases to ensure load balancing on database. Bulk write into slave database and eventually, written to master database.

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

> [!NOTE]
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

## API Docs

> [!IMPORTANT]
> To view API documentation for the required enpoints [click here](https://documenter.getpostman.com/view/20345587/2s9YsFFEUo)
> 

## Author

-   [**Satyam Anand**](https://github.com/SatyamAnand98)

## Screenshots

<p align="center">
  <img src="https://github.com/SatyamAnand98/pulseEnergy/blob/496193b28c94f5c40e7e76f9c1cf0196c7fed97e/Files/screenshots.png" width="350" title="Screenshot of both websocket server(running on kubernetes) and client(running locally)">
  <img src="https://github.com/SatyamAnand98/pulseEnergy/blob/496193b28c94f5c40e7e76f9c1cf0196c7fed97e/Files/screenshot2.png" width="350" alt="Screenshot of websocket server(running on kubernetes)">
</p>

