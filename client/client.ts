import * as rpc from 'vscode-ws-jsonrpc';

const host = "localhost", port = 9025;
log(`1. connecting to ${host}:${port}...`)
const webSocket = new WebSocket(`ws://${host}:${port}/`);

rpc.listen({
  webSocket,
  onConnection: (connection: rpc.MessageConnection) => {

    connection.onError(([err]) => log("ERROR: " + err.stack));
    connection.onClose(() => log("CLOSED"));

    log("2. connected");
    connection.listen();

    log("3. sending testNotification");
    const notification = new rpc.NotificationType<string, void>('testNotification');
    connection.sendNotification(notification, 'Hello World');

    connection.onRequest(new rpc.RequestType0("testRequest"), () => {
      log("4. got testRequest");

      setTimeout(() => {
        log("5. closing...");
        connection.dispose();
        log("DONE");
      }, 400);

      return {status: "browser got testRequest"};
    });
  }
});


function log(msg) {
  document.getElementById("log").insertAdjacentHTML("beforeend", `<pre>${msg}</pre>`);
}
