import * as rpc from 'vscode-ws-jsonrpc';
import * as ws from 'ws';


const wss = new ws.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log("connection!");

  const onMessageCallbacks = [];
  const onErrorCallbacks = [];
  const onCloseCallbacks = [];

  const socket: rpc.IWebSocket = {
    send(content: string): void { ws.send(content); },
    dispose(): void { ws.close(); },
    onMessage(cb: (data: any) => void): void { onMessageCallbacks.push(cb); },
    onError(cb: (reason: any) => void): void { onErrorCallbacks.push(cb); },
    onClose(cb: (code: number, reason: string) => void): void { onCloseCallbacks.push(cb); },
  }
  ws.on('message', message => onMessageCallbacks.forEach(cb => cb(message)));
  ws.on('error', err => onErrorCallbacks.forEach(cb => cb(err)));
  ws.on('close', (number, reason) => onCloseCallbacks.forEach(cb => cb(number, reason)));

  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);
  const logger = new rpc.ConsoleLogger();
  const connection = rpc.createMessageConnection(reader, writer, logger);
  const notification = new rpc.NotificationType<string, void>('testNotification');
  connection.onNotification(notification, (param: string) => {
    console.log(param); // This prints Hello World
  });

  connection.listen();
});
