class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="header">
            <div class="brand">
                <img src="assets/images/WandersyncLogo.png" alt="Logo">
                <span>Tourism Explorer</span>
            </div>
        <nav class="nav" id="nav">
            <a href="index.html">Home</a>
            <a href="login.html">Log in</a>
            <a href="contact.html">Contact Us</a>
            <a href="inquire.html">Inquiry</a>
        </nav>
        </header>
        `
    }
}

class SpecialFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>&copy; 2025 Tourism Explorer. All Rights Reserved.</footer>
        `
    }
}

class SpecialPillTabs extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="pilltabs" id="tabs">
        <button>Home</button>
        <button>Destinations</button>
        <button>Packages</button>
        <button>Hotels</button>
        <button>Flights</button>
        </div>
        `
    }
}


customElements.define('special-header', SpecialHeader);
customElements.define('special-footer', SpecialFooter);
customElements.define('special-pilltabs', SpecialPillTabs);

// Global Attributes
const destinations = [];
const packages = [];
const hotels = [];
const flights = [];
const geoapifyApiKey = "2d04cb07c549410e9f43ae6a022c6eb9";
const googleImagesApiKey_1 = "AIzaSyChKz2Hl1IPvMlV9Br8i0rnpNR7E0-QrSE";
const googleImagesApiKey_2 = "AIzaSyDrpYODpfwSGCoLuP1WKPo4f-CJMVY4HEg";
const googleImagesApiKey_3 = "AIzaSyDNuN5_SX9Qruxanv2R7BFF6OD04hY9bB8";
const googleImagesApiKey_4 = "AIzaSyDlFrGObqgsCX7c49OO1EMWusD8HJNpWI4";
const googleImagesCXKey = "b40a4a2ea5ea04def";
var placeId = "";
var packageQuery = "";

//when website loads,
document.addEventListener('DOMContentLoaded', async () => {
    await searchPackagesHome();
});

function renderPackagesHome(list) {
    const container = document.getElementById('top-deals');
    container.innerHTML = '';
    container.className = 'cards';
    list.forEach((pkg, idx) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `<img src="${pkg.image}" alt="${pkg.title}" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image+:('">
            <div class="body">
              <h3>${pkg.title}</h3>
              <div class="h3">Starting at ₱${pkg.price}</div>
              <div class="meta">Rating: ${pkg.avgRating}</div>
              <div class="meta">Type: ${pkg.itineraryType}</div>
              <div class="cta"><button class="btn" onclick="viewInfo('${pkg.productCode}', ${pkg.price})">View Info</button></div>
            </div>`;
        container.appendChild(card);
    });
}

async function searchPackagesHome() {
    try {
        const response = await fetch(`https://api.sandbox.viator.com/partner/search/freetext`, {
            method: 'POST',
            headers: {
                'exp-api-key': 'a428b365-c65a-46ca-8899-31556d3f97f6',
                'Accept-Language': 'en-US',
                'Content-Type': 'application/json',
                'Accept': 'application/json;version=2.0'
            },
            body: JSON.stringify({
                "searchTerm": "manila",
                "productSorting": {
                "sort": "REVIEW_AVG_RATING",
                "order": "DESCENDING"
  },
                "searchTypes": [
                {
              "searchType": "PRODUCTS",
                "pagination": {
                "start": 1,
                "count": 9
            }
        }
  ],
  "currency": "USD"
})
        });

        if(!response.ok) {
            throw new Error('Could not fetch resource');
        }

        const data = await response.json();
        for(const pkg of data.products.results){
            console.log(pkg.title); //debug

            // Safely access the image URL
            let imageUrl = 'https://placehold.co/720x480?text=No+Image+:('; // Default placeholder
            if (pkg.images && pkg.images.length > 0 && pkg.images[0].variants && pkg.images[0].variants.length > 7) {
                imageUrl = pkg.images[0].variants[7].url;
            }
            let avgRatingCheck = pkg.reviews ? pkg.reviews.combinedAverageRating : 'N/A';
            if (avgRatingCheck != 'N/A'){
              avgRatingCheck = avgRatingCheck.toFixed(1);
            }

            let priceConvert = pkg.pricing.summary.fromPrice * 58.14;

            packages.push({
                
                title: pkg.title,
                price: priceConvert.toFixed(2),
                itineraryType: pkg.itineraryType,
                avgRating: avgRatingCheck,
                image: imageUrl,

                productCode: pkg.productCode,
                description: pkg.shortDescription,
                totalReviews: pkg.reviews.totalReviews,
                confirmationType: pkg.confirmationType,
            })
        }
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
    renderPackagesHome(packages);
}

function addressAutocomplete(containerElement, callback, options) {
  // create a wrapper for the input and button
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input-container"); // Use this class for styling
  containerElement.appendChild(inputContainer);
  // create input element
  var inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  containerElement.appendChild(inputElement);

  // add input field clear button
  var clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  inputContainer.appendChild(clearButton);

  /* Current autocomplete items data (GeoJSON.Feature) */
  var currentItems;

  /* Active request promise reject function. To be able to cancel the promise when a new request comes */
  var currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  var focusedItemIndex;

  /* Execute a function when someone writes in the text field: */
  inputElement.addEventListener("input", function(e) {
    var currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
      return false;
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

    /* Create a new promise and send geocoding request */
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=10&apiKey=${geoapifyApiKey}`;
      
      if (options.type) {
      	url += `&type=${options.type}`;
      }

      // Add the options object to the fetch call to include the API key
      fetch(url)
        .then(response => {
          // check if the call was successful
          if (response.ok) {
            response.json().then(data => resolve(data));
          } else {
            response.json().then(data => reject(data));
          }
        });
    });

    promise.then((data) => {
      currentItems = data.features;

      /*create a DIV element that will contain the items (values):*/
      var autocompleteItemsElement = document.createElement("div");
      autocompleteItemsElement.setAttribute("class", "autocomplete-items");
      containerElement.appendChild(autocompleteItemsElement);

      /* For each item in the results */
      data.features.forEach((feature, index) => {
        /* Create a DIV element for each element: */
        var itemElement = document.createElement("DIV");
        /* Set formatted address as item value */
        itemElement.innerHTML = feature.properties.formatted;

        /* Set the value for the autocomplete text field and notify: */
        itemElement.addEventListener("click", function(e) {
          inputElement.value = currentItems[index].properties.formatted;
          placeId = feature.properties.place_id
          console.log(placeId);
        
          callback(currentItems[index]);

          /* Close the list of autocompleted values: */
          closeDropDownList();
        });

        autocompleteItemsElement.appendChild(itemElement);
      });
    }, (err) => {
      if (!err.canceled) {
        console.log(err);
      }
    });
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function(e) {
    var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].location.formatted_address;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      containerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgElement.setAttribute('viewBox', "0 0 24 24");
    svgElement.setAttribute('height', "24");

    var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    iconElement.setAttribute('fill', 'currentColor');
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }
  
    /* Close the autocomplete dropdown when the document is clicked. 
  	Skip, when a user clicks on the input field */
  document.addEventListener("click", function(e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });

}

const autocompleteContainer = document.getElementById("autocomplete-container");
if (autocompleteContainer) {
  addressAutocomplete(autocompleteContainer, (data) => {
    console.log("Selected option: ");
    console.log(data);
  }, {
    placeholder: "Enter an address here",
  });
}

// Show Tabs
const tabs = document.getElementById('tabs');
const searchPanel = document.querySelector('.search-panel');

if (tabs) {
  tabs.querySelector('button')?.classList.add('active'); // Set initial active button

  // Show the home tab content by default
  document.querySelectorAll('[id$="-tab"]').forEach(p => {
    p.style.display = p.id === 'home-tab' ? 'block' : 'none';
  });

  // Hide search panel on home tab by default
  if (searchPanel) {
    searchPanel.style.display = 'none';
  }

  tabs.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    // Show the corresponding tab content
    let contentId = e.target.textContent.toLowerCase();
    const targetId = `${contentId}-tab`;

    // Show/hide search panel based on selected tab
    if (searchPanel) {
      searchPanel.style.display = contentId === 'home' ? 'none' : 'block';
    }

    document.querySelectorAll('[id$="-tab"]').forEach(p => {
      p.style.display = p.id === targetId ? 'block' : 'none';
    });
  });
}

function renderDestinations(list) {
    const container = document.getElementById('destination-search-results');
    container.innerHTML = '';
    container.className = 'cards';
    list.forEach((dest, idx) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image+:(';">
            <div class="body">
                <h3>${dest.name}</h3>
                <div class="meta">${dest.location}</div>
            </div>
        `;
        // add <h4>${dest.category}</h4> if regex is figured out
        // archived: <div class="cta"><button class="btn" onclick="viewInfo(${idx})">View Info</button></div>
        container.appendChild(card);
    });
}

// Search bar
async function searchDestination() {
    destinations.length = 0; // Clear previous results

    //integrate filters into the destination cards themselves

    currentFilters = ['entertainment', 'tourism', 'natural', 'national_park'];
    const currentFilterString = currentFilters.join(',');

    try {
        //const searchInput = document.getElementById('search-bar').value.toLowerCase();
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=${currentFilterString}&filter=place:${placeId}&limit=20&apiKey=${geoapifyApiKey}`);
        if(!response.ok) {
            throw new Error('Could not fetch resource');
        }
        
        const data = await response.json();

        for (const feature of data.features) {
          if (feature.properties.name == undefined){
            continue;
          }
        
            console.log(feature.properties.name); //debug
            var imgData = {};
            
            //obtain image from google custom search api
            try{
              const str = feature.properties.name;
              const query = str.replaceAll(' ', '+');
              const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${googleImagesApiKey_3}&cx=${googleImagesCXKey}&q=${query}+outdoor+view&searchType=image`);
              imgData = await response.json();
            }
            catch(e){
                console.log(e);
                imgData.items = [{link: 'https://placehold.co/600x400?text=No+Image+:('}]; //placeholder image
            }

            var imgIndex = 0;
            //forbids lookaside image links, they are broken
            for (let i = 0; i < imgData.items.length; i++) {
              if (['lookaside', 'tiktok', 'instagram', 'pinterest', 'fbcdn', 'twitter'].some(domain => imgData.items[imgIndex].link.includes(domain))){
                  imgIndex++;
              }
              else{
                break;
              }
            }

            destinations.push({
                name: feature.properties.name,
                location: feature.properties.formatted,
                category: feature.properties.categories,
                image: imgData.items[imgIndex].link //first image result
                //price: "$1200" - to be added with billing options
                //rating: 4.8 - integrate with yelp/google reviews api
                //info: "A tropical paradise with beautiful beaches, vibrant culture, and lush landscapes.",
                //image:
            })
        }
    } catch (error) {
        
    }
    
    //const filtered = destinations.filter(d => d.name.toLowerCase().includes(searchInput) || d.location.toLowerCase().includes(searchInput));
    renderDestinations(destinations);
}

function renderPackages(list) {
    const container = document.getElementById('tour-search-results');
    container.innerHTML = '';
    container.className = 'cards';
    list.forEach((pkg, idx) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `<img src="${pkg.image}" alt="${pkg.title}" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image+:('">
            <div class="body">
              <h3>${pkg.title}</h3>
              <div class="h3">Starting at ₱${pkg.price}</div>
              <div class="meta">Rating: ${pkg.avgRating}</div>
              <div class="meta">Type: ${pkg.itineraryType}</div>
              <div class="cta"><button class="btn" onclick="viewInfo('${pkg.productCode}', ${pkg.price})">View Info</button></div>
            </div>`;
        container.appendChild(card);
    });
}

async function searchPackages() {
    packages.length = 0; // Clear previous results
    const searchInput = document.querySelector('#autocomplete-container input').value.toLowerCase();
    console.log(`Searching for packages in: ${searchInput}`); //debug
    try {
        const response = await fetch(`https://api.sandbox.viator.com/partner/search/freetext`, {
            method: 'POST',
            headers: {
                'exp-api-key': 'a428b365-c65a-46ca-8899-31556d3f97f6',
                'Accept-Language': 'en-US',
                'Content-Type': 'application/json',
                'Accept': 'application/json;version=2.0'
            },
            body: JSON.stringify({
                "searchTerm": searchInput,
                "productSorting": {
                "sort": "REVIEW_AVG_RATING",
                "order": "DESCENDING"
  },
                "searchTypes": [
                {
              "searchType": "PRODUCTS",
                "pagination": {
                "start": 1,
                "count": 30
            }
        }
  ],
  "currency": "USD"
})
        });

        if(!response.ok) {
            throw new Error('Could not fetch resource');
        }

        const data = await response.json();
        for(const pkg of data.products.results){
            console.log(pkg.title); //debug

            // Safely access the image URL
            let imageUrl = 'https://placehold.co/720x480?text=No+Image+:('; // Default placeholder
            if (pkg.images && pkg.images.length > 0 && pkg.images[0].variants && pkg.images[0].variants.length > 7) {
                imageUrl = pkg.images[0].variants[7].url;
            }
            let avgRatingCheck = pkg.reviews ? pkg.reviews.combinedAverageRating : 'N/A';
            if (avgRatingCheck != 'N/A'){
              avgRatingCheck = avgRatingCheck.toFixed(1);
            }

            let priceConvert = pkg.pricing.summary.fromPrice * 58.14;

            packages.push({
                
                title: pkg.title,
                price: priceConvert.toFixed(2),
                itineraryType: pkg.itineraryType,
                avgRating: avgRatingCheck,
                image: imageUrl,

                productCode: pkg.productCode,
                description: pkg.shortDescription,
                totalReviews: pkg.reviews.totalReviews,
                confirmationType: pkg.confirmationType,
            })
        }
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
    renderPackages(packages);
}

//add renderHotels
function searchHotels() {
    console.log('Searching for hotels...');
    // Placeholder for hotel search functionality
    const container = document.getElementById('hotel-search-results');
    container.innerHTML = '<p>Hotel search is not yet implemented.</p>';
}
//add renderFlights
function searchFlights() {
    console.log('Searching for flights...');
    // Placeholder for flight search functionality
    const container = document.getElementById('flights-search-results');
    container.innerHTML = '<p>Flight search is not yet implemented.</p>';
}

function search(){
  const activeTab = document.querySelector('#tabs .active');
  if (!activeTab) return;

  const tabName = activeTab.textContent.toLowerCase();

  switch (tabName) {
    case 'destinations':
      searchDestination();
      break;
    case 'packages':
      searchPackages();
      break;
    case 'hotels':
      searchHotels();
      break;
    case 'flights':
      searchFlights();
      break;
    default:
      console.log('No search for this tab');
  }
}

function viewInfo(id, price){
  window.open(`destination.html?packageId=${id}&price=${price}`, '_blank');
}

function openTopDestination(query){
  // Put the query into the autocomplete input so searchPackages reads it
  const acInput = document.querySelector('#autocomplete-container input');
  if (acInput) {
    acInput.value = query;
  } else {
    // If the input doesn't exist yet, try to create a temporary one so searchPackages can read it
    const acContainer = document.getElementById('autocomplete-container');
    if (acContainer) {
      const tmp = document.createElement('input');
      tmp.type = 'text';
      tmp.style.display = 'none';
      tmp.value = query;
      acContainer.appendChild(tmp);
    }
  }

  // Activate the Packages tab by reusing the existing tabs click handler
  const tabsEl = document.getElementById('tabs');
  if (tabsEl) {
    const buttons = tabsEl.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (b.textContent && b.textContent.trim().toLowerCase() === 'packages') {
        // trigger the same behavior as a user click
        b.click();
        break;
      }
    }
  }

  // Run the packages search using the query we set above
  try {
    searchPackages();
  } catch (err) {
    console.error('openTopDestination: failed to run searchPackages', err);
  }
}


