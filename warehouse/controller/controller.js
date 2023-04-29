const Product = require('../model/product');

var data = {
    product_id: "P0001",
    product_name: "Product 1",
    product_price: 100,
    product_quantity: 50
}

exports.addProduct = async(req, res) => {
    const product = await new Product(data)
    product.save((err, product) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(product);
        console.log("Product added");
    });

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


