const Product = require('../model/product');


exports.addProduct = async (data) => {
    const product = await new Product(data)
    product.save((err, product) => {
        if (err) {
            console.log(err);
            return false;
        }
        console.log("Product added");
    });
    return true;
}

exports.getProducts = (req, res) => {
// get data frome database

    Product.find({}, (err, products) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(products);
    });
};

exports.getProductById = (req, res) => {
    const id = req.params.id;
    Product.findById(id, (err, product) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(product);
    });
};

 function IncrementProductQuantity(id, count) {
    Product.findByIdAndUpdate(id, { $inc: {product_quantity: count } }, (err, product) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        else {
            console.log("Product quantity updated");
            console.log(product);

        }
    });
}

function DecrementProductQuantity(id, count) {
    Product.findByIdAndUpdate(id, { $inc: { product_quantity: -count } }, (err, product) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        else {
            console.log("Product quantity updated");
            console.log(product);

        }
    });
}

