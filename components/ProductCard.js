function ProductCard({ product, onAddToCart }) {
  try {
    const { name, price, category, image, description } = product.objectData;
    
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden" data-name="product-card" data-file="components/ProductCard.js">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-amber-600">
              {formatCurrency(price)}
            </span>
            
            <button
              onClick={() => onAddToCart(product)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <div className="icon-plus text-sm"></div>
              <span className="text-sm font-medium">Tambah</span>
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductCard component error:', error);
    return null;
  }
}