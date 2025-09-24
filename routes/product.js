const express=require("express");
const router=express.Router();  // mini instance
const Product=require("../models/Product.js")   // to fetch data to show further
const Review=require("../models/Review.js")   // to fetch data to show further
const {validateProduct, isLoggedIn, isSeller, isProductAuthor}=require('../middleware.js')

// to show all the products
router.get('/products', async (req, res)=>{
    try{
        let products = await Product.find({});
        res.render('products/index' , {products});
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// to show the form for new product 
router.get('/product/new', isLoggedIn, (req, res)=>{    // ak ke liye product   
    try{
        res.render('products/new');
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// to actually add the product 
router.post('/products', isLoggedIn, isSeller, validateProduct, async (req, res)=>{
    try{
        let {name , img , price , desc} = req.body;
        await Product.create({name , img , price , desc, author:req.user._id})
        req.flash('success', 'Product added successfully')
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// to show a particular product
router.get('/products/:id', isLoggedIn, async (req, res)=>{
    try{
        let {id} = req.params;
        let foundProduct = await Product.findById(id).populate('reviews');
        res.render('products/show' , {foundProduct})  // populate kr rkha h isiliye
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// to show edit form of one product
router.get('/products/:id/edit', isLoggedIn, async(req, res)=>{
        try{
        let {id} = req.params;
        let foundProduct = await Product.findById(id);
        res.render('products/edit' , {foundProduct})
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// to actually edit the data of product
router.patch('/products/:id', isLoggedIn, isProductAuthor, validateProduct, async (req, res)=>{
    try{
        let {id} = req.params;
        let {name , img , price , desc} = req.body;
        await Product.findByIdAndUpdate( id , {name , img , price , desc}  )
        req.flash('success', 'Product edited successfully')
        res.redirect(`/products/${id}`);
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

// to delete a product
router.delete('/products/:id', isLoggedIn, isProductAuthor, async(req, res)=>{
    try{
        let {id} = req.params;
        const product = await Product.findById(id);

        for(let id of product.reviews){
            await Review.findByIdAndDelete(id);
        }

        await Product.findByIdAndDelete(id);
        req.flash('success', 'Product deleted successfully')
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error' , {err : e.message});
    }
})

module.exports=router;