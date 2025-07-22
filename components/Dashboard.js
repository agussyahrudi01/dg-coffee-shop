function Dashboard() {
  try {
    const [sales, setSales] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
      try {
        const [salesResponse, productsResponse] = await Promise.all([
          trickleListObjects('sale', 100, true),
          trickleListObjects('product', 50, true)
        ]);
        setSales(salesResponse.items);
        setProducts(productsResponse.items);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    React.useEffect(() => {
      if (!loading && sales.length > 0) {
        createSalesChart();
        createTopProductsChart();
      }
    }, [loading, sales]);

    const createSalesChart = () => {
      const ctx = document.getElementById('salesChart');
      if (!ctx) return;

      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const dailySales = last7Days.map(date => {
        const dayTotal = sales
          .filter(sale => sale.objectData.saleDate.split('T')[0] === date)
          .reduce((sum, sale) => sum + sale.objectData.total, 0);
        return dayTotal;
      });

      new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('id-ID', {weekday: 'short'})),
          datasets: [{
            label: 'Penjualan Harian',
            data: dailySales,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    };

    const createTopProductsChart = () => {
      const ctx = document.getElementById('topProductsChart');
      if (!ctx) return;

      const productSales = {};
      sales.forEach(sale => {
        const items = JSON.parse(sale.objectData.items);
        items.forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: topProducts.map(([name]) => name),
          datasets: [{
            data: topProducts.map(([,qty]) => qty),
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    };

    const todaySales = sales.filter(sale => {
      const today = new Date().toISOString().split('T')[0];
      return sale.objectData.saleDate.split('T')[0] === today;
    });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.objectData.total, 0);
    const monthRevenue = sales.filter(sale => {
      const saleMonth = new Date(sale.objectData.saleDate).getMonth();
      return saleMonth === new Date().getMonth();
    }).reduce((sum, sale) => sum + sale.objectData.total, 0);

    return (
      <div className="space-y-6" data-name="dashboard" data-file="components/Dashboard.js">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Hari Ini</p>
                <p className="text-2xl font-bold">{formatCurrency(todayRevenue)}</p>
              </div>
              <div className="icon-calendar text-3xl text-blue-200"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Bulan Ini</p>
                <p className="text-2xl font-bold">{formatCurrency(monthRevenue)}</p>
              </div>
              <div className="icon-trending-up text-3xl text-green-200"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Transaksi Hari Ini</p>
                <p className="text-2xl font-bold">{todaySales.length}</p>
              </div>
              <div className="icon-shopping-bag text-3xl text-purple-200"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Total Produk</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="icon-package text-3xl text-orange-200"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Penjualan 7 Hari</h3>
            <canvas id="salesChart" width="400" height="200"></canvas>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produk Terlaris</h3>
            <canvas id="topProductsChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}