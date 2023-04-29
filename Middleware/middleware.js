const graphql_client = require('graphql-client');
const controller = require('../warehouse/controller/controller');

const out = controller.addProduct({product_id:"1" ,product_name: "test", product_quantity: 10, product_price: 10 });

if(out){
    console.log("data entered");
}else{
    console.log("data not entered")
}

