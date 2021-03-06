const express = require('express');
const router = express.Router();

const multer = require('multer');
const imgArr = []

//Import model
const Product = require('../models/Product.js');

var storage = multer.diskStorage({
    destination: "images", 
    filename: (req, file, cb) => {
        let img = `${Date.now()}--${file.originalname}`
        cb(null,img );
        imgArr.push(img)
        // console.log(file.originalname)
    }
})
maxSize = 10*1024*1024
var upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    }
})


//Router config
//Rendering HomePage
router.get('/', (req,res)=>{
    res.send("OK.....");
});

//Get all products
router.get('/products',(req,res)=>{
    Product.find({})
    .then(data=>{res.json(data)})
    .catch(err=>{res.json({"Error":error.message}) })
});



// get dogs
router.get('/products/dogs',(req,res)=>{
Product.find({category:/d*/})
    .then(data=>{res.json(data)})
    .catch(err=>{res.json({"Error":error.message}) })
});
router.get('/products/category',(req,res)=>{
    const type = req.query.type;
    Product.find({category: type})
    .then(data=>{res.json(data)})
    .catch(err=>{res.json({"Error":error.message}) })
});

router.get('/products/cats',(req,res)=>{
Product.find({category:/c*/})
    .then(data=>{res.json(data)})
    .catch(err=>{res.json({"Error":error.message}) })
});

//Get product by id
router.get('/products/:productId', async(req,res)=>{
    // console.log(req.params.id);
    // res.send("Server received data!");
    try{
        let data = await Product.findById(req.params.productId);
        res.json(data);
    }catch(err){
        res.json({message:err.message});
    }
})

//Insert new product
router.post("/product",async(req,res)=>{
    // console.log("Data from client:", req.body);
    // res.send("Server received data!");
    let product = new Product({
        name: req.body.name,
        category: req.body.category,
        label: req.body.label,
        image: req.body.image,
        weight: req.body.weight,
        color: req.body.color,
        price: req.body.price,
        description: req.body.description,
        benefit: req.body.benefit,
        instruction: req.body.instruction
    })
    try{
        let p = await product.save();
        // res.json({status: 200,data: p});
        res.json({ message: "success" });
    }catch(err){
        res.json({message:err.message});
    }
})


router.post("/upload", upload.array('file'),
    (req, res) =>{
        const imgs = req.files
        const imgNames = imgs.map(img => img.filename)
        
        try {
              // let arr = [req.file.filename]
            //Insert Data into DB
            let productInfo =   new  Product({
                name: req.body.name,
                category: req.body.category,
                label: req.body.label,
                image: imgNames,
                weight: req.body.weight,
                color: req.body.color,
                price: req.body.price,
                description: req.body.description,
                benefit: req.body.benefit,
                instruction: req.body.instruction
            })

             productInfo.save()
// chuwa  
            // imgArr =[];
            console.log("hello")
            res.json({message: "Success"});

            // console.log(("file receive: ", req.file.filename))
        } catch (error) {
            res.json({message: "Error"})
        }
          
    }
)

//Update product
router.patch("/:id",async(req,res)=>{
    try{
        await Product.findOneAndUpdate({_id: req.params.id}, {
            $set:{name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                label: req.body.label,
                image: req.body.image,
                weight: req.body.weight,
                color: req.body.color,
                description: req.body.description,
                benefit: req.body.benefit,
                instruction: req.body.instruction}
        })
        res.json({ message: "Success" });
    }catch(err){
        res.json({message:err.message});
    }
});

//Delete product
router.delete("/:id",async(req,res)=>{
    try{
        await Product.remove({_id:req.params.id});
        res.json({ message: "Success" });
    }catch(err){
        res.json({message:err.message});
    }
})

module.exports = router;
