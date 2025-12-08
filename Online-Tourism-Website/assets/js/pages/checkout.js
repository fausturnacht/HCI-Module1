let viatorApiKey = "";
fetch('./assets/js/config.json')
  .then(res => res.json())
  .then(config => {
    viatorApiKey = config.VIATOR_APIKEY;
  });
  
// handle fetching and displaying package details
let urlParams = "";
let id = "";
let price = "";
let adultFarePrice = 0;
let childFarePrice = 0;
let infantFarePrice = 0;
let addonPrice = 1120; // Default add-on price
document.addEventListener('DOMContentLoaded', async () => {
    urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('packageId'); // FIX: Parameter name is packageId
    price = urlParams.get('price');

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

            // --- Package Card Details ---
            document.getElementById('pkgTitle-display').innerHTML = data.title || '—';
            document.getElementById('pkgPrice').innerHTML = `₱${Number(price).toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
            document.getElementById('pkgRating').innerHTML = data.reviews ? `⭐ ${data.reviews.combinedAverageRating || '—'} (${data.reviews.totalReviews || 0} reviews)` : '—';
            document.getElementById('pkgDuration').innerHTML = data.duration ? `${data.duration.text || data.duration}` : '—';
            document.getElementById('pkgAvailability').innerHTML = data.availability && data.availability.status ? data.availability.status : 'Available';
            document.getElementById('pkgReviews').innerHTML = data.reviews ? `${data.reviews.totalReviews} reviews` : '—';
            
            // Set thumbnail image from API
            const thumbnailImg = document.getElementById('pkgThumbnail');
            if (data.images && data.images.length > 0) {
              const coverImage = data.images.find(img => img.isCover) || data.images[0];
              thumbnailImg.src = coverImage.variants.find(v => v.width === 720)?.url || 'https://placehold.co/250x250?text=No+Image';
              thumbnailImg.alt = data.title || 'Package thumbnail';
            } else {
              thumbnailImg.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }

            // --- Main Details (with fixes) ---
            const adultFareContainer = document.getElementById('adultFare');
            adultFarePrice = Number(price);
            adultFareContainer.innerHTML = `₱ ${adultFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;

            const childFareContainer = document.getElementById('childFare');
            childFarePrice = Math.round(adultFarePrice * 0.75); // Assuming child fare is 75% of adult fare
            childFareContainer.innerHTML = `₱ ${childFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;

            const infantFareContainer = document.getElementById('infantFare');
            infantFarePrice = Math.round(adultFarePrice * 0.10); // Assuming infant fare is 10% of adult fare
            infantFareContainer.innerHTML = `₱ ${infantFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;

            // const tourMainImageContainer = document.getElementById('mainImg');
            // // Safely get a large image, fallback to placeholder
            // const coverImage = data.images.find(img => img.isCover) || data.images[0];
            // tourMainImageContainer.src = coverImage.variants.find(v => v.width === 720)?.url || 'https://placehold.co/720x480?text=No+Image';

            // const tourThumbnailContainer = document.getElementById('thumbnail-container');

            // var thumbnailsHTML = '';
            // data.images.forEach(image => {
            //     // Use a smaller variant for thumbnails
            //     const thumbUrl = image.variants.find(v => v.width === 100)?.url || image.variants[0].url;
            //     thumbnailsHTML += `<img src="${thumbUrl}" alt="Thumbnail" class="thumbnail" onclick="changeMainImage(this)" data-fullsrc="${image.variants.find(v => v.width === 720)?.url}">`;
            // });
            // tourThumbnailContainer.innerHTML = thumbnailsHTML;

            // const tourInfoFeaturesContainer = document.getElementById('tour-info-features');
            // tourInfoFeaturesContainer.innerHTML = `
            //     <span>⏳ ${data.itinerary.duration.fixedDurationInMinutes/60} hours (approx)</span>
            //     <span>🚗 Pickup offered</span>
            //     <span>📱 Mobile ticket</span>
            //     <span>🌐 Offered in: ${data.language.toUpperCase()}</span>
            //     `;

            // const tourOverviewContainer = document.getElementById('tour-overview-text');
            // tourOverviewContainer.innerHTML = data.description; // FIX: Property is 'description' (lowercase)

            // --- Populate Additional Sections ---

            // Highlights - Generated from itinerary
            // const highlightsList = document.getElementById('tour-highlights-list');
            // highlightsList.innerHTML = ''; // Clear existing
            // if (data.itinerary && data.itinerary.itineraryItems && data.itinerary.itineraryItems.length > 0) {
            //     data.itinerary.itineraryItems.forEach(item => {
            //         const li = document.createElement('li');
            //         // Use the first sentence of the itinerary item as a highlight
            //         li.textContent = item.description.split('.')[0] + '.';
            //         highlightsList.appendChild(li);
            //     });
            // } else {
            //     highlightsList.innerHTML = '<li>Highlights data not available for this tour.</li>';
            // }

            // Inclusions
            // const inclusionsList = document.getElementById('tour-inclusions-list');
            // inclusionsList.innerHTML = ''; // Clear existing
            // data.inclusions.forEach(item => {
            //     const li = document.createElement('li');
            //     li.textContent = item.otherDescription || item.description;
            //     inclusionsList.appendChild(li);
            // });

            // // Tour Options
            // const tourOptionsContainer = document.getElementById('tour-options-container');
            // tourOptionsContainer.innerHTML = ''; // Clear existing
            // if (data.productOptions && data.productOptions.length > 0) {
            //     data.productOptions.forEach((option, index) => {
            //         const card = document.createElement('div');
            //         card.className = 'option-card';
                    
            //         // Use a main tour image as a placeholder, cycling through available images
            //         const imageUrl = data.images[index % data.images.length]?.variants.find(v => v.width > 500)?.url || data.images[0].variants.find(v => v.width > 500)?.url;
            //         const durationInHours = data.itinerary.duration.fixedDurationInMinutes / 60;

            //         card.innerHTML = `
            //             <div class="card-image">
            //                 <img src="${imageUrl}" alt="${option.title}">
            //             </div>
            //             <div class="card-content">
            //                 <h3>${option.title}</h3>
            //                 <p class="duration">Duration: ${durationInHours} hours</p>
            //                 <p class="price">From ₱${price} per person</p>
            //                 <button class="book-now">Book Now</button>
            //             </div>
            //         `;
            //         tourOptionsContainer.appendChild(card);
            //     });
            // } else {
            //     tourOptionsContainer.innerHTML = '<p>No specific tour options available.</p>';
            // }

            // // Itinerary
            // const itineraryList = document.getElementById('itinerary-list');
            // itineraryList.innerHTML = ''; // Clear existing
            // data.itinerary.itineraryItems.forEach(item => {
            //     const li = document.createElement('li');
            //     li.innerHTML = `<p>${item.description}</p>`;
            //     itineraryList.appendChild(li);
            // });

            // // Additional Info
            // const additionalInfoList = document.getElementById('additional-info-list');
            // additionalInfoList.innerHTML = ''; // Clear existing
            // data.additionalInfo.forEach(item => {
            //     const li = document.createElement('li');
            //     li.textContent = item.description;
            //     additionalInfoList.appendChild(li);
            // });

            // Supplier
            // document.getElementById('tour-supplier').textContent = `Supplied by ${data.supplier.name}`;

            // --- Data Not Available in this API response ---
            // document.getElementById('reviews-wrapper').innerHTML = '<p>Individual review text is not available.</p>';
            // document.getElementById('traveler-photos-grid').innerHTML = '<p>Traveler photos are not available.</p>';
            // document.getElementById('tourReviewsList').innerHTML = '<p>Detailed reviews are not available.</p>';
            
        } catch (error) {
            console.error('Error fetching package data: ', error);
            // document.querySelector('.tour-page').innerHTML = '<h2>Sorry, we could not load the tour details. Please try again later.</h2>';
        }
    }
});


/* -----------------------------
   DESTINATIONS DATA
   Local (Philippines) and International lists
   ----------------------------- */
// const localDestinations = [
//   "Manila, Philippines",
//   "Cebu, Philippines",
//   "Boracay, Aklan, Philippines",
//   "El Nido, Palawan, Philippines",
//   "Coron, Palawan, Philippines",
//   "Baguio, Philippines",
//   "Davao, Philippines",
//   "Siargao, Surigao del Norte, Philippines",
//   "Iloilo, Philippines",
//   "Bohol, Philippines",
//   "Vigan, Ilocos Sur, Philippines",
//   "Sagada, Mountain Province, Philippines",
//   "Tagaytay, Philippines",
//   "Pagudpud, Ilocos Norte, Philippines",
//   "Puerto Princesa, Palawan, Philippines"
// ];

// const internationalDestinations = [
//   "Paris, France",
//   "Tokyo, Japan",
//   "New York, USA",
//   "London, UK",
//   "Sydney, Australia",
//   "Bangkok, Thailand",
//   "Dubai, UAE",
//   "Singapore, Singapore",
//   "Seoul, South Korea",
//   "Barcelona, Spain",
//   "Rome, Italy",
//   "Los Angeles, USA",
//   "Vancouver, Canada",
//   "Amsterdam, Netherlands",
//   "Berlin, Germany"
// ];

/* -----------------------------
   Helper element references
   ----------------------------- */
// const scopeEl = document.getElementById('scope');
// const destinationInput = document.getElementById('destinationSearch');
// const datalist = document.getElementById('dest-list');

const pages = Array.from(document.querySelectorAll('#formReservation .page'));
const steps = document.querySelectorAll('.steps .step');

const reservationCard = document.getElementById('reservationCard');
const billingCard = document.getElementById('billingCard');
const invoiceCard = document.getElementById('invoiceCard');
const confirmationCard = document.getElementById('confirmationCard');

/* -----------------------------
   Populate datalist based on scope
   ----------------------------- */
// function populateDatalist(list){
//   datalist.innerHTML = '';
//   for(const item of list){
//     const opt = document.createElement('option');
//     opt.value = item;
//     datalist.appendChild(opt);
//   }
// }
// scopeEl.addEventListener('change', (e)=>{
//   if(e.target.value === 'Local') populateDatalist(localDestinations);
//   else if(e.target.value === 'International') populateDatalist(internationalDestinations);
//   destinationInput.value = '';
// });

/* -----------------------------
   Spinner controls (generic)
   Buttons have data-inc or data-dec attributes with the input id
   ----------------------------- */
document.querySelectorAll('.spin button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const inc = btn.dataset.inc;
    const dec = btn.dataset.dec;
    const id = inc || dec;
    if(!id) return;
    const input = document.getElementById(id);
    if(!input) return;
    let val = parseInt(input.value) || 0;
    if(inc){
      const max = parseInt(input.max || 999);
      if(val < max) val++;
    } else {
      const min = parseInt(input.min || 0);
      if(val > min) val--;
    }
    input.value = val;
    if(id === 'addons') updateAddonsFields();
    if(id === 'infants' || id === 'kids' || id === 'adults') updateFareDisplay();
  });
});

/* -----------------------------
   Add-ons dynamic fields creation
   ----------------------------- */
const addonsWrap = document.getElementById('addonsWrap');
function updateAddonsFields(){
  const count = parseInt(document.getElementById('addons').value) || 0;
  addonsWrap.innerHTML = '';
  for(let i=1;i<=count;i++){
    const div = document.createElement('div');
    div.className = 'addon-item';
    const input = document.createElement('input');
    input.className = 'control';
    input.setAttribute('data-addon-index', i);
    input.placeholder = `Describe add-on ${i}`;
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = `Add-on ${i}`;
    div.appendChild(tag);
    div.appendChild(input);
    addonsWrap.appendChild(div);
  }
}
updateAddonsFields();

/* -----------------------------
   Update fare display based on passenger counts
   ----------------------------- */
function updateFareDisplay() {
  const adults = parseInt(document.getElementById('adults').value) || 0;
  const kids = parseInt(document.getElementById('kids').value) || 0;
  const infants = parseInt(document.getElementById('infants').value) || 0;
  
  // Update fare display in reservation form
  document.getElementById('revAdultCount').textContent = adults;
  document.getElementById('revChildCount').textContent = kids;
  document.getElementById('revInfantCount').textContent = infants;
  
  // Update fare prices in reservation form
  document.getElementById('revAdultFare').textContent = adultFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
  document.getElementById('revChildFare').textContent = childFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
  document.getElementById('revInfantFare').textContent = infantFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
  
  // Update fare display in confirmation
  document.getElementById('confAdultCount').textContent = adults;
  document.getElementById('confChildCount').textContent = kids;
  document.getElementById('confInfantCount').textContent = infants;
  
  // Update fare prices in confirmation
  document.getElementById('confAdultFare').textContent = adultFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
  document.getElementById('confChildFare').textContent = childFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
  document.getElementById('confInfantFare').textContent = infantFarePrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
}

/* -----------------------------
   Navigation utilities
   show page index within reservation card
   ----------------------------- */
function showReservationStep(index){
  pages.forEach((p,i)=> p.hidden = i!==index);
  steps.forEach((s,i)=> s.classList.toggle('active', i===index));
  // hide other cards while inside reservation flow
  billingCard.style.display = 'none';
  invoiceCard.style.display = 'none';
  confirmationCard.style.display = 'none';
  reservationCard.style.display = 'block';
}

/* initialize */
showReservationStep(0);

/* -----------------------------
   REVIEW: fill review page with values
   ----------------------------- */
function fillReviewData(){
  document.getElementById('revName').innerText = `${document.getElementById('first').value} ${document.getElementById('last').value}`;
  document.getElementById('revEmail').innerText = document.getElementById('emailRes').value;
  document.getElementById('revPhone').innerText = document.getElementById('phoneRes').value;
  // document.getElementById('revScope').innerText = scopeEl.value;
  // document.getElementById('revDestination').innerText = destinationInput.value;
  // document.getElementById('revAccom').innerText = document.getElementById('accommodation').value;
  document.getElementById('revCheckin').innerText = document.getElementById('checkin').value;
  // document.getElementById('revCheckout').innerText = document.getElementById('checkout').value;
  document.getElementById('revAdults').innerText = document.getElementById('adults').value;
  document.getElementById('revKids').innerText = document.getElementById('kids').value;
  document.getElementById('revInfants').innerText = document.getElementById('infants').value;
  // document.getElementById('revRooms').innerText = document.getElementById('rooms').value;

  const addonInputs = Array.from(addonsWrap.querySelectorAll('input[data-addon-index]')).map(i => i.value || '(no description)');
  document.getElementById('revAddons').innerText = addonInputs.length ? addonInputs.join('; ') : 'None';
  // document.getElementById('revRequests').innerText = document.getElementById('requests').value || 'None';
  
  // Update fare display
  updateFareDisplay();
}

/* -----------------------------
   Button: Next to Review
   ----------------------------- */
document.getElementById('nextToReview').addEventListener('click', ()=>{
  // basic validation
  const requiredIds = ['first','last','emailRes','phoneRes','checkin','adults'];
  for(const id of requiredIds){
    const el = document.getElementById(id);
    if(!el || !el.value){
      alert('Please fill all required fields before proceeding.');
      return;
    }
  }
  // date validation: checkout after checkin
  // const ci = document.getElementById('checkin').value;
  // const co = document.getElementById('checkout').value;
  // if(ci && co && (new Date(co) <= new Date(ci))){
  //   alert('Check-out must be at least 1 day after check-in.');
  //   return;
  // }

  fillReviewData();
  showReservationStep(1);
});

/* Back button on review */
document.getElementById('backToForm').addEventListener('click', ()=> showReservationStep(0));

/* Proceed to Billing from Review */
document.getElementById('proceedToBilling').addEventListener('click', ()=>{
  // prefill billing and show billing card
  const fullName = `${document.getElementById('first').value} ${document.getElementById('last').value}`;
  document.getElementById('billFullName').value = fullName;
  document.getElementById('billEmail').value = document.getElementById('emailRes').value;
  document.getElementById('billPhone').value = document.getElementById('phoneRes').value;

  // document.getElementById('billPackageName').innerText = `${document.getElementById('accommodation').value} — ${destinationInput.value || '—'}`;
  document.getElementById('billGuests').innerText = `${document.getElementById('adults').value} Adults, ${document.getElementById('kids').value} Kids, ${document.getElementById('infants').value} Infants`;
  document.getElementById('billTravelDate').innerText = `${document.getElementById('checkin').value}`;

  const addonInputs = Array.from(addonsWrap.querySelectorAll('input[data-addon-index]')).map(i=>i.value || '(no description)');
  document.getElementById('billAddons').innerText = addonInputs.length ? addonInputs.join('; ') : 'None';

  // calculate price (with fare details) - Philippine Peso
  const adults = parseInt(document.getElementById('adults').value) || 0;
  const kids = parseInt(document.getElementById('kids').value) || 0;
  const infants = parseInt(document.getElementById('infants').value) || 0;
  // const rooms = parseInt(document.getElementById('rooms').value) || 0;
  const addonsCount = addonInputs.length;
  
  const subtotal = adults * adultFarePrice + kids * childFarePrice + infants * infantFarePrice + addonsCount * addonPrice;
  document.getElementById('billTotalPrice').innerText = `₱${subtotal.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;

  // show billing card and update step highlight
  reservationCard.style.display = 'none';
  billingCard.style.display = 'block';
  invoiceCard.style.display = 'none';
  confirmationCard.style.display = 'none';
  // update step indicator visual
  steps.forEach((s,i)=> s.classList.toggle('active', i===2));
});

/* Back from billing to review */
document.getElementById('backToReview').addEventListener('click', ()=>{
  billingCard.style.display = 'none';
  reservationCard.style.display = 'block';
  showReservationStep(1);
});

/* -----------------------------
   Reserve Only behavior (Option B originally, but now single-file A chosen)
   Behavior: no invoice. Show confirmation card with reservation-only details.
   ----------------------------- */
document.getElementById('reserveOnlyBtn').addEventListener('click', ()=>{
  // collect data
  const reservation = collectReservationData();
  // create reservation number
  const resvNo = 'RSV-' + Date.now().toString().slice(-8);
  // fill confirmation card
  document.getElementById('resvNo').innerText = resvNo;
  document.getElementById('confName').innerText = `${reservation.first} ${reservation.last}`;
  document.getElementById('confEmail').innerText = reservation.email;
  document.getElementById('confPhone').innerText = reservation.phone;
  // document.getElementById('confDestination').innerText = reservation.destination;
  document.getElementById('confDates').innerText = `${reservation.checkin}`;
  document.getElementById('confAdults').innerText = reservation.adults;
  document.getElementById('confKids').innerText = reservation.kids;
  document.getElementById('confInfants').innerText = reservation.infants;
  // document.getElementById('confRooms').innerText = reservation.rooms;
  document.getElementById('confAddons').innerText = reservation.addons.length ? reservation.addons.join('; ') : 'None';
  // document.getElementById('confNotes').innerText = reservation.notes || 'None';

  // Show thank you message with timestamp
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const timestamp = now.toLocaleDateString('en-PH', options);
  document.getElementById('reservationTimestamp').innerText = `Reservation made on ${timestamp}`;

  // hide other cards, show confirmation
  billingCard.style.display = 'none';
  reservationCard.style.display = 'none';
  invoiceCard.style.display = 'none';
  confirmationCard.style.display = 'block';

  // optional: store reservation-only in localStorage (if user wants to preserve)
  const stored = Object.assign({}, reservation, { reservationNo: resvNo, paid: false, timestamp: new Date().toISOString() });
  try { localStorage.setItem('reservation_only', JSON.stringify(stored)); } catch(e){ /* ignore storage error */ }
});

/* Print confirmation */
document.getElementById('printConfBtn').addEventListener('click', ()=> window.print());
document.getElementById('newResvBtn').addEventListener('click', ()=> location.reload());

/* -----------------------------
   Payment Card Validation Helper
   ----------------------------- */
function validatePaymentCard(){
  const cardName = document.getElementById('cardName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const expiryDate = document.getElementById('expiryDate').value.trim();
  const cvv = document.getElementById('cvv').value.trim();

  // Cardholder Name validation: must be filled and contain at least 2 parts
  if(!cardName){
    return { valid: false, message: 'Cardholder name is required.' };
  }
  if(cardName.split(' ').filter(p => p.length > 0).length < 2){
    return { valid: false, message: 'Please enter a valid cardholder name (first and last name).' };
  }

  // Card Number validation: must be filled and contain 13-19 digits only
  const cardNumberDigits = cardNumber.replace(/\s/g, '');
  if(!cardNumberDigits){
    return { valid: false, message: 'Card number is required.' };
  }
  if(!/^\d{13,19}$/.test(cardNumberDigits)){
    return { valid: false, message: 'Card number must be between 13 and 19 digits.' };
  }

  // Expiry Date validation: must be filled and not expired (HTML5 month input format YYYY-MM)
  if(!expiryDate){
    return { valid: false, message: 'Expiry date is required.' };
  }
  // Check if card is not expired - compare only year and month, not day
  const currentDate = new Date();
  const [expiryYear, expiryMonth] = expiryDate.split('-');
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  
  // if(parseInt(expiryYear) < currentYear || (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)){
  //   return { valid: false, message: 'Card expiry date has passed.' };
  // }

  // CVV validation: must be filled and contain 3-4 digits
  if(!cvv){
    return { valid: false, message: 'CVV is required.' };
  }
  if(!/^\d{3,4}$/.test(cvv)){
    return { valid: false, message: 'CVV must be 3 or 4 digits.' };
  }

  return { valid: true, message: 'Payment card validated successfully.' };
}

/* -----------------------------
   Pay Now: generate invoice and show invoice card
   ----------------------------- */
document.getElementById('payNowBtn').addEventListener('click', ()=>{
  // validate billing minimal fields
  const billName = document.getElementById('billFullName').value.trim();
  const billEmail = document.getElementById('billEmail').value.trim();
  const billPhone = document.getElementById('billPhone').value.trim();
  if(!billName || !billEmail || !billPhone){
    alert('Please fill billing name, email, and phone before paying.');
    return;
  }

  // validate payment card fields
  const cardValidation = validatePaymentCard();
  if(!cardValidation.valid){
    alert(cardValidation.message);
    return;
  }

  // collect reservation and billing
  const reservation = collectReservationData();
  const billing = {
    fullName: billName,
    email: billEmail,
    phone: billPhone,
    cardName: document.getElementById('cardName').value.trim(),
    cardNumber: document.getElementById('cardNumber').value.trim(),
    expiryDate: document.getElementById('expiryDate').value.trim(),
    cvv: document.getElementById('cvv').value.trim()
  };

  // pricing constants (with fare details) - Philippine Peso
  const adults = parseInt(reservation.adults) || 0;
  const kids = parseInt(reservation.kids) || 0;
  const infants = parseInt(reservation.infants) || 0;
  const rooms = parseInt(reservation.rooms) || 0;
  const addonsCount = reservation.addons.length;

  // line items
  const items = [];
  if(rooms > 0) items.push({ desc: `Rooms x${rooms}`, date: reservation.checkin, place: reservation.destination, cost: rooms * 4480 });
  if(adults > 0) items.push({ desc: `Adults x${adults}`, date: reservation.checkin, place: reservation.destination, cost: adults * adultFarePrice });
  if(kids > 0) items.push({ desc: `Children (2-11) x${kids}`, date: reservation.checkin, place: reservation.destination, cost: kids * childFarePrice });
  if(infants > 0) items.push({ desc: `Infants (under 2) x${infants}`, date: reservation.checkin, place: reservation.destination, cost: infants * infantFarePrice });
  reservation.addons.forEach((a,i)=> items.push({ desc: a || `Add-on ${i+1}`, date: reservation.checkin, place: reservation.destination, cost: addonPrice }));

  const subtotal = items.reduce((s,it)=> s + (it.cost || 0), 0);
  const tax = 0; // user didn't request tax calculation; set to zero
  const discount = 0;
  const grandTotal = subtotal + tax - discount;

  // populate invoice UI
  document.getElementById('invNo').innerText = 'INV-' + Date.now().toString().slice(-10);
  document.getElementById('invDateToday').innerText = new Date().toLocaleDateString();
  document.getElementById('invName').innerText = billing.fullName;
  document.getElementById('invEmail').innerText = billing.email;
  document.getElementById('invPhone').innerText = billing.phone;
  document.getElementById('invTravelDates').innerText = `${reservation.checkin}`;
  // document.getElementById('invDestination').innerText = reservation.destination;
  document.getElementById('invTravelers').innerText = `${adults} Adults, ${kids} Kids, ${infants} Infants`;

  const tbody = document.getElementById('invoiceItems');
  tbody.innerHTML = '';
  for(const it of items){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(it.desc)}</td><td>${escapeHtml(it.date || '')}</td><td>${escapeHtml(it.place || '')}</td><td>₱${Number(it.cost||0).toLocaleString('en-PH', {minimumFractionDigits: 2})}</td>`;
    tbody.appendChild(tr);
  }

  document.getElementById('invSubTotal').innerText = `₱${subtotal.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
  document.getElementById('invTax').innerText = `₱${tax.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
  document.getElementById('invDiscount').innerText = `₱${discount.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
  document.getElementById('invTotal2').innerText = `₱${grandTotal.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
  document.getElementById('invPaymentMethod').innerText = billing.cardNumber ? 'Paid by Credit Card' : 'Paid (method not specified)';

  // show invoice card, hide others
  reservationCard.style.display = 'none';
  billingCard.style.display = 'none';
  confirmationCard.style.display = 'none';
  invoiceCard.style.display = 'block';

  // optionally save invoice to localStorage for persistence
  const invoice = {
    invoiceNo: document.getElementById('invNo').innerText,
    date: new Date().toISOString(),
    billing,
    reservation,
    items,
    subtotal,
    tax,
    discount,
    total: grandTotal
  };
  try { localStorage.setItem('latestInvoice', JSON.stringify(invoice)); } catch(e){ /* ignore */ }
});

/* Print invoice and "make another reservation" behaviors */
document.getElementById('printInvoiceBtn').addEventListener('click', ()=> window.print());
document.getElementById('makeAnotherFromInvoice').addEventListener('click', ()=> location.reload());

/* -----------------------------
   Utility: collect reservation data from form fields
   ----------------------------- */
function collectReservationData(){
  const addonInputs = Array.from(addonsWrap.querySelectorAll('input[data-addon-index]')).map(i => i.value.trim()).filter(x=>x!=='');

  return {
    first: document.getElementById('first').value.trim(),
    last: document.getElementById('last').value.trim(),
    email: document.getElementById('emailRes').value.trim(),
    phone: document.getElementById('phoneRes').value.trim(),
    // scope: document.getElementById('scope').value,
    // destination: document.getElementById('destinationSearch').value.trim(),
    // accommodation: document.getElementById('accommodation').value,
    checkin: document.getElementById('checkin').value,
    // checkout: document.getElementById('checkout').value,
    adults: document.getElementById('adults').value,
    kids: document.getElementById('kids').value,
    infants: document.getElementById('infants').value,
    // rooms: document.getElementById('rooms').value,
    addons: addonInputs,
    // notes: document.getElementById('requests').value.trim()
  };
}

/* -----------------------------
   Escape HTML helper (small) to avoid naive injection into table cells
   ----------------------------- */
function escapeHtml(str){
  if(!str && str !== 0) return '';
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

/* -----------------------------
   Small UX helpers: ensure datalist is cleared initially
   ----------------------------- */
// datalist.innerHTML = '';

/* -----------------------------
   Accessibility & keyboard: prevent Enter submitting the form unexpectedly on destination
   ----------------------------- */
// destinationInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter') e.preventDefault(); });

/* -----------------------------
   Load last invoice when page loads (optional)
   If the user revisits and there's a saved invoice, we could show it or keep hidden.
   We'll not auto-open it; it's saved for future.
   ----------------------------- */
try{
  const saved = JSON.parse(localStorage.getItem('latestInvoice') || 'null');
  // not automatically showing; but data kept in storage
} catch(e){ /* ignore */ }

/* -----------------------------
   Initialize fare display
   ----------------------------- */
updateFareDisplay();