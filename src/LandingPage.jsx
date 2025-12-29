import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

const LandingPage = ()=>{
    const productsURL = 'http://localhost:8000/products/';

    const [products, setProducts] = useState([]);

    const fetchProduct = async() =>{
        const request = await fetch(productsURL);
        if(request.ok){
            const responce = await request.json();
            console.log(responce);
            
            setProducts(responce);
        }
    }

    useEffect(()=>{
        fetchProduct();
    },[])

    return(
        <>
            <section className="flex justify-around items-center gap-10 flex-wrap">
                {Array.isArray(products) && products.map((product)=>(
                <ProductCard key={product.key} product={product} />   
            ))}
            </section>
        </>
    )
}

export default LandingPage;