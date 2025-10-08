document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('packageId'); // FIX: Parameter name is packageId
    const price = urlParams.get('price');

    if (id) {
        console.log('Received ID:', id);

        try {
            // FIX: Added required headers for the API call
            const response = await fetch(`https://api.sandbox.viator.com/partner/products/${id}`, {
                method: 'GET',
                headers: {
                    'exp-api-key': 'a428b365-c65a-46ca-8899-31556d3f97f6',
                    'Accept-Language': 'en-US',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;version=2.0'
                }
            });

            if (!response.ok) {
                throw new Error('Could not fetch package data');
            }

            const data = await response.json();

            // --- Main Details (with fixes) ---
            const tourPriceDisplayContainer = document.getElementById('tour-price-display');
            tourPriceDisplayContainer.innerHTML = `From ₱${price} per person`;

            const tourTitleContainer = document.getElementById('tour-title');
            tourTitleContainer.innerHTML = data.title; // FIX: Property is 'title'

            const tourRatingTopContainer = document.getElementById('tour-rating-top');
            tourRatingTopContainer.innerHTML = `<span> ⭐ ${data.reviews.combinedAverageRating} </span> Based on ${data.reviews.totalReviews} reviews`;

            const tourMainImageContainer = document.getElementById('mainImg');
            // Safely get a large image, fallback to placeholder
            const coverImage = data.images.find(img => img.isCover) || data.images[0];
            tourMainImageContainer.src = coverImage.variants.find(v => v.width === 720)?.url || 'https://placehold.co/720x480?text=No+Image';

            const tourThumbnailContainer = document.getElementById('thumbnail-container');
            var thumbnailsHTML = '';
            data.images.forEach(image => {
                // Use a smaller variant for thumbnails
                const thumbUrl = image.variants.find(v => v.width === 100)?.url || image.variants[0].url;
                thumbnailsHTML += `<img src="${thumbUrl}" alt="Thumbnail" class="thumbnail" onclick="changeMainImage(this)" data-fullsrc="${image.variants.find(v => v.width === 720)?.url}">`;
            });
            tourThumbnailContainer.innerHTML = thumbnailsHTML;

            const tourInfoFeaturesContainer = document.getElementById('tour-info-features');
            tourInfoFeaturesContainer.innerHTML = `
                <span>⏳ ${data.itinerary.duration.fixedDurationInMinutes/60} hours (approx)</span>
                <span>🚗 Pickup offered</span>
                <span>📱 Mobile ticket</span>
                <span>🌐 Offered in: ${data.language.toUpperCase()}</span>
                `;

            const tourOverviewContainer = document.getElementById('tour-overview-text');
            tourOverviewContainer.innerHTML = data.description; // FIX: Property is 'description' (lowercase)

            // --- Populate Additional Sections ---

            // Highlights - Generated from itinerary
            const highlightsList = document.getElementById('tour-highlights-list');
            highlightsList.innerHTML = ''; // Clear existing
            if (data.itinerary && data.itinerary.itineraryItems && data.itinerary.itineraryItems.length > 0) {
                data.itinerary.itineraryItems.forEach(item => {
                    const li = document.createElement('li');
                    // Use the first sentence of the itinerary item as a highlight
                    li.textContent = item.description.split('.')[0] + '.';
                    highlightsList.appendChild(li);
                });
            } else {
                highlightsList.innerHTML = '<li>Highlights data not available for this tour.</li>';
            }

            // Inclusions
            const inclusionsList = document.getElementById('tour-inclusions-list');
            inclusionsList.innerHTML = ''; // Clear existing
            data.inclusions.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.otherDescription || item.description;
                inclusionsList.appendChild(li);
            });

            // Tour Options
            const tourOptionsContainer = document.getElementById('tour-options-container');
            tourOptionsContainer.innerHTML = ''; // Clear existing
            if (data.productOptions && data.productOptions.length > 0) {
                data.productOptions.forEach((option, index) => {
                    const card = document.createElement('div');
                    card.className = 'option-card';
                    
                    // Use a main tour image as a placeholder, cycling through available images
                    const imageUrl = data.images[index % data.images.length]?.variants.find(v => v.width > 500)?.url || data.images[0].variants.find(v => v.width > 500)?.url;
                    const durationInHours = data.itinerary.duration.fixedDurationInMinutes / 60;

                    card.innerHTML = `
                        <div class="card-image">
                            <img src="${imageUrl}" alt="${option.title}">
                        </div>
                        <div class="card-content">
                            <h3>${option.title}</h3>
                            <p class="duration">Duration: ${durationInHours} hours</p>
                            <p class="price">From ₱${price} per person</p>
                            <button class="book-now">Book Now</button>
                        </div>
                    `;
                    tourOptionsContainer.appendChild(card);
                });
            } else {
                tourOptionsContainer.innerHTML = '<p>No specific tour options available.</p>';
            }

            // Itinerary
            const itineraryList = document.getElementById('itinerary-list');
            itineraryList.innerHTML = ''; // Clear existing
            data.itinerary.itineraryItems.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<p>${item.description}</p>`;
                itineraryList.appendChild(li);
            });

            // Additional Info
            const additionalInfoList = document.getElementById('additional-info-list');
            additionalInfoList.innerHTML = ''; // Clear existing
            data.additionalInfo.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.description;
                additionalInfoList.appendChild(li);
            });

            // Supplier
            document.getElementById('tour-supplier').textContent = `Supplied by ${data.supplier.name}`;

            // --- Data Not Available in this API response ---
            document.getElementById('reviews-wrapper').innerHTML = '<p>Individual review text is not available.</p>';
            document.getElementById('traveler-photos-grid').innerHTML = '<p>Traveler photos are not available.</p>';
            document.getElementById('tourReviewsList').innerHTML = '<p>Detailed reviews are not available.</p>';
            
        } catch (error) {
            console.error('Error fetching package data: ', error);
            document.querySelector('.tour-page').innerHTML = '<h2>Sorry, we could not load the tour details. Please try again later.</h2>';
        }
    }
});

// Add this function to make thumbnails clickable
function changeMainImage(element) {
    document.getElementById('mainImg').src = element.dataset.fullsrc;
}