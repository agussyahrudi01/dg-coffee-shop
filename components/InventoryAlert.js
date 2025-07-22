function InventoryAlert({ lowStockItems, show, onClose }) {
  try {
    React.useEffect(() => {
      if (lowStockItems.length > 0 && show) {
        // Auto hide after 15 seconds
        const timer = setTimeout(() => {
          if (onClose) onClose();
        }, 15000);
        return () => clearTimeout(timer);
      }
    }, [lowStockItems, show, onClose]);

    if (!show || lowStockItems.length === 0) return null;

    return (
      <div className="fixed top-20 right-4 z-50 max-w-sm" data-name="inventory-alert" data-file="components/InventoryAlert.js">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="icon-alert-triangle text-red-600 text-lg"></div>
              <h4 className="font-semibold text-red-800">Peringatan Stok!</h4>
            </div>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-600"
            >
              <div className="icon-x text-lg"></div>
            </button>
          </div>
          
          <p className="text-sm text-red-700 mt-2 mb-3">
            {lowStockItems.length} produk memiliki stok menipis atau habis
          </p>
          
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {lowStockItems.slice(0, 5).map(item => (
              <div key={item.objectId} className="flex justify-between items-center text-xs">
                <span className="text-red-800 font-medium">{item.objectData.name}</span>
                <span className="text-red-600">
                  {item.objectData.stock || 0} tersisa
                </span>
              </div>
            ))}
            {lowStockItems.length > 5 && (
              <p className="text-xs text-red-600 italic">
                +{lowStockItems.length - 5} produk lainnya
              </p>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-xs text-red-600">
              💡 Segera lakukan restocking untuk menghindari kehabisan stok
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('InventoryAlert component error:', error);
    return null;
  }
}