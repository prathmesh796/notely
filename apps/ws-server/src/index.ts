import WebSocket, { WebSocketServer } from 'ws';

// Define the port on which the WebSocket server will run
const PORT = 8080;

// Create a new WebSocket server instance
const wss = new WebSocketServer({ port: PORT });

// Function to broadcast a message to all connected clients
const broadcastMessage = (message: string) => {
  // Iterate over all connected clients
  wss.clients.forEach(client => {
    // Check if the client's connection is open before sending the message
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Event listener for new client connections
wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected.');

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server!');

  // Listen for messages from the client
  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
    // Broadcast the received message to all connected clients
    broadcastMessage(`Client says: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});

console.log(`WebSocket server running on port ${PORT}`);
