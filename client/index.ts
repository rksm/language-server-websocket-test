import * as rpc from 'vscode-ws-jsonrpc';

const webSocket = new WebSocket('ws://localhost:8080/');
rpc.listen({
  webSocket,
  onConnection: (connection: rpc.MessageConnection) => {
    console.log("Connection!");
    const notification = new rpc.NotificationType<string, void>('testNotification');
    connection.listen();
    connection.sendNotification(notification, 'Hello World');
  }
});


