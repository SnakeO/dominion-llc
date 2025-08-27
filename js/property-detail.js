// Get property ID from URL
function getPropertyIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

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
    // Thumbnails have the same name as source images, just with thumb- prefix
    return `assets/thumbnails/${folderMap[propertyId]}/thumb-${imageName}`;
}

// Load property details
function loadPropertyDetails() {
    const propertyId = getPropertyIdFromUrl();
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set page title
    document.title = `${property.address} - Dominion Investors LLC`;
    
    // Basic info
    document.getElementById('propertyAddress').textContent = property.address;
    document.getElementById('propertyCity').textContent = property.city;
    document.getElementById('propertyPrice').textContent = formatCurrency(property.price);
    
    // Status badge
    if (property.status) {
        const badgeText = property.status === 'Rented' && property.monthlyRent ? 
            `Rented | ${formatCurrency(property.monthlyRent)}/mo` : property.status;
        const statusClass = property.status === 'Rented' ? 'bg-success' : 'bg-warning text-dark';
        document.getElementById('statusBadge').innerHTML = 
            `<span class="badge ${statusClass}">${badgeText}</span>`;
    }
    
    // Property features
    document.getElementById('bedrooms').textContent = property.beds;
    document.getElementById('bathrooms').textContent = property.baths;
    document.getElementById('sqft').textContent = property.sqft;
    document.getElementById('ac').textContent = property.ac || 'Not specified';
    
    // Financial details
    // Only show Current Rent for Rented properties
    if (property.monthlyRent && property.status === 'Rented') {
        document.getElementById('monthlyRentInfo').innerHTML = 
            `<p class="mb-2"><strong>Current Rent:</strong> ${formatCurrency(property.monthlyRent)}</p>`;
    }
    
    if (property.marketRent) {
        document.getElementById('marketRentInfo').innerHTML = 
            `<p class="mb-2"><strong>Suggested Rent:</strong> $${property.marketRent}</p>`;
        
        // Add explanation for rented properties with long-term tenants
        if (property.status === 'Rented' && property.rentalTime && property.monthlyRent && property.marketRent) {
            const currentRent = property.monthlyRent;
            const suggestedRent = parseInt(property.marketRent.toString().replace(/[^0-9]/g, ''));
            if (currentRent < suggestedRent) {
                document.getElementById('marketRentInfo').innerHTML += 
                    `<div class="alert alert-info mb-0 mt-2">
                        <small><i class="fas fa-info-circle"></i> The current rent has been maintained below market rates as a benefit to our reliable, long-term tenant who has consistently paid on time and maintained the property well over their ${property.rentalTime} tenancy.</small>
                    </div>`;
            }
        }
        
        // Add rental duration right after suggested rent (only for rented properties)
        if (property.rentalTime && property.status === 'Rented') {
            document.getElementById('marketRentInfo').innerHTML += 
                `<p class="mb-2 mt-2"><strong>Current Tenant Rental Duration:</strong> ${property.rentalTime}</p>`;
        }
    }
    
    if (property.propertyTax) {
        document.getElementById('propertyTaxInfo').innerHTML = 
            `<p class="mb-2"><strong>Property Tax:</strong> ${formatCurrency(property.propertyTax)}</p>`;
    }
    
    if (property.parishTax) {
        document.getElementById('parishTaxInfo').innerHTML = 
            `<p class="mb-2"><strong>Parish Tax:</strong> ${formatCurrency(property.parishTax)}</p>`;
    }
    
    if (property.notes) {
        document.getElementById('notesInfo').innerHTML = 
            `<div class="alert alert-info mb-0">${property.notes}</div>`;
    }
    
    // Load images
    const imagesContainer = document.getElementById('propertyImages');
    const thumbnailContainer = document.getElementById('thumbnailGallery');
    
    property.images.forEach((image, index) => {
        const imagePath = getImagePath(property.id, image);
        const thumbnailPath = getThumbnailPath(property.id, image);
        
        // Add to main swiper with lightbox link
        imagesContainer.innerHTML += `
            <div class="swiper-slide">
                <a href="${imagePath}" data-lightbox="property-gallery" data-title="${property.address} - Image ${index + 1}">
                    <img src="${imagePath}" class="w-100" alt="${property.address} - Image ${index + 1}" 
                         style="height: 500px; object-fit: cover; cursor: pointer;">
                </a>
            </div>
        `;
        
        // Add to thumbnail gallery
        thumbnailContainer.innerHTML += `
            <div class="col-3">
                <img src="${thumbnailPath}" 
                     class="img-fluid thumbnail-hover" 
                     alt="${property.address} - Thumbnail ${index + 1}"
                     onclick="swiper.slideTo(${index})"
                     style="cursor: pointer; height: 80px; width: 100%; object-fit: cover;">
            </div>
        `;
    });
    
    // Initialize Swiper
    const swiper = new Swiper('.propertySwiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true
    });
    
    // Make swiper global for thumbnail clicks
    window.swiper = swiper;
    
    // Load video if available
    if (property.video) {
        document.getElementById('videoSection').style.display = 'block';
        document.getElementById('propertyVideo').src = `assets/videos/${property.video}`;
        
        // Add click handler for video poster
        const videoPosterContainer = document.getElementById('videoPosterContainer');
        videoPosterContainer.addEventListener('click', function() {
            const video = document.getElementById('propertyVideo');
            if (!this.classList.contains('playing')) {
                this.classList.add('playing');
                video.play();
            }
        });
        
        // Add event listener to show poster when video ends
        document.getElementById('propertyVideo').addEventListener('ended', function() {
            videoPosterContainer.classList.remove('playing');
        });
    }
    
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadPropertyDetails);