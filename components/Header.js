function Header({ cartCount, activeTab, onTabChange, lowStockCount }) {
  try {
    return (
      <header className="bg-white shadow-sm border-b" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <div className="icon-coffee text-xl text-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DG Coffee Shop</h1>
                <p className="text-sm text-gray-600">Premium Coffee Experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => onTabChange('pos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'pos' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-shopping-cart text-lg"></div>
                    <span>POS</span>
                  </div>
                </button>

                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-chart-line text-lg"></div>
                    <span>Dashboard</span>
                  </div>
                </button>
                
                <button
                  onClick={() => onTabChange('reports')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'reports' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-chart-bar text-lg"></div>
                    <span>Laporan</span>
                  </div>
                </button>
                
                <button
                  onClick={() => onTabChange('stock')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                    activeTab === 'stock' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-package text-lg"></div>
                    <span>Stok</span>
                  </div>
                  {lowStockCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {lowStockCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onTabChange('suppliers')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'suppliers' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-truck text-lg"></div>
                    <span>Supplier</span>
                  </div>
                </button>

                <button
                  onClick={() => onTabChange('purchase')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'purchase' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-clipboard-list text-lg"></div>
                    <span>Purchase</span>
                  </div>
                </button>

                <button
                  onClick={() => onTabChange('finance')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'finance' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-dollar-sign text-lg"></div>
                    <span>Keuangan</span>
                  </div>
                </button>

                <button
                  onClick={() => onTabChange('reservations')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'reservations' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-calendar text-lg"></div>
                    <span>Reservasi</span>
                  </div>
                </button>

                <button
                  onClick={() => onTabChange('employees')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'employees' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-users text-lg"></div>
                    <span>Karyawan</span>
                  </div>
                </button>

                <button
                  onClick={() => onTabChange('promos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'promos' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="icon-tag text-lg"></div>
                    <span>Promo</span>
                  </div>
                </button>
              </nav>

              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="icon-shopping-cart text-xl"></div>
                  <span className="font-medium">{cartCount} items</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="icon-clock text-lg"></div>
                  <span className="text-sm">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
