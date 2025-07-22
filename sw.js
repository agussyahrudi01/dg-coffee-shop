const CACHE_NAME = 'coffee-pos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/components/Header.js',
  '/components/ProductCard.js',
  '/components/Cart.js',
  '/components/CategoryFilter.js',
  '/components/Checkout.js',
  '/components/SalesReport.js',
  '/components/StockManagement.js',
  '/components/CustomerLoyalty.js',
  '/components/Dashboard.js',
  '/components/PaymentReceipt.js',
  '/components/StockNotification.js',
  '/components/SupplierManagement.js',
  '/components/PurchaseOrders.js',
  '/components/FinancialModule.js',
  '/components/QRMembershipScanner.js',
  '/components/TableReservation.js',
  '/components/MenuRecommendation.js',
  '/components/EmployeeManagement.js',
  '/components/PromoManagement.js',
  '/components/InventoryAlert.js',

  '/utils/formatCurrency.js',
  '/utils/loyaltySystem.js',
  '/utils/exportUtils.js',
  '/utils/qrCodeUtils.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});