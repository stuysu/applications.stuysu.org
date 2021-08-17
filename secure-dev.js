// This file lets you run the next.js dev server on a secure localhost port
// This allows you to test the Google One-Tap feature which only works with https

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const keysExist =
  fs.existsSync("certificates/localhost.crt") &&
  fs.existsSync("certificates/localhost.key");

if (!keysExist) {
  throw new Error(
    "you need to generate the localhost keys first. Run the following in your terminal \nsource generate-local-certs.sh"
  );
}

const app = next({ dev: true });
const handle = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost.key"),
  cert: fs.readFileSync("./certificates/localhost.crt"),
};
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost:3000");
  });
});
