function PurchaseOrders() {
  try {
    const [orders, setOrders] = React.useState([]);
    const [suppliers, setSuppliers] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      supplierId: '', items: '', totalAmount: 0, expectedDelivery: ''
    });

    React.useEffect(() => {
      loadOrders();
      loadSuppliers();
    }, []);

    const loadOrders = async () => {
      try {
        const response = await trickleListObjects('purchase_order', 50, true);
        setOrders(response.items);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    const loadSuppliers = async () => {
      try {
        const response = await trickleListObjects('supplier', 50, true);
        setSuppliers(response.items);
      } catch (error) {
        console.error('Error loading suppliers:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const orderNumber = 'PO-' + Date.now();
        await trickleCreateObject('purchase_order', {
          ...formData,
          orderNumber,
          status: 'pending',
          orderDate: new Date().toISOString()
        });

        setFormData({ supplierId: '', items: '', totalAmount: 0, expectedDelivery: '' });
        setShowForm(false);
        loadOrders();
        alert('Purchase order berhasil dibuat!');
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Gagal membuat purchase order');
      }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
      try {
        const order = orders.find(o => o.objectId === orderId);
        await trickleUpdateObject('purchase_order', orderId, {
          ...order.objectData,
          status: newStatus
        });
        loadOrders();
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'approved': return 'text-blue-600 bg-blue-100';
        case 'delivered': return 'text-green-600 bg-green-100';
        case 'cancelled': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="space-y-6" data-name="purchase-orders" data-file="components/PurchaseOrders.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Purchase Orders</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <div className="icon-plus text-sm"></div>
              <span>Buat PO</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. PO</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map(order => {
                  const supplier = suppliers.find(s => s.objectId === order.objectData.supplierId);
                  return (
                    <tr key={order.objectId}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {order.objectData.orderNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {supplier ? supplier.objectData.name : 'Unknown'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatCurrency(order.objectData.totalAmount)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.objectData.status)}`}>
                          {order.objectData.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.objectData.status}
                          onChange={(e) => updateOrderStatus(order.objectId, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Buat Purchase Order</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.objectId} value={supplier.objectId}>
                      {supplier.objectData.name}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Items (pisahkan dengan enter)"
                  value={formData.items}
                  onChange={(e) => setFormData({...formData, items: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg h-20"
                  required
                />
                <input
                  type="number"
                  placeholder="Total Amount"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({...formData, expectedDelivery: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg">
                    Buat PO
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PurchaseOrders component error:', error);
    return null;
  }
}
