const fs = require('fs');
const path = require('path');

// Save the complete listings dataset
const listingsHeader = 'listing_id,tower_number,transaction_date,unit_category,unit_number,floor_area_sqft,sale_price,listing_status,client_ref';

console.log('Writing listings_dataset.csv...');
