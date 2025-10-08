let isInWishlist = false;
let currentIndex = 0;
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImg = document.getElementById('mainImg');

document.querySelector('.share-btn').addEventListener('click', function() {
  const options = document.getElementById('shareOptions');
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.share-options span').forEach(option => {
  option.addEventListener('click', function() {
    alert(`Selected: ${this.textContent}`);
    document.getElementById('shareOptions').style.display = 'none';
  });
});

document.querySelector('.wishlist-btn').addEventListener('click', function() {
  const message = document.getElementById('wishlistMessage');
  if (isInWishlist) {
    message.textContent = 'Removed from your Wishlist';
    isInWishlist = false;
  } else {
    message.textContent = 'Saved to My Wishlist';
    isInWishlist = true;
  }
  message.style.display = 'block';
  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
});

function changeMainImage(thumbnail) {
  mainImg.src = thumbnail.src;
  currentIndex = Array.from(thumbnails).indexOf(thumbnail);
}

document.querySelector('.prev-btn').addEventListener('click', function() {
  currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  mainImg.src = thumbnails[currentIndex].src;
});

document.querySelector('.next-btn').addEventListener('click', function() {
  currentIndex = (currentIndex + 1) % thumbnails.length;
  mainImg.src = thumbnails[currentIndex].src;
});

document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('datePicker');
  const calendarContainer = document.getElementById('calendarContainer');
  const timePicker = document.getElementById('timePicker');
  const timePickerContainer = document.getElementById('timePickerContainer');
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const ampmSelect = document.getElementById('ampmSelect');
  const confirmTime = document.getElementById('confirmTime');

  // Calendar functionality
  let currentDate = new Date();
  let selectedDate = null;

  function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let html = `<table>
      <tr><th colspan="7">${monthNames[month]} ${year}</th></tr>
      <tr><td class="prev-month">◄</td><td colspan="5"></td><td class="next-month">►</td></tr>
      <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`;

    let day = 1;
    for (let i = 0; i < 6; i++) {
      html += '<tr>';
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          html += '<td></td>';
        } else if (day <= monthLength) {
          html += `<td class="day" data-day="${day}">${day}</td>`;
          day++;
        } else {
          html += '<td></td>';
        }
      }
      html += '</tr>';
      if (day > monthLength) break;
    }
    html += '</table>';
    calendarContainer.innerHTML = html;

    // Event listeners for calendar days
    document.querySelectorAll('.day').forEach(day => {
      day.addEventListener('click', () => {
        selectedDate = new Date(year, month, parseInt(day.dataset.day));
        datePicker.value = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        calendarContainer.classList.remove('active');
      });
    });

    // Navigation buttons
    document.querySelector('.prev-month').addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    document.querySelector('.next-month').addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
  }

  datePicker.addEventListener('click', () => {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    calendarContainer.classList.toggle('active');
  });

  // Close calendar when clicking outside
  document.addEventListener('click', (e) => {
    if (!calendarContainer.contains(e.target) && e.target !== datePicker) {
      calendarContainer.classList.remove('active');
    }
  });

  // Time picker functionality
  timePicker.addEventListener('click', () => {
    timePickerContainer.classList.toggle('active');
  });

  confirmTime.addEventListener('click', () => {
    const hour = hourInput.value.padStart(2, '0');
    const minute = minuteInput.value.padStart(2, '0');
    const ampm = ampmSelect.value;
    if (hour && minute) {
      timePicker.value = `${hour}:${minute} ${ampm}`;
      timePickerContainer.classList.remove('active');
    }
  });

  // Close time picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!timePickerContainer.contains(e.target) && e.target !== timePicker) {
      timePickerContainer.classList.remove('active');
    }
  });

  // Input validation for time
  hourInput.addEventListener('input', () => {
    if (hourInput.value > 12) hourInput.value = 12;
    if (hourInput.value < 1) hourInput.value = 1;
  });

  minuteInput.addEventListener('input', () => {
    if (minuteInput.value > 59) minuteInput.value = 59;
    if (minuteInput.value < 0) minuteInput.value = 0;
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const reviews = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    function showReview(index) {
        reviews.forEach((review, i) => {
            review.classList.toggle('hidden', i !== index);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviews.length - 1;
        showReview(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < reviews.length - 1) ? currentIndex + 1 : 0;
        showReview(currentIndex);
    });

    // Show the first review by default
    showReview(currentIndex);
});

document.getElementById('showMoreBtn').addEventListener('click', function() {
    document.getElementById('moreInfo').style.display = 'block';
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('moreInfo').style.display = 'none';
});

document.getElementById('showMoreBtnv').addEventListener('click', function() {
    document.getElementById('morePhotos').style.display = 'block';
});

document.getElementById('closeModalv').addEventListener('click', function() {
    document.getElementById('morePhotos').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('reviewSortSelect');
    const reviewsList = document.getElementById('tourReviewsList');
    const searchInput = document.getElementById('reviewSearchInput');
    const showMoreBtn = document.getElementById('tourShowMoreBtn');
    const showLessBtn = document.getElementById('tourShowLessBtn');
    let displayedReviews = Array.from(reviewsList.querySelectorAll('.tour-review'));
    const initialReviews = displayedReviews.slice(); // Store initial reviews
    const additionalReviews = [
        {
            stars: '★★★★★',
            text: 'Amazing tour!',
            author: 'Maria L. - Oct 2025',
            comment: 'The tour was fantastic, the guide was excellent and the sites were breathtaking.',
            date: '2025-10-01',
            rating: 5
        },
        {
            stars: '★★★☆☆',
            text: 'Good but could improve...',
            author: 'John D. - Oct 2025',
            comment: 'The experience was good, but the timing could be better organized.',
            date: '2025-10-02',
            rating: 3
        },
        {
            stars: '★★★★☆',
            text: 'Enjoyable day out!',
            author: 'Lisa K. - Oct 2025',
            comment: 'Had a wonderful time, the weather was perfect and the guide was very helpful.',
            date: '2025-10-03',
            rating: 4
        },
        {
            stars: '★★★★★',
            text: 'Highly recommend!',
            author: 'Peter R. - Oct 2025',
            comment: 'Best tour I’ve been on, the history was fascinating and the guide was top-notch.',
            date: '2025-10-04',
            rating: 5
        },
        {
            stars: '★★☆☆☆',
            text: 'Average experience...',
            author: 'Emma S. - Oct 2025',
            comment: 'It was okay, but the pace was a bit rushed for my liking.',
            date: '2025-10-05',
            rating: 2
        }
    ];
    let currentIndex = 0;

    // Function to get rating from stars (bilang ng ★)
    function getRatingFromStars(starsElement) {
        return starsElement.textContent.split('★').filter(s => s.length > 0).length;
    }

    // Function to parse date from author text (e.g., "Sep 2025" -> Date object)
    function getDateFromAuthor(authorElement) {
        const dateStr = authorElement.textContent.match(/([A-Za-z]{3})\s(\d{4})/);
        if (dateStr) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = monthNames.indexOf(dateStr[1]);
            if (monthIndex !== -1) {
                return new Date(parseInt(dateStr[2]), monthIndex, 1);
            }
        }
        return new Date(0);
    }

    // Function to filter reviews by search text
    function filterReviews(searchTerm) {
        const reviews = Array.from(reviewsList.querySelectorAll('.tour-review'));
        if (searchTerm.trim() === '') {
            // Show all displayed reviews when search is cleared
            reviews.forEach(review => {
                if (displayedReviews.includes(review)) {
                    review.style.display = 'block';
                } else {
                    review.style.display = 'none';
                }
            });
        } else {
            // Filter based on search term
            reviews.forEach(review => {
                const text = review.textContent.toLowerCase();
                const matches = text.includes(searchTerm.toLowerCase());
                review.style.display = matches && displayedReviews.includes(review) ? 'block' : 'none';
            });
        }
    }

    // Main sorting function
    function sortReviews(sortBy) {
        const reviews = Array.from(reviewsList.querySelectorAll('.tour-review'));
        const visibleReviews = reviews.filter(review => displayedReviews.includes(review));

        visibleReviews.sort((a, b) => {
            let aValue, bValue;
            if (sortBy === 'recent' || sortBy === 'oldest') {
                const aDate = getDateFromAuthor(a.querySelector('.tour-author')) || new Date(0);
                const bDate = getDateFromAuthor(b.querySelector('.tour-author')) || new Date(0);
                return sortBy === 'recent' ? bDate - aDate : aDate - bDate;
            } else if (sortBy === 'highest' || sortBy === 'lowest') {
                const aStars = a.getAttribute('data-rating') || getRatingFromStars(a.querySelector('.tour-stars'));
                const bStars = b.getAttribute('data-rating') || getRatingFromStars(b.querySelector('.tour-stars'));
                aValue = parseInt(aStars);
                bValue = parseInt(bStars);
                return sortBy === 'highest' ? bValue - aValue : aValue - bValue;
            }
            return 0;
        });

        reviewsList.innerHTML = '';
        visibleReviews.forEach(review => {
            reviewsList.appendChild(review);
        });

        if (searchInput.value) {
            filterReviews(searchInput.value);
        }
    }

    // Function to add reviews (3 at a time)
    function addReviews() {
        const reviewsToAdd = additionalReviews.slice(currentIndex, currentIndex + 3);
        reviewsToAdd.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'tour-review';
            reviewDiv.setAttribute('data-date', review.date);
            reviewDiv.setAttribute('data-rating', review.rating);
            reviewDiv.innerHTML = `
                <span class="tour-stars">${review.stars}</span>
                <p class="tour-review-text">${review.text}</p>
                <p class="tour-author">${review.author}</p>
                <p class="tour-comment">${review.comment}</p>
            `;
            reviewsList.appendChild(reviewDiv);
            displayedReviews.push(reviewDiv);
        });
        currentIndex += reviewsToAdd.length;

        // Update button visibility
        showMoreBtn.style.display = currentIndex < additionalReviews.length ? 'block' : 'none';
        showLessBtn.style.display = displayedReviews.length > initialReviews.length ? 'block' : 'none';

        // Re-sort after adding reviews
        const currentSort = sortSelect.value;
        if (currentSort) {
            sortReviews(currentSort);
        }
    }

    // Function to remove reviews (3 at a time)
    function removeReviews() {
        const reviewsToRemove = displayedReviews.slice(-3).filter(review => !initialReviews.includes(review));
        reviewsToRemove.forEach(review => {
            review.remove();
            displayedReviews = displayedReviews.filter(r => r !== review);
        });

        // Adjust currentIndex
        currentIndex = Math.max(0, currentIndex - reviewsToRemove.length);

        // Update button visibility
        showMoreBtn.style.display = currentIndex < additionalReviews.length ? 'block' : 'none';
        showLessBtn.style.display = displayedReviews.length > initialReviews.length ? 'block' : 'none';

        // Re-sort after removing reviews
        const currentSort = sortSelect.value;
        if (currentSort) {
            sortReviews(currentSort);
        }
    }

    // Show More button event listener
    showMoreBtn.addEventListener('click', addReviews);

    // Show Less button event listener
    showLessBtn.addEventListener('click', removeReviews);

    // Sort select event listener
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        sortReviews(sortValue);
    });

    // Search input event listener
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value;
        filterReviews(searchTerm);
        const currentSort = sortSelect.value;
        if (currentSort) {
            setTimeout(() => sortReviews(currentSort), 100);
        }
    });

    // Initial sort (default to most recent)
    sortReviews('recent');

    // Initial button visibility
    showMoreBtn.style.display = additionalReviews.length > 0 ? 'block' : 'none';
    showLessBtn.style.display = displayedReviews.length > initialReviews.length ? 'block' : 'none';
});