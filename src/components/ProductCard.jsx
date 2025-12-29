import React from "react";

const BASE_URL = "http://192.168.1.104:8000"; // Your Django Server URL

const ProductCard = ({ product })=> {
    // Get the first image from the array, or a placeholder if empty
    const mainImage = product.product_image && product.product_image.length > 0 
        ? `${product.product_image[0].image}` 
        : "https://via.placeholder.com/300";

    const altText = product.product_image && product.product_image.length > 0 
        ? product.product_image[0].alt_text 
        : product.name;

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="h-56 w-full overflow-hidden bg-gray-100">
                <img 
                    src={`http://localhost:8000/${mainImage}`} 
                    alt={altText} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Product Info */}
            <div className="p-5 text-left">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    ID: {product.id}
                </span>
                
                <h5 className="mt-2 mb-1 text-xl font-bold tracking-tight text-gray-900 line-clamp-1">
                    {product.name}
                </h5>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-green-700">
                        ৳{parseFloat(product.price).toLocaleString()}
                    </span>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center">
                        Add to Cart
                    </button>
                </div>
                
                {/* Stock Info (Small indicator) */}
                <p className="mt-3 text-sm text-gray-500">
                    {product.product_stock?.length > 0 ? "✅ In Stock" : "❌ Out of Stock"}
                </p>
            </div>
        </div>
    );
}

export default ProductCard;
