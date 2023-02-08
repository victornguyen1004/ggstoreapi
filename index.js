const express = require("express");
const app = express();
const port = 3000;

app.get("/tin-tuc", (req, res) => {
  return res.send("Hello nè!");
});

app.listen(port, () => {
  console.log("Hihi haha tiki taka");
});
