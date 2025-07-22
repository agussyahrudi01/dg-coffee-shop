function Cart({ items, customer, onUpdateQuantity, onCheckout }) {
  try {
    const subtotal = items.reduce((sum, item) => sum + (item.objectData.price * item.quantity), 0);
    const { discount, discountPercentage } = calculateDiscount(customer, subtotal);
    const total = subtotal - discount;
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4" data-name="cart" data-file="components/Cart.js">
        <div className="flex items-center space-x-2 mb-4">
          <div className="icon-shopping-cart text-xl text-amber-600"></div>
          <h2 className="text-lg font-semibold text-gray-900">Keranjang</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="icon-shopping-bag text-4xl text-gray-300 mb-2"></div>
            <p className="text-gray-500">Keranjang kosong</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.objectId} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{item.objectData.name}</h4>
                    <p className="text-xs text-gray-600">{formatCurrency(item.objectData.price)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item.objectId, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <div className="icon-minus text-xs"></div>
                    </button>
                    
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.objectId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <div className="icon-plus text-xs"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                
                {customer && discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Diskon ({discountPercentage}%):</span>
                    <span className="text-sm text-green-600">-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-amber-600">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error('Cart component error:', error);
    return null;
  }
}