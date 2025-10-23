let isInWishlist = false;
let currentIndex = 0;
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImg = document.getElementById('mainImg');

// Description toggle functionality
function toggleDescription(button) {
    const fullDesc = button.nextElementSibling;
    const isHidden = fullDesc.classList.contains('hidden');

    if (isHidden) {
        fullDesc.classList.remove('hidden');
        fullDesc.style.maxHeight = fullDesc.scrollHeight + 'px';
        button.textContent = 'Read Less';
        button.style.background = '#0aa0a0ff';
    } else {
        fullDesc.style.maxHeight = '0';
        setTimeout(() => {
            fullDesc.classList.add('hidden');
        }, 300);
        button.textContent = 'Read More';
        button.style.background = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Share button functionality
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const options = document.getElementById('shareOptions');
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        });
    }

    document.querySelectorAll('.share-options span').forEach(option => {
        option.addEventListener('click', function() {
            alert(`Selected: ${this.textContent}`);
            document.getElementById('shareOptions').style.display = 'none';
        });
    });

    // Wishlist button functionality
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
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
    }

    // Image gallery functionality
    function changeMainImage(thumbnail) {
        mainImg.src = thumbnail.src;
        currentIndex = Array.from(thumbnails).indexOf(thumbnail);
    }

    const prevBtn = document.querySelector('.prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
            mainImg.src = thumbnails[currentIndex].src;
        });
    }

    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % thumbnails.length;
            mainImg.src = thumbnails[currentIndex].src;
        });
    }

    // Calendar and time picker functionality
    const datePicker = document.getElementById('datePicker');
    const calendarContainer = document.getElementById('calendarContainer');
    const timePicker = document.getElementById('timePicker');
    const timePickerContainer = document.getElementById('timePickerContainer');
    const hourInput = document.getElementById('hourInput');
    const minuteInput = document.getElementById('minuteInput');
    const ampmSelect = document.getElementById('ampmSelect');
    const confirmTime = document.getElementById('confirmTime');

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

        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', () => {
                selectedDate = new Date(year, month, parseInt(day.dataset.day));
                datePicker.value = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                calendarContainer.classList.remove('active');
            });
        });

        document.querySelector('.prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });
        document.querySelector('.next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });
    }

    if (datePicker && calendarContainer) {
        datePicker.addEventListener('click', () => {
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
            calendarContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!calendarContainer.contains(e.target) && e.target !== datePicker) {
                calendarContainer.classList.remove('active');
            }
        });
    }

    if (timePicker && timePickerContainer) {
        timePicker.addEventListener('click', () => {
            timePickerContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!timePickerContainer.contains(e.target) && e.target !== timePicker) {
                timePickerContainer.classList.remove('active');
            }
        });
    }

    if (confirmTime) {
        confirmTime.addEventListener('click', () => {
            const hour = hourInput.value.padStart(2, '0');
            const minute = minuteInput.value.padStart(2, '0');
            const ampm = ampmSelect.value;
            if (hour && minute) {
                timePicker.value = `${hour}:${minute} ${ampm}`;
                timePickerContainer.classList.remove('active');
            }
        });
    }

    if (hourInput) {
        hourInput.addEventListener('input', () => {
            if (hourInput.value > 12) hourInput.value = 12;
            if (hourInput.value < 1) hourInput.value = 1;
        });
    }

    if (minuteInput) {
        minuteInput.addEventListener('input', () => {
            if (minuteInput.value > 59) minuteInput.value = 59;
            if (minuteInput.value < 0) minuteInput.value = 0;
        });
    }

    // Photos functionality
    const photoGrid = document.getElementById('photoGrid');
    const showMorePhotosBtn = document.getElementById('showMorePhotosBtn');
    const showLessPhotosBtn = document.getElementById('showLessPhotosBtn');
    let displayedPhotosCount = 3;

    if (photoGrid) {
        const photos = photoGrid.querySelectorAll('img');
        photos.forEach((photo, index) => {
            photo.style.display = index < displayedPhotosCount ? 'block' : 'none';
        });

        if (showMorePhotosBtn) {
            showMorePhotosBtn.addEventListener('click', () => {
                const nextPhotos = Array.from(photos).slice(displayedPhotosCount, displayedPhotosCount + 3);
                nextPhotos.forEach(photo => {
                    photo.style.display = 'block';
                });
                displayedPhotosCount += nextPhotos.length;
                showMorePhotosBtn.style.display = displayedPhotosCount < photos.length ? 'block' : 'none';
                showLessPhotosBtn.style.display = displayedPhotosCount > 3 ? 'block' : 'none';
            });
        }

        if (showLessPhotosBtn) {
            showLessPhotosBtn.addEventListener('click', () => {
                const photosToHide = Array.from(photos).slice(displayedPhotosCount - 3, displayedPhotosCount);
                photosToHide.forEach(photo => {
                    photo.style.display = 'none';
                });
                displayedPhotosCount -= photosToHide.length;
                showMorePhotosBtn.style.display = displayedPhotosCount < photos.length ? 'block' : 'none';
                showLessPhotosBtn.style.display = displayedPhotosCount > 3 ? 'block' : 'none';
            });
        }
    }

    // Review carousel functionality
    const reviews = document.querySelectorAll('.review-card');
    const prevReviewBtn = document.querySelector('.prev');
    const nextReviewBtn = document.querySelector('.next');
    let reviewIndex = 0;

    function showReview(index) {
        reviews.forEach((review, i) => {
            review.classList.toggle('hidden', i !== index);
        });
    }

    if (prevReviewBtn) {
        prevReviewBtn.addEventListener('click', () => {
            reviewIndex = (reviewIndex > 0) ? reviewIndex - 1 : reviews.length - 1;
            showReview(reviewIndex);
        });
    }

    if (nextReviewBtn) {
        nextReviewBtn.addEventListener('click', () => {
            reviewIndex = (reviewIndex < reviews.length - 1) ? reviewIndex + 1 : 0;
            showReview(reviewIndex);
        });
    }

    if (reviews.length > 0) {
        showReview(reviewIndex);
    }

    // Review sorting and filtering functionality
    const sortSelect = document.getElementById('reviewSortSelect');
    const reviewsList = document.getElementById('tourReviewsList');
    const searchInput = document.getElementById('reviewSearchInput');
    const showMoreBtn = document.getElementById('tourShowMoreBtn');
    const showLessBtn = document.getElementById('tourShowLessBtn');
    let displayedReviews = Array.from(reviewsList ? reviewsList.querySelectorAll('.tour-review') : []);
    const initialReviews = displayedReviews.slice();
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
    let currentReviewIndex = 0;

    function getRatingFromStars(starsElement) {
        return starsElement.textContent.split('★').filter(s => s.length > 0).length;
    }

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

    function filterReviews(searchTerm) {
        const reviews = Array.from(reviewsList.querySelectorAll('.tour-review'));
        if (searchTerm.trim() === '') {
            reviews.forEach(review => {
                if (displayedReviews.includes(review)) {
                    review.style.display = 'block';
                } else {
                    review.style.display = 'none';
                }
            });
        } else {
            reviews.forEach(review => {
                const text = review.textContent.toLowerCase();
                const matches = text.includes(searchTerm.toLowerCase());
                review.style.display = matches && displayedReviews.includes(review) ? 'block' : 'none';
            });
        }
    }

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
                const bStars = b.getAttribute('data-rating') || getRatingFromStars(a.querySelector('.tour-stars'));
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

    function addReviews() {
        const reviewsToAdd = additionalReviews.slice(currentReviewIndex, currentReviewIndex + 3);
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
        currentReviewIndex += reviewsToAdd.length;

        showMoreBtn.style.display = currentReviewIndex < additionalReviews.length ? 'block' : 'none';
        showLessBtn.style.display = displayedReviews.length > initialReviews.length ? 'block' : 'none';

        const currentSort = sortSelect.value;
        if (currentSort) {
            sortReviews(currentSort);
        }
    }

    function removeReviews() {
        const reviewsToRemove = displayedReviews.slice(-3).filter(review => !initialReviews.includes(review));
        reviewsToRemove.forEach(review => {
            review.remove();
            displayedReviews = displayedReviews.filter(r => r !== review);
        });

        currentReviewIndex = Math.max(0, currentReviewIndex - reviewsToRemove.length);

        showMoreBtn.style.display = currentReviewIndex < additionalReviews.length ? 'block' : 'none';
        showLessBtn.style.display = displayedReviews.length > initialReviews.length ? 'block' : 'none';

        const currentSort = sortSelect.value;
        if (currentSort) {
            sortReviews(currentSort);
        }
    }

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', addReviews);
    }

    if (showLessBtn) {
        showLessBtn.addEventListener('click', removeReviews);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            sortReviews(sortValue);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value;
            filterReviews(searchTerm);
            const currentSort = sortSelect.value;
            if (currentSort) {
                setTimeout(() => sortReviews(currentSort), 100);
            }
        });
    }

    if (reviewsList) {
        sortReviews('recent');
        showMoreBtn.style.display = additionalReviews.length > 0 ? 'block' : 'none';
        showLessBtn.style.display = displayedReviews.length > initialReviews.length ? 'block' : 'none';
    }

    // Additional info toggle functionality
    const showMoreInfoBtn = document.getElementById('showMoreBtn');
    const moreInfo = document.getElementById('moreInfo');

    if (showMoreInfoBtn && moreInfo) {
        showMoreInfoBtn.addEventListener('click', () => {
            moreInfo.classList.toggle('tour-hidden');
            moreInfo.classList.toggle('tour-show');
            showMoreInfoBtn.textContent = moreInfo.classList.contains('tour-show') ? 'Show Less' : 'Show More Info';
        });
    }

    // Add-ons functionality
    const addOnsCheckboxes = document.querySelectorAll('.add-on-checkbox');
    const timelineList = document.querySelector('.timeline-list');
    const addOnsTotalElement = document.getElementById('addOnsTotal');
    let totalAddOnsCost = 0;
    let addOnCount = document.querySelectorAll('.timeline-item').length;

    function updateAddOnsTotal() {
        totalAddOnsCost = Array.from(addOnsCheckboxes).reduce((total, checkbox) => {
            if (checkbox.checked) {
                return total + parseFloat(checkbox.dataset.price);
            }
            return total;
        }, 0);
        addOnsTotalElement.textContent = totalAddOnsCost.toFixed(2);
    }

    function updateTimelineIcons() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const icon = item.querySelector('.timeline-icon');
            icon.textContent = index + 1;
        });
    }

    addOnsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            const addOnId = checkbox.dataset.id;
            const existingItem = document.querySelector(`.timeline-item[data-add-on-id="${addOnId}"]`);

            if (isChecked && !existingItem) {
                addOnCount++;
                const timelineItem = document.createElement('li');
                timelineItem.className = 'timeline-item add-on';
                timelineItem.setAttribute('data-add-on-id', addOnId);
                timelineItem.innerHTML = `
                    <div class="timeline-icon">${addOnCount}</div>
                    <div class="timeline-content">
                        <div class="timeline-image-container">
                            <img src="${checkbox.dataset.image}" alt="${checkbox.dataset.title}" />
                        </div>
                        <div class="timeline-info">
                            <h3 class="timeline-stop"><strong>${checkbox.dataset.title}</strong></h3>
                            <p class="timeline-summary">${checkbox.dataset.summary}</p>
                            <button class="read-more-btn" onclick="toggleDescription(this)">Read More</button>
                            <div class="timeline-full-desc hidden">
                                <p>${checkbox.dataset.fullDesc}</p>
                            </div>
                            <div class="timeline-duration">${checkbox.dataset.duration} • ₱${checkbox.dataset.price}</div>
                        </div>
                    </div>
                `;
                timelineList.appendChild(timelineItem);
            } else if (!isChecked && existingItem) {
                existingItem.remove();
                addOnCount--;
                updateTimelineIcons();
            }

            updateAddOnsTotal();
        });
    });

    // Initial total cost calculation
    updateAddOnsTotal();
});

// Ensure thumbnail click handlers are set outside DOMContentLoaded to avoid conflicts
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        mainImg.src = thumbnail.src;
        currentIndex = Array.from(thumbnails).indexOf(thumbnail);
    });
});