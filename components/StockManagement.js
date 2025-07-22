function StockManagement({ products, onProductUpdate }) {
  try {
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [stockForm, setStockForm] = React.useState({ stock: 0, minStock: 5 });

    const handleStockUpdate = async (product) => {
      setEditingProduct(product);
      setStockForm({
        stock: product.objectData.stock || 0,
        minStock: product.objectData.minStock || 5
      });
    };

    const saveStockUpdate = async () => {
      try {
        await trickleUpdateObject('product', editingProduct.objectId, {
          ...editingProduct.objectData,
          stock: parseInt(stockForm.stock),
          minStock: parseInt(stockForm.minStock)
        });
        
        setEditingProduct(null);
        onProductUpdate();
        alert('Stok berhasil diperbarui!');
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('Gagal memperbarui stok');
      }
    };

    const getStockStatus = (product) => {
      const stock = product.objectData.stock || 0;
      const minStock = product.objectData.minStock || 5;
      
      if (stock === 0) return { status: 'Habis', color: 'text-red-600 bg-red-100' };
      if (stock <= minStock) return { status: 'Rendah', color: 'text-yellow-600 bg-yellow-100' };
      return { status: 'Normal', color: 'text-green-600 bg-green-100' };
    };

    return (
      <div className="space-y-6" data-name="stock-management" data-file="components/StockManagement.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manajemen Stok</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stok</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.objectId}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <img 
                            src={product.objectData.image} 
                            alt={product.objectData.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.objectData.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(product.objectData.price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{product.objectData.category}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{product.objectData.stock || 0}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{product.objectData.minStock || 5}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleStockUpdate(product)}
                          className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Update Stok - {editingProduct.objectData.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    value={stockForm.stock}
                    onChange={(e) => setStockForm({...stockForm, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stok
                  </label>
                  <input
                    type="number"
                    value={stockForm.minStock}
                    onChange={(e) => setStockForm({...stockForm, minStock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={saveStockUpdate}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('StockManagement component error:', error);
    return null;
  }
}
