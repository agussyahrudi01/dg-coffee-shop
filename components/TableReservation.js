function TableReservation() {
  try {
    const [reservations, setReservations] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      customerName: '', phone: '', date: '', time: '', tableSize: 2, specialRequest: ''
    });

    React.useEffect(() => {
      loadReservations();
    }, []);

    const loadReservations = async () => {
      try {
        const response = await trickleListObjects('reservation', 50, true);
        setReservations(response.items);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('reservation', {
          ...formData,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        });
        setFormData({ customerName: '', phone: '', date: '', time: '', tableSize: 2, specialRequest: '' });
        setShowForm(false);
        loadReservations();
        alert('Reservasi berhasil dibuat!');
      } catch (error) {
        console.error('Error creating reservation:', error);
        alert('Gagal membuat reservasi');
      }
    };

    const updateStatus = async (reservationId, newStatus) => {
      try {
        const reservation = reservations.find(r => r.objectId === reservationId);
        await trickleUpdateObject('reservation', reservationId, {
          ...reservation.objectData,
          status: newStatus
        });
        loadReservations();
      } catch (error) {
        console.error('Error updating reservation:', error);
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'confirmed': return 'text-blue-600 bg-blue-100';
        case 'seated': return 'text-green-600 bg-green-100';
        case 'completed': return 'text-gray-600 bg-gray-100';
        case 'cancelled': return 'text-red-600 bg-red-100';
        default: return 'text-yellow-600 bg-yellow-100';
      }
    };

    return (
      <div className="space-y-6" data-name="table-reservation" data-file="components/TableReservation.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manajemen Reservasi Meja</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <div className="icon-plus text-sm"></div>
              <span>Tambah Reservasi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map(reservation => (
              <div key={reservation.objectId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{reservation.objectData.customerName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.objectData.status)}`}>
                    {reservation.objectData.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">📞 {reservation.objectData.phone}</p>
                <p className="text-sm text-gray-600 mb-1">📅 {reservation.objectData.date}</p>
                <p className="text-sm text-gray-600 mb-1">🕒 {reservation.objectData.time}</p>
                <p className="text-sm text-gray-600 mb-3">👥 {reservation.objectData.tableSize} orang</p>
                
                <select
                  value={reservation.objectData.status}
                  onChange={(e) => updateStatus(reservation.objectId, e.target.value)}
                  className="w-full text-xs border rounded px-2 py-1"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Buat Reservasi Baru</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Pelanggan"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <select
                  value={formData.tableSize}
                  onChange={(e) => setFormData({...formData, tableSize: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {[1,2,3,4,5,6,7,8].map(size => (
                    <option key={size} value={size}>{size} orang</option>
                  ))}
                </select>
                <textarea
                  placeholder="Permintaan Khusus (opsional)"
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({...formData, specialRequest: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg h-20"
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg">
                    Buat Reservasi
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
    console.error('TableReservation component error:', error);
    return null;
  }
}