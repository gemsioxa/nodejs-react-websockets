const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const config = require('./config.json');

const name = config.hashName;
const password = config.hashPassword;

const messages = [];

wss.on('listening', () => {
    console.log(`Server listening on port: ${wss.address().port}`);
})
wss.on('connection', onConnect);

wss.broadcast = function(data, sender) {
  wss.clients.forEach(function each(client) {
    if (client !== sender) {
      client.send(data);
    }
  });
}
function onConnect(ws) {
  console.log('Client connected');
  const connectReply = {
    "action": 'INFO',
    "message": {
      "description": "Connection established!"
    }
  }
  ws.send(JSON.stringify(connectReply));

  ws.on('message', function(message) {        
      try {
        const jsonMessage = JSON.parse(`${message}`);
        switch (jsonMessage.action) {
          case 'AUTH':
            onAuth(ws, JSON.parse(jsonMessage.data));
            break;
          case 'PING':
            setTimeout(function() {
              const pongReply = {
                ...jsonMessage,
                message: {
                  "description": "Pong"
                }
              }
              ws.send(JSON.stringify(pongReply));
            }, 2000);
            break;
          case 'COMMAND':
            onCommand(ws, JSON.parse(jsonMessage.data));
            break;
          case 'CHAT': 
            onChat(ws, JSON.parse(jsonMessage.data));
            break;
          default:
            console.log('Unknown message type');
            break;
          }
        } catch (error) {
          console.log('Error', error);
        }
  });
  ws.on('close', function() {
    console.log('Client disconnected');
  });
}

function onAuth(ws, message) {
  const isValid = (message) => {
    return name.find((item) => item === message.hashName) && password.find((item) => item === message.hashPassword);
  }
  if (isValid) {
    console.log('Authenticated');
    const reply = {
      "action": 'AUTH',
      "message": message,
      "messages": messages
    }
    ws.send(JSON.stringify(reply));
    ws.send(JSON.stringify({"action": "INFO", "message": {"description": "Authenticated!"}}));
  } else {
    const error = {
      "action": 'ERROR',
      "message": {
        ...message,
        "description": "Invalid password! Connection closed."
      }
    }
    ws.send(JSON.stringify(error));
    ws.close();
  }
}

function onCommand(ws, message) {
  if (message.command.toUpperCase() === 'EXIT') {
    ws.send(JSON.stringify({"action": "INFO", "message": {"description": "Connection closed."}}));
    ws.close();
    return;
  }

  const reply = {
    "action": 'COMMAND',
    "message": message
  }

  ws.send(JSON.stringify(reply));
}

function onChat(ws, message) {
  const newMessage = {
    "author": message.author,
    "message": message.message
  }
  messages.push(newMessage);

  wss.broadcast(JSON.stringify({"action": "CHAT", "messages": messages}), ws);
  ws.send(JSON.stringify({"action": "CHAT", "messages": messages}));

}