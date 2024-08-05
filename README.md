# Project Title: Algowiz WebSocket Assignment

## Description

In this project, we have developed a WebSocket server and a WebSocket listener. The WebSocket server sends order updates, and the WebSocket listener logs all activities, filters duplicate and redundant data, and shows actions taken like `orderUpdate`, `orderPlaced`, and `orderCanceled`. Additionally, it ensures that only the most recent update is considered every second, ignoring all previous updates within that timeframe.

## Tech Stack

- **Node.js**
- **WebSocket**

## Deployment

The WebSocket server side has been deployed using [Render](https://socket-backend-jwar.onrender.com).

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the server-side directory and install dependencies:

    ```bash
    cd serverside
    npm install
    ```

3. Navigate to the client-side directory and install dependencies:

    ```bash
    cd clientside
    npm install
    ```

### Running the Application

1. Start the server on port 3001:

    ```bash
    cd serverside
    node server.js
    ```

2. Update the WebSocket URL in the client-side code to fetch data from the WebSocket server:

    ```javascript
    const socket = new WebSocket('ws://localhost:3001');
    ```

3. Run the client-side application to start listening to the WebSocket server.

### How it Works

- **Order Updates**: The WebSocket server sends order updates.
- **Logging**: The WebSocket listener logs all the activities.
- **Filtering**: Filters out duplicate and redundant data.
- **Actions**: Shows actions taken like `orderUpdate`, `orderPlaced`, and `orderCanceled`.
- **Update Consideration**: Only the most recent update is considered every second, ignoring previous updates within that timeframe.

