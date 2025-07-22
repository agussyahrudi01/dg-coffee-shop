function MenuRecommendation() {
  try {
    const [recommendations, setRecommendations] = React.useState([]);
    const [customerPreference, setCustomerPreference] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const generateRecommendations = async () => {
      if (!customerPreference.trim()) return;
      
      setLoading(true);
      try {
        const systemPrompt = `Kamu adalah barista ahli di DG Coffee Shop. Berdasarkan preferensi pelanggan, rekomendasikan 3 menu kopi atau minuman yang sesuai. Format respons dalam JSON dengan field: name, description, price (dalam IDR), category.`;
        const userPrompt = `Preferensi pelanggan: ${customerPreference}`;
        
        let response = await invokeAIAgent(systemPrompt, userPrompt);
        response = response.replace(/```json|```/g, '');
        const recs = JSON.parse(response);
        setRecommendations(Array.isArray(recs) ? recs : [recs]);
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setRecommendations([
          {
            name: 'Americano',
            description: 'Kopi hitam klasik dengan rasa bold',
            price: 25000,
            category: 'Coffee'
          },
          {
            name: 'Cappuccino',
            description: 'Espresso dengan steamed milk dan foam',
            price: 35000,
            category: 'Coffee'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed bottom-4 right-4 z-40" data-name="menu-recommendation" data-file="components/MenuRecommendation.js">
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm">
          <div className="flex items-center space-x-2 mb-3">
            <div className="icon-sparkles text-xl text-amber-600"></div>
            <h3 className="font-semibold text-gray-900">Rekomendasi Menu AI</h3>
          </div>
          
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              placeholder="Ceritakan selera Anda..."
              value={customerPreference}
              onChange={(e) => setCustomerPreference(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              {loading ? '...' : '✨'}
            </button>
          </div>

          {recommendations.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border rounded-lg p-2">
                  <h4 className="font-medium text-sm text-gray-900">{rec.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{rec.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-amber-600 font-medium">{rec.category}</span>
                    <span className="text-xs font-bold text-gray-900">{formatCurrency(rec.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('MenuRecommendation component error:', error);
    return null;
  }
}