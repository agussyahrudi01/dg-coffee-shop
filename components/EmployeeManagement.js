function EmployeeManagement() {
  try {
    const [employees, setEmployees] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
      name: '', position: '', phone: '', email: '', salary: 0, startDate: ''
    });

    React.useEffect(() => {
      loadEmployees();
    }, []);

    const loadEmployees = async () => {
      try {
        const response = await trickleListObjects('employee', 50, true);
        setEmployees(response.items);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('employee', {
          ...formData,
          status: 'active',
          createdAt: new Date().toISOString()
        });
        setFormData({ name: '', position: '', phone: '', email: '', salary: 0, startDate: '' });
        setShowForm(false);
        loadEmployees();
        alert('Karyawan berhasil ditambahkan!');
      } catch (error) {
        console.error('Error creating employee:', error);
        alert('Gagal menambahkan karyawan');
      }
    };

    const getPositionColor = (position) => {
      switch (position.toLowerCase()) {
        case 'manager': return 'text-purple-600 bg-purple-100';
        case 'barista': return 'text-amber-600 bg-amber-100';
        case 'cashier': return 'text-green-600 bg-green-100';
        case 'server': return 'text-blue-600 bg-blue-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="space-y-6" data-name="employee-management" data-file="components/EmployeeManagement.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Manajemen Karyawan</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <div className="icon-plus text-sm"></div>
              <span>Tambah Karyawan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(employee => (
              <div key={employee.objectId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{employee.objectData.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(employee.objectData.position)}`}>
                    {employee.objectData.position}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">📞 {employee.objectData.phone}</p>
                <p className="text-sm text-gray-600 mb-1">✉️ {employee.objectData.email}</p>
                <p className="text-sm text-gray-600 mb-1">💰 {formatCurrency(employee.objectData.salary)}/bulan</p>
                <p className="text-sm text-gray-600">📅 Mulai: {employee.objectData.startDate}</p>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah Karyawan Baru</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Pilih Posisi</option>
                  <option value="Manager">Manager</option>
                  <option value="Barista">Barista</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Server">Server</option>
                </select>
                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Gaji per Bulan"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-lg">
                    Tambah Karyawan
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
    console.error('EmployeeManagement component error:', error);
    return null;
  }
}