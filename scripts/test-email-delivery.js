import assert from "node:assert/strict";
import net from "node:net";

const messages = [];
const server = net.createServer((socket) => {
  let buffer = "";
  let dataMode = false;
  socket.setEncoding("utf8");
  socket.write("220 localhost ESMTP WheelsAndWheelsTest\r\n");
  socket.on("data", (chunk) => {
    buffer += chunk;
    while (buffer.length) {
      if (dataMode) {
        const end = buffer.indexOf("\r\n.\r\n");
        if (end === -1) return;
        messages.push(buffer.slice(0, end));
        buffer = buffer.slice(end + 5);
        dataMode = false;
        socket.write("250 2.0.0 queued\r\n");
        continue;
      }
      const lineEnd = buffer.indexOf("\r\n");
      if (lineEnd === -1) return;
      const line = buffer.slice(0, lineEnd);
      buffer = buffer.slice(lineEnd + 2);
      const command = line.split(" ", 1)[0].toUpperCase();
      if (command === "EHLO" || command === "HELO")
        socket.write("250-localhost\r\n250-AUTH PLAIN\r\n250 SIZE 1000000\r\n");
      else if (command === "AUTH") socket.write("235 2.7.0 authenticated\r\n");
      else if (command === "MAIL" || command === "RCPT" || command === "RSET")
        socket.write("250 2.1.0 ok\r\n");
      else if (command === "DATA") {
        dataMode = true;
        socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
      } else if (command === "NOOP") socket.write("250 2.0.0 ok\r\n");
      else if (command === "QUIT") {
        socket.write("221 2.0.0 bye\r\n");
        socket.end();
      } else socket.write("250 2.0.0 ok\r\n");
    }
  });
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});

const address = server.address();
process.env.SMTP_HOST = "127.0.0.1";
process.env.SMTP_PORT = String(address.port);
process.env.SMTP_SECURE = "false";
process.env.SMTP_USER = "website@example.test";
process.env.SMTP_PASS = "test-only-password";
process.env.NOTIFICATION_EMAIL = "sales@example.test";

const { closeNotificationTransport, sendNotification } = await import(
  `../server/notifications.js?test=${Date.now()}`
);

try {
  const sent = await sendNotification({
    subject: "RFQ delivery test",
    heading: "Safe delivery test",
    replyTo: "customer@example.test",
    fields: [
      ["RFQ reference", "WW-20260930-ABC234"],
      ["Escaped content", "<script>alert('unsafe')</script>"],
    ],
  });
  assert.equal(sent, true, "SMTP acceptance should be reported as sent");
  assert.equal(messages.length, 1, "Exactly one test email should be accepted");
  assert.match(messages[0], /sales@example\.test/i);
  const htmlPart = messages[0].split("Content-Type: text/html")[1] || "";
  assert.doesNotMatch(htmlPart, /<script>alert/);
  assert.match(htmlPart, /&lt;script&gt;/);
  console.log("Passed local SMTP acceptance and HTML-escaping checks.");
} finally {
  closeNotificationTransport();
  await new Promise((resolve) => server.close(resolve));
}
