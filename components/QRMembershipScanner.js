function QRMembershipScanner({ onCustomerFound }) {
  try {
    const [showScanner, setShowScanner] = React.useState(false);
    const [manualCode, setManualCode] = React.useState('');

    const handleScan = async (qrCode) => {
      try {
        const customerId = extractCustomerIdFromQR(qrCode);
        if (customerId) {
          const customer = await trickleGetObject('customer', customerId);
          onCustomerFound(customer);
          setShowScanner(false);
          alert(`Pelanggan ditemukan: ${customer.objectData.name}`);
        } else {
          alert('QR Code tidak valid');
        }
      } catch (error) {
        console.error('Error scanning QR:', error);
        alert('Pelanggan tidak ditemukan');
      }
    };

    const handleManualInput = async (e) => {
      e.preventDefault();
      if (manualCode.trim()) {
        await handleScan(manualCode.trim());
        setManualCode('');
      }
    };

    return (
      <div data-name="qr-membership-scanner" data-file="components/QRMembershipScanner.js">
        <button
          onClick={() => setShowScanner(true)}
          className="text-amber-600 hover:text-amber-700"
          title="Scan QR Membership"
        >
          <div className="icon-qr-code text-lg"></div>
        </button>

        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Scan QR Membership</h3>
                <button
                  onClick={() => setShowScanner(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <div className="icon-x text-xl"></div>
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="icon-qr-code text-4xl text-gray-400"></div>
                </div>
                <p className="text-sm text-gray-600">
                  Arahkan kamera ke QR code membership pelanggan
                </p>
              </div>

              <form onSubmit={handleManualInput} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atau masukkan kode manual:
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Masukkan kode membership"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 text-white py-2 rounded-lg"
                >
                  Cari Pelanggan
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('QRMembershipScanner component error:', error);
    return null;
  }
}