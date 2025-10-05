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

document.getElementById('tourShowMoreBtn').addEventListener('click', function() {
    const reviewsList = document.getElementById('tourReviewsList');
    const additionalReviews = [
        {
            stars: '★★★★★',
            text: 'Amazing tour!',
            author: 'Maria L. - Oct 2025',
            comment: 'The tour was fantastic, the guide was excellent and the sites were breathtaking.'
        },
        {
            stars: '★★★☆☆',
            text: 'Good but could improve...',
            author: 'John D. - Oct 2025',
            comment: 'The experience was good, but the timing could be better organized.'
        },
        {
            stars: '★★★★☆',
            text: 'Enjoyable day out!',
            author: 'Lisa K. - Oct 2025',
            comment: 'Had a wonderful time, the weather was perfect and the guide was very helpful.'
        },
        {
            stars: '★★★★★',
            text: 'Highly recommend!',
            author: 'Peter R. - Oct 2025',
            comment: 'Best tour I’ve been on, the history was fascinating and the guide was top-notch.'
        },
        {
            stars: '★★☆☆☆',
            text: 'Average experience...',
            author: 'Emma S. - Oct 2025',
            comment: 'It was okay, but the pace was a bit rushed for my liking.'
        }
    ];

    additionalReviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'tour-review';
        reviewDiv.innerHTML = `
            <span class="tour-stars">${review.stars}</span>
            <p class="tour-review-text">${review.text}</p>
            <p class="tour-author">${review.author}</p>
            <p class="tour-comment">${review.comment}</p>
        `;
        reviewsList.appendChild(reviewDiv);
    });

    this.style.display = 'none'; // Hide button after showing more reviews
});