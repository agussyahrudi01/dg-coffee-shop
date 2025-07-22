function SalesReport() {
  try {
    const [sales, setSales] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [reportType, setReportType] = React.useState('daily');
    const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);

    React.useEffect(() => {
      loadSalesData();
    }, [reportType, selectedDate]);

    const loadSalesData = async () => {
      try {
        setLoading(true);
        const response = await trickleListObjects('sale', 100, true);
        setSales(response.items);
        setLoading(false);
      } catch (error) {
        console.error('Error loading sales data:', error);
        setLoading(false);
      }
    };

    const filterSalesByDate = (salesData) => {
      const today = new Date(selectedDate);
      
      return salesData.filter(sale => {
        const saleDate = new Date(sale.objectData.saleDate);
        
        if (reportType === 'daily') {
          return saleDate.toDateString() === today.toDateString();
        } else if (reportType === 'monthly') {
          return saleDate.getMonth() === today.getMonth() && 
                 saleDate.getFullYear() === today.getFullYear();
        }
        return true;
      });
    };

    const filteredSales = filterSalesByDate(sales);
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.objectData.total, 0);
    const totalTransactions = filteredSales.length;

    return (
      <div className="space-y-6" data-name="sales-report" data-file="components/SalesReport.js">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Laporan Penjualan</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const data = formatSalesDataForExport(filteredSales);
                  if (data.length > 0) {
                    exportToCSV(data, `laporan-penjualan-${selectedDate}.csv`);
                  } else {
                    alert('Tidak ada data untuk diekspor');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <div className="icon-download text-sm"></div>
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => exportToPDF('sales-report-table', `laporan-penjualan-${selectedDate}.pdf`)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <div className="icon-file-text text-sm"></div>
                <span>Export PDF</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Laporan
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="daily">Harian</option>
                <option value="monthly">Bulanan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Pendapatan</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="icon-dollar-sign text-3xl text-green-200"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Transaksi</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
                <div className="icon-shopping-bag text-3xl text-blue-200"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Rata-rata per Transaksi</p>
                  <p className="text-2xl font-bold">
                    {totalTransactions > 0 ? formatCurrency(totalRevenue / totalTransactions) : formatCurrency(0)}
                  </p>
                </div>
                <div className="icon-trending-up text-3xl text-purple-200"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Transaksi</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="icon-file-text text-4xl mb-2"></div>
              <p>Tidak ada transaksi untuk periode ini</p>
            </div>
          ) : (
            <div id="sales-report-table" className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSales.map(sale => (
                <div key={sale.objectId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{sale.objectData.customerName}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(sale.objectData.saleDate).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">{formatCurrency(sale.objectData.total)}</p>
                      <p className="text-sm text-gray-600 capitalize">{sale.objectData.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {JSON.parse(sale.objectData.items).map((item, idx) => (
                      <span key={idx}>
                        {item.name} x{item.quantity}
                        {idx < JSON.parse(sale.objectData.items).length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('SalesReport component error:', error);
    return null;
  }
}