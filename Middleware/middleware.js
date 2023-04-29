const graphql_client = require("graphql-client");
const controller = require("../warehouse/controller/controller");
const express = require("express");
const router = express.Router();
const axios = require("axios");
// controller.addProduct({product_id:"1" ,product_name: "apple", product_quantity: 100, product_price: 40000 });
// controller.addProduct({product_id:"2" ,product_name: "samsung", product_quantity: 150, product_price: 30000 });
// controller.addProduct({product_id:"3" ,product_name: "oppo", product_quantity: 80, product_price: 20000 });
// controller.addProduct({product_id:"4" ,product_name: "vivo", product_quantity: 50, product_price: 10000 });
const mapping = {
	0: "shop1",
	1: "shop2",
};

const queue = {
	shop1: [],
	shop2: [],
};

const massDataSend = async (id,data)=>{
	let mainData = {};
	if (id == 0) {
		console.log("send to shop 1");
		mainData.item_id = data.id;
		mainData.item_name = data.name;
		mainData.item_quantity = data.count;
		const output = await axios.post("http://192.168.77.83:5000/--url", data);
		console.log(output.status);
		if(output.status == 600){
			console.log("shop 1 is not available");
		}else if(queue[`shop${id}`] == []){
			console.log("queue is empty");
		}else if(output.status == 200){
			console.log("data sent successfully");
			queue.shop1 = [];
		}
	}
}

exports.sendOther = async (id, data) => {
	let mainData = {};
	if (id == 0) {
		if(queue[`shop${id}`] == []){
		console.log("send to shop 1");
		mainData.item_id = data.id;
		mainData.item_name = data.name;
		mainData.item_quantity = data.count;
		const output = await axios.post("http://192.168.77.88:5000/itemChange", data);
		console.log(output.status);
		if(output.status == 600){
			console.log("shop 1 is not available");
			queue.shop1.push(mainData);
		}
	}else{
		queue.shop1.push(mainData);
		setTimeout(()=>{
			massDataSend(id,queue.shop1);
			// queue.shop1.shift();
		},10000);
	}
			// .then((response) => {
				
			// })
			// .catch((error) => {
			// 	console.log(error);
			// });
	} else if (id == 1) {
		console.log("send to shop 2");
		// 192.168.77.130 do graphql query in addName by posting it
		const client = graphql_client({
			url: "http://192.168.77.130:3000/getAllNames"
		});
		console.log(mainData,"url",`addName(orderId: "${data.id}", orderName: "${data.name}", orderQuantity: "${data.count}")`);
		client
			.query(
				`{
            addName(orderId: "${data.id}", orderName: "${data.name}", orderQuantity: "${data.count}")
				}`
			)
			.then(function (body) {
				console.log(body,"response from shop 2");
			});
	}
};

router.post("/itemSell", (req, res) => {
	console.log("sell api request received");
	console.log(req.body);
	const name = mapping[req.body.me];
	if (req.body == JSON.stringify({}) || req.body == null) {
		res.status(400).send("please provide details");
	} else {
		if(!req.body.me || req.body.me=="" ||req.body.id == "" || !req.body.id || isNaN(req.body.count) || !req.body.count || req.body.count == ""){
			res.status(400).send("please provide details");
		}else{
		controller.DecrementProductQuantity(
			req.body.id,
			req.body.count,
			name,
			req.body.me
		);
		}
	}
	res.end();
});

module.exports = router;
