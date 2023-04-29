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

exports.sendOther = (id, data) => {
	let mainData = {};
	if (id == 0) {
		console.log("send to shop 1");
		mainData.item_id = data.id;
		mainData.item_name = data.name;
		mainData.item_quantity = data.count;
		axios
			.post("http://192.168.77.88:5000/itemChange", data)
			.then((response) => {
				console.log("response for shop-1");
			})
			.catch((error) => {
				console.log(error);
			});
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
	if (req.body == undefined) {
		res.status(400).send();
	} else {
		controller.DecrementProductQuantity(
			req.body.id,
			req.body.count,
			name,
			req.body.me
		);
	}
	res.end();
});

module.exports = router;
