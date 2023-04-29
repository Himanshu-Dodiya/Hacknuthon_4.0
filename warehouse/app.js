const express = require("express");
const connect = require("./server");
const api_router = require("./router/api_router");
const app = express();
const middleware = require("../Middleware/middleware");


app.listen(4000, () => {
    console.log("Warehouse service started on port 4000");
    connect();
    }
);

process.on("uncaughtException", (err) => {
    console.log(err);
});
