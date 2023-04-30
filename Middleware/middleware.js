const graphql_client = require("graphql-client");
const controller = require("../warehouse/controller/controller");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
// controller.addProduct({product_id:"1" ,product_name: "apple", product_quantity: 100, product_price: 40000 });
// controller.addProduct({product_id:"2" ,product_name: "samsung", product_quantity: 150, product_price: 30000 });
// controller.addProduct({product_id:"3" ,product_name: "oppo", product_quantity: 80, product_price: 20000 });
// controller.addProduct({product_id:"4" ,product_name: "vivo", product_quantity: 50, product_price: 10000 });

router.get('/hello', (req, res) => {
	res.json({message:"Hello from warehouse"});
});

let mapCounter = 0;
const mapping = {
};

const queue = {
	shop1: [],
	shop2: [],
};

router.post("/registerNewService", (req, res) => {
	try{
	if(fs.existsSync('./helper.json')){
		console.log("file exists");
	}
	const serviceObj = fs.readFileSync('../Middleware/helper.json');
	const service = JSON.parse(serviceObj);
	if(!req.body.api_key){
		res.status(404).send("api key not found");
	}else{
		for(key in service) {
			if(service[key].api_key == req.body.api_key){
				res.status(400).send("api key already exists");
				return;
			}
		}
		if(!req.body.apis){
			res.status(404).send("apis not found");
		}else{
			let counter = service.counter+1;
			let apiObj=[];
			req.body.apis.forEach((api)=>{
				if(api.type == "REST"){
					apiObj.push({
						type:api.type,
						url:api.url,
						method:api.method,
						discription:api.discription,
						output_type:api.output_type,
						output:api.output,
						input:api.input,
						query:""
					});
				}else if(api.type == "GRAPHQL"){
					apiObj.push({
						type:api.type,
						url:api.url,
						method:api.method,
						discription:api.discription,
						output_type:api.output_type,
						output:api.output,
						input:"",
						query:api.query
					});
				}
			});
			let newService = {
				id:mapCounter +1,
				api_key: req.body.api_key,
				name: (req.body.name) ? req.body.name : "service-"+counter,
				apis: req.body.apis,
			}
			service[`service_provider-${counter}`] = newService;
			service.counter = counter;
			fs.writeFileSync("../Middleware/helper.json",JSON.stringify(service));
			res.status(200).send("service registered successfully");
			mapCounter++;
			mapping[mapCounter] = req.body.name;
		}
	}
	res.end("maybe Some Error");
}catch(err){
	console.log(err);
	res.end();
}
});

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
	for(key in  mapping){
		if(mapping[key] != id){
			const schema = fs.readFileSync("../Middleware/helper.json");
			const helper = JSON.parse(schema);
			for(key in helper){
				if(helper[key].id == id){
					const obj = helper[key];
					if(obj.type == "REST"){
						let mainData = {};
						let keys = Object.keys(obj.apis.input);
						let key2 = Object.keys(data);
						for(let i=0;i<keys.length;i++){
							mainData[keys[i]] = data[key2[i]];
						}
						let output ="";
						if(api.method == "GET"){
							let url = obj.apis.url;
							let query = "";
							for(key in mainData){
								query += `${key}=${mainData[key]}&`;
							}
							url += `?${query}`;
							output = await axios.get(url);
							if(output.status == 200){
								console.log("data sent successfully");
							}else{
								console.log("data not sent");
							}
						}else if(api.method == "POST"){
							output = await axios.post(obj.apis.url, mainData);
						}
						if(output.status == 200){
							console.log("data sent successfully");
						}else{
							console.log("data not sent");
						}
					}else if(obj.type == "GRAPHQL"){
						res.end("work is pending");
					}else{
						res.end("error");
					}
					res.end();
					break;
				}
			}
			break;
		}
	}


	// let mainData = {};
	// if (id == 0) {
	// 	if(queue[`shop${id}`] == []){
	// 	console.log("send to shop 1");
	// 	mainData.item_id = data.id;
	// 	mainData.item_name = data.name;
	// 	mainData.item_quantity = data.count;
	// 	const output = await axios.post("http://192.168.77.88:5000/itemChange", data);
	// 	console.log(output.status);
	// 	if(output.status == 600){
	// 		console.log("shop 1 is not available");
	// 		queue.shop1.push(mainData);
	// 	}
	// }else{
	// 	queue.shop1.push(mainData);
	// 	setTimeout(()=>{
	// 		massDataSend(id,queue.shop1);
	// 		// queue.shop1.shift();
	// 	},10000);
	// }
	// 		// .then((response) => {
				
	// 		// })
	// 		// .catch((error) => {
	// 		// 	console.log(error);
	// 		// });
	// } else if (id == 1) {
	// 	console.log("send to shop 2");
	// 	// 192.168.77.130 do graphql query in addName by posting it
	// 	const client = graphql_client({
	// 		url: "http://192.168.77.130:3000/getAllNames"
	// 	});
	// 	console.log(mainData,"url",`addName(orderId: "${data.id}", orderName: "${data.name}", orderQuantity: "${data.count}")`);
	// 	client
	// 		.query(
	// 			`{
    //         addName(orderId: "${data.id}", orderName: "${data.name}", orderQuantity: "${data.count}")
	// 			}`
	// 		)
	// 		.then(function (body) {
	// 			console.log(body,"response from shop 2");
	// 		});
	// }
};

router.post("/itemSell", (req, res) => {
	console.log("sell api request received");
	console.log(req.body);
	if (req.body == JSON.stringify({}) || req.body == null) {
		res.status(400).send("please provide details object empty");
	} else {
		controller.DecrementProductQuantity(
			req.body.id,
			req.body.count,
			req.body.me
		);
	}
	res.end();
});

module.exports = router;
