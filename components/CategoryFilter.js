function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  try {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4" data-name="category-filter" data-file="components/CategoryFilter.js">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Kategori</h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('CategoryFilter component error:', error);
    return null;
  }
}