function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('formatCurrency error:', error);
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }
}