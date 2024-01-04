import Waffle from "./lib/index.js";

const server = new Waffle();

server.get("/", (res) => {
  res.send("Hello, World!", 200, "text/html");
});

server.get("/about", (res) => {
  res.html("index");
});

server.get("/login", (res) => {
  res.html("login");
});

server.get("/api", (res) => {
  res.json({ name: "Nitin", surname: "Chaudhary", address: "India" }, 200);
});

server.start(8000, () => console.log("running on port 8000"));
