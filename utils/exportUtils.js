function exportToCSV(data, filename) {
  try {
    const csvContent = data.map(row => 
      Object.values(row).map(field => 
        typeof field === 'string' && field.includes(',') ? `"${field}"` : field
      ).join(',')
    ).join('\n');
    
    const header = Object.keys(data[0]).join(',');
    const csv = header + '\n' + csvContent;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Export to CSV error:', error);
    alert('Gagal mengekspor data ke CSV');
  }
}

function exportToPDF(elementId, filename) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Element tidak ditemukan untuk diekspor');
      return;
    }
    
    // Simple PDF export using print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${filename}</h2>
            <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
          </div>
          ${element.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  } catch (error) {
    console.error('Export to PDF error:', error);
    alert('Gagal mengekspor data ke PDF');
  }
}

function formatSalesDataForExport(sales) {
  try {
    return sales.map(sale => ({
      'Tanggal': new Date(sale.objectData.saleDate).toLocaleDateString('id-ID'),
      'Pelanggan': sale.objectData.customerName,
      'Total': sale.objectData.total,
      'Pembayaran': sale.objectData.paymentMethod,
      'Items': JSON.parse(sale.objectData.items).map(item => 
        `${item.name} (${item.quantity})`
      ).join('; ')
    }));
  } catch (error) {
    console.error('Format sales data error:', error);
    return [];
  }
}
