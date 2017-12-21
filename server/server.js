"use strict";
/// <reference types="ws" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc = require("vscode-ws-jsonrpc");
// import { Server as WebsocketServer, WebSocket } from 'ws';
const WebSocket = require("ws");
const host = "localhost", port = 9025, server = new WebSocket.Server({ host, port });
console.log(`1. listening on ${host}:${port}`);
server.on('connection', function connection(ws) {
    console.log("2. client connected");
    const connection = createMessageConnection(createRPCSocket(ws));
    connection.onError(([err]) => console.error("error", err.stack));
    connection.onClose(() => console.log("CLOSED"));
    connection.listen();
    const notification = new rpc.NotificationType('testNotification');
    connection.onNotification(notification, (param) => __awaiter(this, void 0, void 0, function* () {
        console.log("3. got notification", param);
        console.log("4. sending request...");
        let answer = yield connection.sendRequest(new rpc.RequestType0("testRequest"));
        console.log("5. got testRequest answer", answer);
        console.log("DONE");
        connection.dispose();
        setTimeout(() => process.exit(0), 400);
    }));
});
function createMessageConnection(socket) {
    const reader = new rpc.WebSocketMessageReader(socket), writer = new rpc.WebSocketMessageWriter(socket), logger = new rpc.ConsoleLogger(), connection = rpc.createMessageConnection(reader, writer, logger);
    return connection;
}
function createRPCSocket(websocket) {
    const onMessageCallbacks = [];
    const onErrorCallbacks = [];
    const onCloseCallbacks = [];
    const socket = {
        send(content) { websocket.send(content); },
        dispose() { websocket.close(); },
        onMessage(cb) { onMessageCallbacks.push(cb); },
        onError(cb) { onErrorCallbacks.push(cb); },
        onClose(cb) { onCloseCallbacks.push(cb); },
    };
    websocket.on('message', message => onMessageCallbacks.forEach(cb => cb(message)));
    websocket.on('error', err => onErrorCallbacks.forEach(cb => cb(err)));
    websocket.on('close', (number, reason) => onCloseCallbacks.forEach(cb => cb(number, reason)));
    return socket;
}
