function PaymentReceipt({ sale, onClose }) {
  try {
    const printReceipt = () => {
      window.print();
    };

    const downloadReceipt = () => {
      const receiptContent = document.getElementById('receipt-content').innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html><head><title>Receipt</title></head>
        <body style="font-family: monospace; margin: 20px;">
          ${receiptContent}
        </body></html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    const subtotal = sale.items.reduce((sum, item) => sum + (item.objectData.price * item.quantity), 0);
    const { discount } = calculateDiscount(sale.customer, subtotal);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.1;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-name="payment-receipt" data-file="components/PaymentReceipt.js">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Struk Pembayaran</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <div className="icon-x text-xl"></div>
            </button>
          </div>

          <div id="receipt-content" className="font-mono text-sm">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">COFFEE SHOP</h3>
              <p>Jl. Contoh No. 123</p>
              <p>Telp: (021) 1234-5678</p>
              <p className="mt-2">{new Date().toLocaleString('id-ID')}</p>
              <p>ID: {sale.saleId.slice(-8)}</p>
            </div>

            <div className="border-t border-b border-gray-300 py-2 mb-2">
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>Admin</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{sale.customerName}</span>
              </div>
            </div>

            <div className="mb-4">
              {sale.items.map((item, idx) => (
                <div key={idx} className="mb-1">
                  <div className="flex justify-between">
                    <span>{item.objectData.name}</span>
                    <span>{formatCurrency(item.objectData.price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>  {item.quantity} x {formatCurrency(item.objectData.price)}</span>
                    <span>{formatCurrency(item.objectData.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Diskon:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pajak (10%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span>TOTAL:</span>
                <span>{formatCurrency(sale.total)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Pembayaran:</span>
                <span className="capitalize">{sale.paymentMethod}</span>
              </div>
            </div>

            <div className="text-center mt-4 text-xs">
              <p>TERIMA KASIH</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar</p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={printReceipt}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <div className="icon-printer text-lg"></div>
              <span>Print</span>
            </button>
            <button
              onClick={downloadReceipt}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <div className="icon-download text-lg"></div>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PaymentReceipt component error:', error);
    return null;
  }
}