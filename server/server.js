"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc = require("vscode-ws-jsonrpc");
const ws = require("ws");
const wss = new ws.Server({ port: 8080 });
wss.on('connection', function connection(ws) {
    console.log("connection!");
    const onMessageCallbacks = [];
    const onErrorCallbacks = [];
    const onCloseCallbacks = [];
    const socket = {
        send(content) { ws.send(content); },
        dispose() { ws.close(); },
        onMessage(cb) { onMessageCallbacks.push(cb); },
        onError(cb) { onErrorCallbacks.push(cb); },
        onClose(cb) { onCloseCallbacks.push(cb); },
    };
    ws.on('message', message => onMessageCallbacks.forEach(cb => cb(message)));
    ws.on('error', err => onErrorCallbacks.forEach(cb => cb(err)));
    ws.on('close', (number, reason) => onCloseCallbacks.forEach(cb => cb(number, reason)));
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const logger = new rpc.ConsoleLogger();
    const connection = rpc.createMessageConnection(reader, writer, logger);
    const notification = new rpc.NotificationType('testNotification');
    connection.onNotification(notification, (param) => {
        console.log(param); // This prints Hello World
    });
    connection.listen();
});
