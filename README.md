# lsp via websockets

Test of using the [MS language server protocol](https://github.com/Microsoft/language-server-protocol) via websockets.  This is a test setup for the [vscode-ws-jsonrpc project](https://github.com/TypeFox/vscode-ws-jsonrpc).

## Usage

1. Make sure you have typescript and webpack installed (`npm install --global typescript webpack`)
2. Run build.sh. This will create `server/server.js` and `client/client.js`.
3. Run `node server/server.js`;
4. Open test.html. You should see a connection / notification / request flow being logged in server and client.

# LICENSE

[MIT](LICENSE)
