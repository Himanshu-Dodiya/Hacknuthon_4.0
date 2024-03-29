const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;
const apiData = "./orders.json";
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// let Data = fs.readFileSync("./orders.json");
let Stock = [
  {
      "item_id":"1", 
      "item_name":"apple",
      "item_price":50000,
      "item_quantity":10
  },
  {
      "item_id":"2",
      "item_name":"samsung",
      "item_price":30000,
      "item_quantity":150
  },
  {
      "item_id":"4",
      "item_name":"vivo",
      "item_price":10000,
      "item_quantity":50
  },
  {
      "item_id":"3",
      "item_name":"oppo",
      "item_price":20000,
      "item_quantity":80
  }
];

// limit each client to 10 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each client to 20 requests per windowMs
  onLimitReached: function (req, res, options) {
    res.status(600).send("Too many requests from this IP, please try again later.");
  },
});


app.use(limiter);
app.use(express.json());
app.use(cors());

// Read all orders
// app.get("/orders", (req, res) => {
//   fs.readFile(apiData, (err, data) => {
//     if (err) {
//       res.status(500).send({ error: "Unable to read orders file." });
//     } else {
//       const orders = JSON.parse(data);
//       res.send(orders);
//     }
//   });
// });

// // Read a single order
// app.get("/orders/:orderNumber", (req, res) => {
//   const orderNumber = req.params.orderNumber;
//   fs.readFile(apiData, (err, data) => {
//     if (err) {
//       res.status(500).send({ error: "Unable to read orders file." });
//     } else {
//       const orders = JSON.parse(data);
//       const order = orders.find((o) => o.order.order_number === orderNumber);
//       if (order) {
//         res.send(order);
//       } else {
//         res.status(404).send({ error: "Order not found." });
//       }
//     }
//   });
// });

// // Create a new order
// app.post("/orders", (req, res) => {
//   const order = req.body;
//   fs.readFile(apiData, (err, data) => {
//     if (err) {
//       res.status(500).send({ error: "Unable to read orders file." });
//     } else {
//       const orders = JSON.parse(data);
//       orders.push(order);
//       fs.writeFile(apiData, JSON.stringify(orders), (err) => {
//         if (err) {
//           res.status(500).send({ error: "Unable to write to orders file." });
//         } else {
//           res.send({ message: "Order created successfully." });
//         }
//       });
//     }
//   });
// });

// // Update an existing order
// app.put("/orders/:order_number/item/:p_id", (req, res) => {
//   const orderNumber = req.params.order_number;
//   const productId = req.params.p_id;
//   const newQuantity = 3;

//   // Load the order data from your database
//   // ...

//   // Find the item to update
//   const itemToUpdate = order.items.find((item) => item.p_id === productId);

//   if (!itemToUpdate) {
//     res.status(404).send(`Item with ID ${productId} not found in order`);
//     return;
//   }

//   // Update the quantity
//   itemToUpdate.quantity = newQuantity;

//   // Save the updated order data to your database
//   // ...

//   res.send(
//     `Quantity of item ${productId} in order ${orderNumber} has been updated to ${newQuantity}`
//   );
// });

// // Delete an existing order
// app.delete("/orders/deleteorder/:orderNumber", (req, res) => {
//   const orderNumber = req.params.orderNumber;
//   let deletedObject;

//   Data.forEach((obj) => {
//     if (obj.order_number == orderNumber) {
//       deletedObject = obj;
//       delete obj;
//     }
//   });
//   // axios
//   //   .post("http://192.168.77.88:4000/sell?me=0", deletedObject)
//   //   .then((res) => {
//   //     console.log(res);
//   //   });
// });

app.post("/itemChange", function updatedItem(req, res) {
  console.log("item change request found");
  let updatedObj = req.body;
  let stock = fs.readFileSync("./stock.json");
  stock.forEach((obj) => {
    if (obj.item_id == updatedObj.item_id) {
      obj.item_quantity += updatedObj.item_quantity;
      console.log("hurray the api worked");
      res.status(200).send();
    }
  });
  res.end();
});

// req = {id,name,quantity}

app.post("/sellItem",(req,res)=>{
  try{
   console.log("itm sell request found",req.body);
    // const {id} = req.body;
    let change = false,changedObj;
    // console.log(Stock)
    Stock.forEach((obj)=>{
      console.log(obj)
      if(obj.item_id == req.body.item_id){
        obj.item_quantity -= req.body.item_quantity;
        change = true;
        changedObj = obj;
        console.log(changedObj);
      }
    })
    var newObj = {me:0,id:changedObj.item_id,name:changedObj.item_name,count:req.body.item_quantity}
    if(change){
      console.log("req send")
      const option = {
        url : "http://192.168.77.88:4000/itemSell",
        method : "post",
        data : JSON.stringify(newObj),
         headers: { "Content-Type": "application/json" },
      }
      axios(option).then((res) => {
      console.log("respones recieved");
    }).catch(err => {
      console.log(err);
    })
    }
    res.send("data modified success");
  }catch(err){
    console.log(err)
  }

})

app.get("/stock", (req, res) => {
  res.send(Stock);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
