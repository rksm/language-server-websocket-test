/// <reference types="ws" />

import * as rpc from 'vscode-ws-jsonrpc';
// import { Server as WebsocketServer, WebSocket } from 'ws';
import * as WebSocket from 'ws';

const host = "localhost",
      port = 9025,
      server = new WebSocket.Server({host, port});

console.log(`1. listening on ${host}:${port}`);

server.on('connection', function connection(ws: WebSocket) {
  console.log("2. client connected");

  const connection = createMessageConnection(createRPCSocket(ws));
  connection.onError(([err]) => console.error("error", err.stack));
  connection.onClose(() => console.log("CLOSED"));

  connection.listen();

  const notification = new rpc.NotificationType<string, void>('testNotification');
  connection.onNotification(notification, async (param: string) => {
    console.log("3. got notification", param);

    console.log("4. sending request...");
    let answer = await connection.sendRequest(new rpc.RequestType0("testRequest"));
    console.log("5. got testRequest answer", answer);

    console.log("DONE");
    connection.dispose();

    setTimeout(() => process.exit(0), 400);
  });


});

function createMessageConnection(socket: rpc.IWebSocket): rpc.MessageConnection {
  const reader = new rpc.WebSocketMessageReader(socket),
        writer = new rpc.WebSocketMessageWriter(socket),
        logger = new rpc.ConsoleLogger(),
        connection = rpc.createMessageConnection(reader, writer, logger);
  return connection;
}

function createRPCSocket(websocket): rpc.IWebSocket {
  const onMessageCallbacks = [];
  const onErrorCallbacks = [];
  const onCloseCallbacks = [];

  const socket: rpc.IWebSocket = {
    send(content: string): void { websocket.send(content); },
    dispose(): void { websocket.close(); },
    onMessage(cb: (data: any) => void): void { onMessageCallbacks.push(cb); },
    onError(cb: (reason: any) => void): void { onErrorCallbacks.push(cb); },
    onClose(cb: (code: number, reason: string) => void): void { onCloseCallbacks.push(cb); },
  }
  websocket.on('message', message => onMessageCallbacks.forEach(cb => cb(message)));
  websocket.on('error', err => onErrorCallbacks.forEach(cb => cb(err)));
  websocket.on('close', (number, reason) => onCloseCallbacks.forEach(cb => cb(number, reason)));

  return socket;
}
