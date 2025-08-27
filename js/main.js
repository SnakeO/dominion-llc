// Format currency
function formatCurrency(amount) {
    if (!amount) return 'Contact for price';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Get property image path
function getImagePath(propertyId, imageName) {
    const folderMap = {
        '2424-highland-ave': '2424 Highland Ave. Shreveport, LA 71104',
        '4302-illinois-ave': '4302 Illinois Ave. Shreveport, LA 71109',
        '2536-desoto-st': '2536 Desoto St. Shreveport, LA 71103',
        '250-e-68th-st': '250 E 68th St. Shreveport, LA 71106',
        '3726-portland-ave': '3726 Portland Ave. Shreveport, LA 71103',
        '3730-portland-ave': '3730 Portland Ave. Shreveport, LA 71103',
        '525-sassafras-ave': '525 Sassafras Ave. Shreveport, LA 71106',
        '529-sassafras-ave': '529 Sassafras Ave. Shreveport, LA 71106'
    };
    return `assets/images/${encodeURIComponent(folderMap[propertyId])}/${imageName}`;
}

// Get thumbnail path
function getThumbnailPath(propertyId, imageName) {
    const folderMap = {
        '2424-highland-ave': '2424-highland-ave',
        '4302-illinois-ave': '4302-illinois-ave',
        '2536-desoto-st': '2536-desoto-st-shreveport-la-71103',
        '250-e-68th-st': '250-e-68th-st-shreveport-la-71106',
        '3726-portland-ave': '3726-portland-ave-shreveport-la-71103',
        '3730-portland-ave': '3730-portland-ave-shreveport-la-71103',
        '525-sassafras-ave': '525-sassafras-ave-shreveport-la-71106',
        '529-sassafras-ave': '529-sassafras-ave-shreveport-la-71106'
    };
    // Thumbnails are always .jpg, even if source is .png
    const thumbnailName = imageName.replace(/\.(jpg|png)$/i, '.jpg');
    return `assets/thumbnails/${folderMap[propertyId]}/thumb-${thumbnailName}`;
}

// Create property card
function createPropertyCard(property) {
    const badgeText = property.status === 'Rented' && property.monthlyRent ? 
        `Rented | ${formatCurrency(property.monthlyRent)}/mo` : property.status;
    const statusBadge = property.status ? 
        `<span class="badge ${property.status === 'Rented' ? 'bg-success' : 'bg-warning text-dark'}">${badgeText}</span>` : '';
    
    const mainImage = property.images[0] || 'placeholder.jpg';
    const imagePath = getImagePath(property.id, mainImage);
    
    const monthlyIncome = property.status === 'Rented' && property.monthlyRent ? 
        `<p class="mb-1"><strong>Monthly Income:</strong> ${formatCurrency(property.monthlyRent)} <span class="badge bg-success ms-2">Rented</span></p>` : '';
    
    const pdfLink = '';

    return `
        <div class="col-lg-4 col-md-6 mb-4 property-item" 
             data-beds="${property.beds}" 
             data-status="${property.status || ''}" 
             data-price="${property.price || 0}">
            <div class="card h-100 shadow-sm property-card" onclick="window.location.href='property.html?id=${property.id}'" style="cursor: pointer;">
                <div class="position-relative">
                    <img src="${imagePath}" class="card-img-top" alt="${property.address}" 
                         style="height: 250px; object-fit: cover;" loading="lazy">
                    <div class="position-absolute top-0 end-0 p-2">
                        ${statusBadge}
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${property.address}</h5>
                    <h6 class="text-muted mb-3">${property.city}</h6>
                    
                    <div class="mb-3">
                        <span class="badge bg-secondary me-2">${property.beds} Beds</span>
                        <span class="badge bg-secondary me-2">${property.baths} Bath</span>
                        <span class="badge bg-secondary">${property.sqft} sqft</span>
                    </div>
                    
                    <p class="h5 text-primary mb-2">${formatCurrency(property.price)}</p>
                    ${monthlyIncome}
                    
                    ${property.notes ? `<p class="text-muted small">${property.notes}</p>` : ''}
                    
                    <div class="d-flex gap-2 mt-auto">
                        <a href="property.html?id=${property.id}" class="btn btn-primary btn-sm flex-fill" onclick="event.stopPropagation();">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Display properties
function displayProperties(propertiesToShow = properties) {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = propertiesToShow.map(property => createPropertyCard(property)).join('');
}

// Filter and sort functionality
function filterAndSortProperties() {
    let filtered = [...properties];
    
    // Bedroom filter
    const bedroomFilter = document.getElementById('bedroomFilter').value;
    if (bedroomFilter) {
        filtered = filtered.filter(p => p.beds == bedroomFilter);
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter) {
        filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Price sort
    const priceSort = document.getElementById('priceSort').value;
    if (priceSort) {
        filtered.sort((a, b) => {
            const priceA = a.price || 0;
            const priceB = b.price || 0;
            return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }
    
    displayProperties(filtered);
}

// Reset filters
function resetFilters() {
    document.getElementById('bedroomFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('priceSort').value = '';
    displayProperties();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayProperties();
    
    // Add event listeners for filters
    document.getElementById('bedroomFilter').addEventListener('change', filterAndSortProperties);
    document.getElementById('statusFilter').addEventListener('change', filterAndSortProperties);
    document.getElementById('priceSort').addEventListener('change', filterAndSortProperties);
});