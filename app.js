class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [products, setProducts] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('pos');
    const [lowStockItems, setLowStockItems] = React.useState([]);
    const [customer, setCustomer] = React.useState(null);
    const [showReceipt, setShowReceipt] = React.useState(false);
    const [lastSale, setLastSale] = React.useState(null);
    const [showStockNotification, setShowStockNotification] = React.useState(true);
    React.useEffect(() => {
      loadProducts();
      registerServiceWorker();
    }, []);

    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('sw.js');
          console.log('Service Worker registered');
        } catch (error) {
          console.log('Service Worker registration failed:', error);
        }
      }
    };

    const loadProducts = async () => {
      try {
        const response = await trickleListObjects('product', 50, true);
        setProducts(response.items);
        checkLowStock(response.items);
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    const checkLowStock = (productList) => {
      const lowStock = productList.filter(product => {
        const stock = product.objectData.stock || 0;
        const minStock = product.objectData.minStock || 5;
        return stock <= minStock;
      });
      setLowStockItems(lowStock);
      // Show notification again if there are new low stock items
      if (lowStock.length > 0) {
        setShowStockNotification(true);
      }
    };

    const addToCart = (product) => {
      const stock = product.objectData.stock || 0;
      const existingItem = cartItems.find(item => item.objectId === product.objectId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      
      if (currentQuantity >= stock) {
        alert(`Stok tidak mencukupi! Stok tersedia: ${stock}`);
        return;
      }
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.objectId === product.objectId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    };

    const updateCartQuantity = (productId, newQuantity) => {
      if (newQuantity === 0) {
        setCartItems(cartItems.filter(item => item.objectId !== productId));
      } else {
        setCartItems(cartItems.map(item =>
          item.objectId === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      }
    };

    const clearCart = () => {
      setCartItems([]);
      setIsCheckoutOpen(false);
    };

    const handleSaleComplete = async (saleData) => {
      try {
        // Update stock
        for (const item of cartItems) {
          const currentStock = item.objectData.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          await trickleUpdateObject('product', item.objectId, {
            ...item.objectData,
            stock: newStock
          });
        }
        
        // Save sale record
        const saleRecord = await trickleCreateObject('sale', {
          customerName: saleData.customerName,
          items: JSON.stringify(cartItems.map(item => ({
            name: item.objectData.name,
            price: item.objectData.price,
            quantity: item.quantity
          }))),
          total: saleData.total,
          paymentMethod: saleData.paymentMethod,
          saleDate: new Date().toISOString()
        });

        // Update customer loyalty points
        if (customer) {
          const points = Math.floor(saleData.total / 1000);
          await updateCustomerLoyalty(customer.objectId, points, saleData.total);
        }

        // Set receipt data and show receipt
        setLastSale({
          ...saleData,
          items: cartItems,
          saleId: saleRecord.objectId,
          customer: customer
        });
        setShowReceipt(true);

        loadProducts();
        clearCart();
      } catch (error) {
        console.error('Error completing sale:', error);
      }
    };

    const updateCustomerLoyalty = async (customerId, points, purchaseAmount) => {
      try {
        const customerData = await trickleGetObject('customer', customerId);
        const newPoints = (customerData.objectData.loyaltyPoints || 0) + points;
        const newTotal = (customerData.objectData.totalPurchases || 0) + purchaseAmount;
        
        let membershipLevel = 'Bronze';
        if (newTotal >= 1000000) membershipLevel = 'Gold';
        else if (newTotal >= 500000) membershipLevel = 'Silver';

        await trickleUpdateObject('customer', customerId, {
          ...customerData.objectData,
          loyaltyPoints: newPoints,
          totalPurchases: newTotal,
          membershipLevel
        });
      } catch (error) {
        console.error('Error updating customer loyalty:', error);
      }
    };

    const categories = ['All', ...new Set(products.map(p => p.objectData.category))];
    const filteredProducts = selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.objectData.category === selectedCategory);

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lowStockCount={lowStockItems.length}
        />
        
        <div className="container mx-auto px-4 py-6">
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                        <div className="bg-gray-300 h-4 rounded mb-2"></div>
                        <div className="bg-gray-300 h-4 rounded mb-2 w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.objectId}
                        product={product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <CustomerLoyalty customer={customer} onCustomerSelect={setCustomer} />
                <Cart 
                  items={cartItems}
                  customer={customer}
                  onUpdateQuantity={updateCartQuantity}
                  onCheckout={() => setIsCheckoutOpen(true)}
                />
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'reports' && <SalesReport />}
          {activeTab === 'stock' && <StockManagement products={products} onProductUpdate={loadProducts} />}
          {activeTab === 'suppliers' && <SupplierManagement />}
          {activeTab === 'purchase' && <PurchaseOrders />}
          {activeTab === 'finance' && <FinancialModule />}
          {activeTab === 'reservations' && <TableReservation />}
          {activeTab === 'employees' && <EmployeeManagement />}
          {activeTab === 'promos' && <PromoManagement />}
        </div>

        <MenuRecommendation />
        <InventoryAlert 
          lowStockItems={lowStockItems} 
          show={showStockNotification}
          onClose={() => setShowStockNotification(false)}
        />

        {isCheckoutOpen && (
          <Checkout 
            items={cartItems}
            customer={customer}
            onClose={() => setIsCheckoutOpen(false)}
            onComplete={handleSaleComplete}
          />
        )}

        {showReceipt && (
          <PaymentReceipt 
            sale={lastSale}
            onClose={() => setShowReceipt(false)}
          />
        )}


      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);