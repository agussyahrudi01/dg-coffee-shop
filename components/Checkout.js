function Checkout({ items, customer, onClose, onComplete }) {
  try {
    const [customerName, setCustomerName] = React.useState(customer ? customer.objectData.name : '');
    const [paymentMethod, setPaymentMethod] = React.useState('cash');
    const [processing, setProcessing] = React.useState(false);
    
    const subtotal = items.reduce((sum, item) => sum + (item.objectData.price * item.quantity), 0);
    const { discount } = calculateDiscount(customer, subtotal);
    const total = subtotal - discount;
    const tax = total * 0.1; // 10% pajak
    const grandTotal = total + tax;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setProcessing(true);
      
      // Simulasi proses pembayaran
      setTimeout(() => {
        alert('Pembayaran berhasil! Terima kasih.');
        setProcessing(false);
        onComplete({
          customerName,
          total: grandTotal,
          paymentMethod
        });
      }, 2000);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-name="checkout" data-file="components/Checkout.js">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <div className="icon-x text-xl"></div>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Masukkan nama pelanggan"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="cash">Tunai</option>
                <option value="card">Kartu Debit/Kredit</option>
                <option value="digital">E-Wallet</option>
              </select>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Pesanan</h3>
              
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.objectId} className="flex justify-between text-sm">
                    <span>{item.objectData.name} x{item.quantity}</span>
                    <span>{formatCurrency(item.objectData.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-1 text-sm border-t pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                {customer && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Loyalty:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Pajak (10%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-amber-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {processing ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Checkout component error:', error);
    return null;
  }
}