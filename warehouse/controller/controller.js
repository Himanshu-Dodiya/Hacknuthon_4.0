const Product = require("../model/product");
const middleware = require("../../Middleware/middleware");
exports.addProduct = async (data) => {
    console.log("here");
	const product = await new Product(data);
	product.save();
	return true;
};



function IncrementProductQuantity(id, count) {
	Product.findByIdAndUpdate(
		id,
		{ $inc: { product_quantity: count } },
		(err, product) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			} else {
				console.log("Product quantity updated");
				console.log(product);
			}
		}
	);
}

exports.DecrementProductQuantity = async (id, count,name,seller_id)=> {
	const product = await Product.findByIdAndUpdate(
		id,
		{ $inc: { product_quantity: -count }, product_change: name },{new:true},
		(err, product) => {
			if (err) {
				console.log(err);
				return res.status(500).send();
			} else {
				console.log("Product quantity updated");
				console.log(product);
			}
		}
	);
    id++;
    middleware.sendOther(id % 3, { id, count, name });
}

function updatePrice(id,price){
    Product.findByIdAndUpdate(id, { product_price: price }, (err, product) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        else {
            console.log("Product price updated");
            console.log(product);
        }
    });
}


