function generateQRCodeForCustomer(customer) {
  try {
    // Generate QR code data for customer
    const qrData = {
      type: 'membership',
      customerId: customer.objectId,
      name: customer.objectData.name,
      membershipLevel: customer.objectData.membershipLevel
    };
    return JSON.stringify(qrData);
  } catch (error) {
    console.error('generateQRCodeForCustomer error:', error);
    return null;
  }
}

function extractCustomerIdFromQR(qrCodeData) {
  try {
    // Try to parse as JSON first (new format)
    try {
      const parsed = JSON.parse(qrCodeData);
      if (parsed.type === 'membership' && parsed.customerId) {
        return parsed.customerId;
      }
    } catch (e) {
      // If JSON parsing fails, treat as direct customer ID (legacy format)
      return qrCodeData;
    }
    
    return null;
  } catch (error) {
    console.error('extractCustomerIdFromQR error:', error);
    return null;
  }
}

function validateQRCode(qrCodeData) {
  try {
    const customerId = extractCustomerIdFromQR(qrCodeData);
    return customerId !== null;
  } catch (error) {
    console.error('validateQRCode error:', error);
    return false;
  }
}