function calculateDiscount(customer, total) {
  try {
    if (!customer) return { discount: 0, discountPercentage: 0 };
    
    const membershipLevel = customer.objectData.membershipLevel;
    let discountPercentage = 0;
    
    switch (membershipLevel) {
      case 'Gold':
        discountPercentage = 15; // 15% discount
        break;
      case 'Silver':
        discountPercentage = 10; // 10% discount
        break;
      case 'Bronze':
        discountPercentage = 5; // 5% discount
        break;
      default:
        discountPercentage = 0;
    }
    
    const discount = total * (discountPercentage / 100);
    return { discount, discountPercentage };
  } catch (error) {
    console.error('calculateDiscount error:', error);
    return { discount: 0, discountPercentage: 0 };
  }
}

function calculateLoyaltyPoints(total) {
  try {
    // 1 point for every 1000 IDR spent
    return Math.floor(total / 1000);
  } catch (error) {
    console.error('calculateLoyaltyPoints error:', error);
    return 0;
  }
}

function getMembershipBenefits(level) {
  try {
    const benefits = {
      'Bronze': {
        discount: '5%',
        pointsMultiplier: '1x',
        specialOffers: 'Basic'
      },
      'Silver': {
        discount: '10%',
        pointsMultiplier: '1.5x',
        specialOffers: 'Premium'
      },
      'Gold': {
        discount: '15%',
        pointsMultiplier: '2x',
        specialOffers: 'VIP'
      }
    };
    
    return benefits[level] || benefits['Bronze'];
  } catch (error) {
    console.error('getMembershipBenefits error:', error);
    return benefits['Bronze'];
  }
}