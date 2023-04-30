const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs:60*1000,
    max:15,
    onLimitReached:function(req,res,option){
        res.status(600).send("Too many request from this IP, please try again later.")
    }
});

var data = [
    {
        orderId: "1",
        orderName: "apple",
        orderPrice: "50000",
        orderQuantity: "10"
    },
    {
        orderId: "2",
        orderName: "samsung",
        orderPrice: "30000",
        orderQuantity: "100"
    },
    {
        orderId: "3",
        orderName: "oppo",
        orderPrice: "20000",
        orderQuantity: "80"
    },
    {
        orderId:"4",
        orderName:"vivo",
        orderPrice:"10000",
        orderQuantity:"10"
    },
];


const schema = buildSchema(`

type Name{
    orderId:String,
    orderName : String,
    orderPrice : String,
    orderQuantity : String
}

type Query {
    getAllNames : [Name],
    getNameById(id: String!) : Name,
    deleteNameById(id:String!): Name,
    addName(orderId: String!,orderName: String!, orderPrice: String, orderQuantity: String!): String,
    reduceQuantityById(id:String!, quantity: String!) : Name
}
`);

const root = {
    getAllNames: () => data,


    getNameById: ({ id }) => {
        return data.find(obj => obj.orderId === id);
    },


    deleteNameById: ({ id }) => {
        const index = data.findIndex(obj => obj.orderId === id);
        console.log("@@", index);
        if (index !== -1) {
            let deletedObj = data[index];
            delete data[index];
            // api call to my api 
            axios.post("http://192.168.77.88:4000/sell?me=1", [deletedObj])
                .then((res) => {
                    console.log(res);
                });
            return deletedObj;
        }
         else {
            return ;
        }
    },

    addName: ({ orderName, orderPrice, orderQuantity }) => {
        const existingIndex = data.findIndex(obj => obj.orderName === orderName);
        if (existingIndex !== -1) {
            data[existingIndex].orderQuantity = String(parseInt(data[existingIndex].orderQuantity) + parseInt(orderQuantity));
            // return data[existingIndex];
            console.log("api working fine");
            return "done";
        } else {
            const newObject = {
                orderId: String(data.length + 1),
                orderName,
                orderPrice,
                orderQuantity
            };
            data.push(newObject);
            console.log("api working fine");
            // return newObject;
            return "Done";
        }
    },


    reduceQuantityById: ({ id, quantity }) => {
        const index = data.findIndex(obj => obj.orderId === id);
        if (index !== -1) {
          const obj = data[index];
          const newQuantity = parseInt(obj.orderQuantity) - quantity;
          const sell={
            me:1,
            id: id,
            count : quantity,
          }
          axios.post("http://192.168.77.88:4000/itemSell", sell)
                .then((res) => {
                    console.log(res);
                });
          if (newQuantity < 0) {
            throw new Error(`Quantity for order ${id} cannot be reduced below 0.`);
          }
          obj.orderQuantity = String(newQuantity);
          return obj;
        } else {
          throw new Error(`Order ${id} not found.`);
        }
      },

};

app.use(limiter);

app.use(
    '/getAllNames',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

app.get('/',(req,res)=>{
    res.send(data)
});

app.listen(3000, () => { console.log('running') });