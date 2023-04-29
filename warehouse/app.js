const express = require("express");
const connect = require("./server");
const api_router = require("./router/api_router");
const app = express();
const controller = require("./controller/controller");


app.listen(4000, () => {
    console.log("Warehouse service started on port 4000");
    connect();
    }
);

app.use('/', api_router);
