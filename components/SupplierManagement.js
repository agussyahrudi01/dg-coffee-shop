function SupplierManagement() {
  try {
    const [suppliers, setSuppliers] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [editingSupplier, setEditingSupplier] = React.useState(null);
    const [formData, setFormData] = React.useState({
      name: '', contact: '', email: '', address: '', products: ''
    });

    React.useEffect(() => {
      loadSuppliers();
    }, []);

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
        const supplierData = {
          ...formData,
          products: formData.products.split(',').map(p => p.trim())
        };

        if (editingSupplier) {
          await trickleUpdateObject('supplier', editingSupplier.objectId, supplierData);
        } else {
          await trickleCreateObject('supplier', supplierData);
        }

        setFormData({ name: '', contact: '', email: '', address: '', products: '' });
        setShowForm(false);
        setEditingSupplier(null);
        loadSuppliers();
        alert(editingSupplier ? 'Supplier berhasil diperbarui!' : 'Supplier berhasil ditambahkan!');
      } catch (error) {
        console.error('Error saving supplier:', error);
        alert('Gagal menyimpan supplier');
      }
    };

    const handleEdit = (supplier) => {
      setEditingSupplier(supplier);
      setFormData({
        ...supplier.objectData,
        products: Array.isArray(supplier.objectData.products) 
          ? supplier.objectData.products.join(', ') 
          : supplier.objectData.products || ''
      });
      setShowForm(true);
    };

    return (
      <div className="space-y-6" data-name="supplier-management" data-file="components/SupplierManagement.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manajemen Supplier</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <div className="icon-plus text-sm"></div>
              <span>Tambah Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map(supplier => (
              <div key={supplier.objectId} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{supplier.objectData.name}</h3>
                <p className="text-sm text-gray-600 mb-1">📞 {supplier.objectData.contact}</p>
                <p className="text-sm text-gray-600 mb-1">✉️ {supplier.objectData.email}</p>
                <p className="text-sm text-gray-600 mb-3">📍 {supplier.objectData.address}</p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Produk:</p>
                  <div className="flex flex-wrap gap-1">
                    {(supplier.objectData.products || []).slice(0, 3).map((product, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(supplier)}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingSupplier ? 'Edit Supplier' : 'Tambah Supplier'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Supplier"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Kontak"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Alamat"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg h-20"
                />
                <input
                  type="text"
                  placeholder="Produk (pisahkan dengan koma)"
                  value={formData.products}
                  onChange={(e) => setFormData({...formData, products: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg">
                    {editingSupplier ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSupplier(null);
                      setFormData({ name: '', contact: '', email: '', address: '', products: '' });
                    }}
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
    console.error('SupplierManagement component error:', error);
    return null;
  }
}