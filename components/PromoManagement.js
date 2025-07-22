function PromoManagement() {
  try {
    const [promos, setPromos] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      title: '', description: '', discountType: 'percentage', discountValue: 0, 
      startDate: '', endDate: '', minPurchase: 0, isActive: true
    });

    React.useEffect(() => {
      loadPromos();
    }, []);

    const loadPromos = async () => {
      try {
        const response = await trickleListObjects('promo', 50, true);
        setPromos(response.items);
      } catch (error) {
        console.error('Error loading promos:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('promo', {
          ...formData,
          createdAt: new Date().toISOString()
        });
        setFormData({ 
          title: '', description: '', discountType: 'percentage', discountValue: 0,
          startDate: '', endDate: '', minPurchase: 0, isActive: true 
        });
        setShowForm(false);
        loadPromos();
        alert('Promo berhasil dibuat!');
      } catch (error) {
        console.error('Error creating promo:', error);
        alert('Gagal membuat promo');
      }
    };

    const togglePromoStatus = async (promoId) => {
      try {
        const promo = promos.find(p => p.objectId === promoId);
        await trickleUpdateObject('promo', promoId, {
          ...promo.objectData,
          isActive: !promo.objectData.isActive
        });
        loadPromos();
      } catch (error) {
        console.error('Error toggling promo status:', error);
      }
    };

    const isPromoValid = (promo) => {
      const now = new Date();
      const start = new Date(promo.objectData.startDate);
      const end = new Date(promo.objectData.endDate);
      return now >= start && now <= end && promo.objectData.isActive;
    };

    return (
      <div className="space-y-6" data-name="promo-management" data-file="components/PromoManagement.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manajemen Promo & Diskon</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <div className="icon-plus text-sm"></div>
              <span>Buat Promo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.map(promo => (
              <div key={promo.objectId} className={`border rounded-lg p-4 ${isPromoValid(promo) ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{promo.objectData.title}</h3>
                  <div className="flex items-center space-x-2">
                    {isPromoValid(promo) && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Aktif
                      </span>
                    )}
                    <button
                      onClick={() => togglePromoStatus(promo.objectId)}
                      className="text-xs text-amber-600 hover:text-amber-700"
                    >
                      {promo.objectData.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{promo.objectData.description}</p>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">
                    Diskon: {promo.objectData.discountType === 'percentage' ? `${promo.objectData.discountValue}%` : formatCurrency(promo.objectData.discountValue)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Berlaku: {promo.objectData.startDate} - {promo.objectData.endDate}</p>
                  <p>Min. pembelian: {formatCurrency(promo.objectData.minPurchase)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Buat Promo Baru</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Judul Promo"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Deskripsi"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg h-20"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal (Rp)</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Nilai diskon"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <input
                  type="number"
                  placeholder="Minimum pembelian"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({...formData, minPurchase: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg">
                    Buat Promo
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
    console.error('PromoManagement component error:', error);
    return null;
  }
}
