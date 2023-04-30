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

exports.DecrementProductQuantity = async (id, count, seller_id) => {
	console.log(id, count, seller_id);
	const product = await Product.findOneAndUpdate(
		{ product_id: id },
		{ $inc: { product_quantity: -count } },
		{new: true},
	);
	console.log("Product quantity updated");
	console.log(product);
	seller_id++;
	middleware.sendOther(seller_id % 3, { id, count, name:product.product_name });
};
