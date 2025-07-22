function CustomerLoyalty({ customer, onCustomerSelect }) {
  try {
    const [customers, setCustomers] = React.useState([]);
    const [showCustomerForm, setShowCustomerForm] = React.useState(false);
    const [newCustomer, setNewCustomer] = React.useState({
      name: '',
      email: '',
      phone: ''
    });

    React.useEffect(() => {
      loadCustomers();
    }, []);

    const loadCustomers = async () => {
      try {
        const response = await trickleListObjects('customer', 50, true);
        setCustomers(response.items);
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };

    const createCustomer = async (e) => {
      e.preventDefault();
      try {
        const customer = await trickleCreateObject('customer', {
          ...newCustomer,
          totalPurchases: 0,
          loyaltyPoints: 0,
          membershipLevel: 'Bronze'
        });
        
        setCustomers([customer, ...customers]);
        setNewCustomer({ name: '', email: '', phone: '' });
        setShowCustomerForm(false);
        alert('Pelanggan berhasil ditambahkan!');
      } catch (error) {
        console.error('Error creating customer:', error);
        alert('Gagal menambahkan pelanggan');
      }
    };

    const getMembershipColor = (level) => {
      switch (level) {
        case 'Gold': return 'text-yellow-600 bg-yellow-100';
        case 'Silver': return 'text-gray-600 bg-gray-100';
        default: return 'text-amber-600 bg-amber-100';
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4" data-name="customer-loyalty" data-file="components/CustomerLoyalty.js">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pelanggan Loyal</h2>
          <div className="flex space-x-2">
            <QRMembershipScanner onCustomerFound={onCustomerSelect} />
            <button
              onClick={() => setShowCustomerForm(!showCustomerForm)}
              className="text-amber-600 hover:text-amber-700"
            >
              <div className="icon-plus text-lg"></div>
            </button>
          </div>
        </div>

        {customer && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{customer.objectData.name}</h3>
                <p className="text-sm text-gray-600">{customer.objectData.loyaltyPoints || 0} poin</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipColor(customer.objectData.membershipLevel)}`}>
                {customer.objectData.membershipLevel}
              </span>
            </div>
          </div>
        )}

        {showCustomerForm && (
          <form onSubmit={createCustomer} className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Nama"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="tel"
              placeholder="Telepon"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Tambah Pelanggan
            </button>
          </form>
        )}

        <div className="max-h-48 overflow-y-auto space-y-2">
          {customers.map(cust => (
            <div
              key={cust.objectId}
              onClick={() => onCustomerSelect(cust)}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                customer && customer.objectId === cust.objectId
                  ? 'bg-amber-100 border border-amber-300'
                  : 'hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-gray-900">{cust.objectData.name}</p>
                  <p className="text-xs text-gray-600">{cust.objectData.loyaltyPoints || 0} poin</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipColor(cust.objectData.membershipLevel)}`}>
                  {cust.objectData.membershipLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('CustomerLoyalty component error:', error);
    return null;
  }
}