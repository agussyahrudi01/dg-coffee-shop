function FinancialModule() {
  try {
    const [expenses, setExpenses] = React.useState([]);
    const [sales, setSales] = React.useState([]);
    const [showExpenseForm, setShowExpenseForm] = React.useState(false);
    const [expenseForm, setExpenseForm] = React.useState({
      category: '', description: '', amount: 0, paymentMethod: 'cash'
    });
    const [selectedMonth, setSelectedMonth] = React.useState(new Date().toISOString().slice(0, 7));

    React.useEffect(() => {
      loadFinancialData();
    }, [selectedMonth]);

    const loadFinancialData = async () => {
      try {
        const [expenseResponse, salesResponse] = await Promise.all([
          trickleListObjects('expense', 100, true),
          trickleListObjects('sale', 100, true)
        ]);
        setExpenses(expenseResponse.items);
        setSales(salesResponse.items);
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    };

    const handleExpenseSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('expense', {
          ...expenseForm,
          expenseDate: new Date().toISOString()
        });
        setExpenseForm({ category: '', description: '', amount: 0, paymentMethod: 'cash' });
        setShowExpenseForm(false);
        loadFinancialData();
        alert('Pengeluaran berhasil ditambahkan!');
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Gagal menambahkan pengeluaran');
      }
    };

    const filterByMonth = (items, dateField) => {
      return items.filter(item => {
        const itemDate = new Date(item.objectData[dateField]);
        return itemDate.toISOString().slice(0, 7) === selectedMonth;
      });
    };

    const monthlyExpenses = filterByMonth(expenses, 'expenseDate');
    const monthlySales = filterByMonth(sales, 'saleDate');
    
    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.objectData.amount, 0);
    const totalRevenue = monthlySales.reduce((sum, sale) => sum + sale.objectData.total, 0);
    const netProfit = totalRevenue - totalExpenses;

    return (
      <div className="space-y-6" data-name="financial-module" data-file="components/FinancialModule.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Modul Keuangan</h2>
            <div className="flex space-x-3">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => setShowExpenseForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Tambah Pengeluaran
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <h3 className="text-green-100">Pendapatan</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
              <h3 className="text-red-100">Pengeluaran</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className={`bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-lg p-4 text-white`}>
              <h3 className="text-white opacity-90">{netProfit >= 0 ? 'Keuntungan' : 'Kerugian'}</h3>
              <p className="text-2xl font-bold">{formatCurrency(Math.abs(netProfit))}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Pengeluaran</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {monthlyExpenses.map(expense => (
              <div key={expense.objectId} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{expense.objectData.category}</h4>
                    <p className="text-sm text-gray-600">{expense.objectData.description}</p>
                  </div>
                  <p className="font-bold text-red-600">{formatCurrency(expense.objectData.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah Pengeluaran</h3>
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Bahan Baku">Bahan Baku</option>
                  <option value="Gaji">Gaji</option>
                  <option value="Listrik">Listrik</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <input
                  type="text"
                  placeholder="Deskripsi"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Jumlah"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExpenseForm(false)}
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
    console.error('FinancialModule component error:', error);
    return null;
  }
}