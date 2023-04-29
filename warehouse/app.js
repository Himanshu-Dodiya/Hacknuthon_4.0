const express = require("express");
const connect = require("./server");
const app = express();
const middleware = require("../Middleware/middleware");

app.use('/',middleware);
app.listen(4000, () => {
    console.log("Warehouse service started on port 4000");
    connect();
    }
);

process.on("uncaughtException", (err) => {
    console.log(err);
});
