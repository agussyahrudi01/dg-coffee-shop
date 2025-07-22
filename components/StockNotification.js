function StockNotification({ lowStockItems, show, onClose }) {
  try {
    React.useEffect(() => {
      if (lowStockItems.length > 0) {
        // Auto show notification when there are low stock items
        setTimeout(() => {
          if (lowStockItems.length > 0) {
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Peringatan Stok Menipis!', {
                body: `${lowStockItems.length} produk memiliki stok menipis`,
                icon: '/favicon.ico'
              });
            }
          }
        }, 1000);
      }
    }, [lowStockItems]);

    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          alert('Notifikasi browser diaktifkan!');
        }
      }
    };

    if (!show && lowStockItems.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50" data-name="stock-notification" data-file="components/StockNotification.js">
        {lowStockItems.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="icon-alert-triangle text-lg"></div>
                  <h4 className="font-semibold">Stok Menipis!</h4>
                </div>
                <p className="text-sm mb-3">
                  {lowStockItems.length} produk memiliki stok menipis atau habis
                </p>
                <div className="space-y-1">
                  {lowStockItems.slice(0, 3).map(item => (
                    <p key={item.objectId} className="text-xs">
                      • {item.objectData.name}: {item.objectData.stock || 0} tersisa
                    </p>
                  ))}
                  {lowStockItems.length > 3 && (
                    <p className="text-xs">dan {lowStockItems.length - 3} lainnya...</p>
                  )}
                </div>
                <button
                  onClick={requestNotificationPermission}
                  className="mt-2 text-xs underline hover:no-underline"
                >
                  Aktifkan notifikasi browser
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 ml-2"
              >
                <div className="icon-x text-lg"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('StockNotification component error:', error);
    return null;
  }
}