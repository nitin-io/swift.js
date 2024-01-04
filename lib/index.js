import { createServer } from "node:http";
import { resolve } from "node:path";
import { createReadStream, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

class Waffle {
  constructor() {
    this._routes = new Map();
  }

  get(path, handler) {
    this._routes.set(path, handler);
  }

  send(res) {
    return (content, status = 200, contentType = "text/plain") => {
      res.writeHead(status, { "Content-type": contentType });
      res.write(content);
      res.end();
    };
  }

  _router(path, res) {
    let routeHandler = this._routes.get(path);
    return routeHandler
      ? routeHandler(res)
      : res.send(`<h2>Route not found!</h2>`, 404, "text/html");
  }

  json(res) {
    return (dataObj, status) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(dataObj));
    };
  }

  html(res) {
    return (page) => {
      const filePath = resolve(__dirname, "../views", page);
      const readStream = createReadStream(`${filePath}.html`);
      let html = "";
      readStream.on("error", () => {
        res.writeHead(404);
        res.end("404 | Page not found!");
      });
      readStream.on("data", (data) => {
        html += data;
      });
      readStream.on("end", () => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      });
    };
  }

  start(port, cb) {
    return createServer((req, res) => {
      const routePath = req.url.toLowerCase();
      res.send = this.send(res);
      res.json = this.json(res);
      res.html = this.html(res);
      return this._router(routePath, res);
    }).listen(port, cb);
  }
}

export default Waffle;
