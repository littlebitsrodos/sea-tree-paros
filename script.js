// =====================================================
// ROMANTICA BLUE — Main JavaScript
// Language switcher, calendar, gallery lightbox, forms
// =====================================================

// ----- State Management -----
// Locale is driven by the URL: /, /en/, /es/, /el/, /fr/. The <html lang="..">
// attribute is set per locale at build time, so we read from there on init.
let currentLang = (document.documentElement.lang || 'en').toLowerCase();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let bookedDates = []; // Will be populated from iCal

// Date selection state
let selectedCheckIn = null;
let selectedCheckOut = null;

// ----- Pricing Configuration -----
const PRICING = {
    seasons: {
        low: { months: [11, 12, 1, 2, 3], weekly: 400, nightly: 400 },
        mid: { months: [4, 5, 6, 9, 10], weekly: 600, nightly: 600 },
        peak: { months: [7, 8], weekly: 800, nightly: 800 }
    },
    currency: '€'
};

// ----- Stripe Payment Links -----
// Replace these placeholder URLs with your actual Stripe Payment Links
// Create products in Stripe Dashboard, then create Payment Links with quantity enabled
const STRIPE_LINKS = {
    low: '#',   // Replace with: https://buy.stripe.com/YOUR_LOW_SEASON_LINK
    mid: '#',   // Replace with: https://buy.stripe.com/YOUR_MID_SEASON_LINK
    peak: '#'   // Replace with: https://buy.stripe.com/YOUR_PEAK_SEASON_LINK
};

// Get payment link for the check-in date's season
function getPaymentLink(checkInDate, nights) {
    const season = getSeasonForDate(checkInDate);
    const baseUrl = STRIPE_LINKS[season];

    // If no link configured yet, return placeholder
    if (baseUrl === '#') return '#';

    // Add quantity parameter for number of nights
    return `${baseUrl}?quantity=${nights}`;
}

// ----- External Calendar Config -----
const ICAL_URLS = [
    'https://www.airbnb.co.uk/calendar/ical/1659626910469787873.ics?t=27432fdc07c54e9bb8e3ea8622b9fac0',
    'https://ical.booking.com/v1/export?t=5cafb294-ac4f-4cff-be12-ab4f933ad203'
];

// CORS Proxy (Use a public one for demo, or own Worker for production)
const CORS_PROXY = 'https://corsproxy.io/?';

function getSeasonForDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.getMonth() + 1;
    for (const [season, config] of Object.entries(PRICING.seasons)) {
        if (config.months.includes(month)) return season;
    }
    return 'mid';
}

function getNightlyRate(dateStr) {
    return PRICING.seasons[getSeasonForDate(dateStr)].nightly;
}

function calculateTotalPrice(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    let total = 0;
    let current = new Date(checkIn + 'T00:00:00');
    const end = new Date(checkOut + 'T00:00:00');
    while (current < end) {
        total += getNightlyRate(formatDate(current));
        current.setDate(current.getDate() + 1);
    }
    return total;
}

// ----- Initialize on DOM Load -----
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initNavigation();
    initGallery();
    initCalendar();
    initContactForm();
    initScrollAnimations();
    initMobileBookBar();

    // Re-apply current locale (matches <html lang>). No-op on translated
    // static HTML, but ensures dynamic DOM (calendar month names, form
    // feedback, etc.) stays in the correct language.
    setLanguage(currentLang);
});

// ----- Language Switcher -----
// URL-based: each locale lives at its own path (/, /es/, /el/, /fr/).
// Click navigates; the destination already has the correct lang in markup.
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        const lang = btn.dataset.lang;
        const path = lang === 'en' ? '/' : `/${lang}/`;
        btn.setAttribute('data-href', path);
        if (lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        btn.addEventListener('click', () => {
            // Preserve the current section anchor when navigating between locales
            window.location.href = path + (window.location.hash || '');
        });
    });
}

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const keys = el.dataset.translate.split('.');
        let value = t;
        for (const key of keys) {
            value = value?.[key];
        }
        if (value) {
            el.textContent = value;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const keys = el.dataset.translatePlaceholder.split('.');
        let value = t;
        for (const key of keys) {
            value = value?.[key];
        }
        if (value) {
            el.placeholder = value;
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'el' ? 'el' : lang;

    // Refresh calendar with new language
    renderCalendar();
}

// ----- Navigation -----
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks?.classList.remove('active');
            }
        });
    });
}

// ----- Gallery Lightbox & Carousel -----
let galleryRotationInterval = null;
let currentGalleryIndex = 0;
let currentLightboxIndex = 0;
let galleryImages = [];
let touchStartX = 0;
let touchEndX = 0;

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
    const lightboxNext = lightbox?.querySelector('.lightbox-next');
    const galleryGrid = document.querySelector('.gallery-grid');

    // Collect all gallery images
    galleryImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img')?.src,
        alt: item.querySelector('img')?.alt
    }));

    // Initialize mobile carousel
    initMobileCarousel();

    // Start auto-rotation on desktop
    startGalleryRotation();

    // Pause rotation on hover (desktop)
    if (galleryGrid) {
        galleryGrid.addEventListener('mouseenter', () => stopGalleryRotation());
        galleryGrid.addEventListener('mouseleave', () => startGalleryRotation());
    }

    // Desktop grid click handlers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Touch gestures for lightbox
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleLightboxSwipe();
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.querySelector('.lightbox');
        if (!lightbox?.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Click on lightbox image to navigate (left half = prev, right half = next)
    if (lightboxImg) {
        lightboxImg.style.cursor = 'pointer';
        lightboxImg.addEventListener('click', (e) => {
            const rect = lightboxImg.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const imageWidth = rect.width;

            // Click on left third = previous, right two-thirds = next
            if (clickX < imageWidth / 3) {
                navigateLightbox(-1);
            } else {
                navigateLightbox(1);
            }
        });
    }
}

function initMobileCarousel() {
    const carousel = document.querySelector('.gallery-carousel');
    const track = carousel?.querySelector('.carousel-track');
    const slides = carousel?.querySelectorAll('.carousel-slide');
    const prevBtn = carousel?.querySelector('.carousel-prev');
    const nextBtn = carousel?.querySelector('.carousel-next');
    const dotsContainer = carousel?.querySelector('.carousel-dots');

    if (!carousel || !slides?.length) return;

    let carouselIndex = 0;
    let autoSlideInterval = null;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer?.appendChild(dot);
    });

    function goToSlide(index) {
        carouselIndex = index;
        if (carouselIndex < 0) carouselIndex = slides.length - 1;
        if (carouselIndex >= slides.length) carouselIndex = 0;

        track.style.transform = `translateX(-${carouselIndex * 100}%)`;

        // Update dots
        dotsContainer?.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === carouselIndex);
        });
    }

    function nextSlide() {
        goToSlide(carouselIndex + 1);
    }

    function prevSlide() {
        goToSlide(carouselIndex - 1);
    }

    // Button handlers
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    // Touch/swipe support
    let carouselTouchStartX = 0;

    track?.addEventListener('touchstart', (e) => {
        carouselTouchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    track?.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = carouselTouchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoSlide();
    }, { passive: true });

    // Auto-slide
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    // Click to open lightbox from carousel
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => openLightbox(index));
    });

    startAutoSlide();
}

function openLightbox(index) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const counterCurrent = lightbox?.querySelector('.lightbox-counter .current');
    const counterTotal = lightbox?.querySelector('.lightbox-counter .total');

    if (!lightbox || !lightboxImg || !galleryImages[index]) return;

    currentLightboxIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;

    if (counterCurrent) counterCurrent.textContent = index + 1;
    if (counterTotal) counterTotal.textContent = galleryImages.length;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopGalleryRotation();
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
    if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const counterCurrent = lightbox?.querySelector('.lightbox-counter .current');

    if (lightboxImg && galleryImages[currentLightboxIndex]) {
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
        lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
    }
    if (counterCurrent) counterCurrent.textContent = currentLightboxIndex + 1;
}

function handleLightboxSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) navigateLightbox(1);
        else navigateLightbox(-1);
    }
}

function startGalleryRotation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    stopGalleryRotation();

    galleryRotationInterval = setInterval(() => {
        galleryItems.forEach(item => item.classList.remove('gallery-highlight'));
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        galleryItems[currentGalleryIndex].classList.add('gallery-highlight');
    }, 5000);
}

function stopGalleryRotation() {
    if (galleryRotationInterval) {
        clearInterval(galleryRotationInterval);
        galleryRotationInterval = null;
    }
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.remove('gallery-highlight');
    });
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        startGalleryRotation();
    }
}

// ----- Calendar -----
function initCalendar() {
    // Load booked dates (can be replaced with iCal fetch)
    loadBookedDates();

    // Navigation buttons
    const prevBtn = document.querySelector('.calendar-prev');
    const nextBtn = document.querySelector('.calendar-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    renderCalendar();
}

async function loadBookedDates() {
    // Check session storage cache first (valid for 1 hour)
    const cached = sessionStorage.getItem('bookedDates');
    const cachedTime = sessionStorage.getItem('bookedDatesTime');

    if (cached && cachedTime && (Date.now() - cachedTime < 3600000)) {
        bookedDates = JSON.parse(cached);
        renderCalendar();
        return;
    }

    // Fetch from all sources
    const allDates = await Promise.all(ICAL_URLS.map(fetchICalData));

    // Merge and deduplicate
    const mergedDates = new Set(allDates.flat());
    bookedDates = Array.from(mergedDates);

    // Cache result
    sessionStorage.setItem('bookedDates', JSON.stringify(bookedDates));
    sessionStorage.setItem('bookedDatesTime', Date.now());

    renderCalendar();
}

// Fetch and parse iCal data (for future integration)
async function fetchICalData(url) {
    if (url.includes('YOUR_')) return []; // Skip placeholders

    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(url));
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        return parseICalData(data);
    } catch (error) {
        console.error('Error fetching iCal data:', error);
        return [];
    }
}

function parseICalData(icalData) {
    try {
        const jcalData = ICAL.parse(icalData);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllSubcomponents('vevent');
        const dates = [];

        events.forEach(event => {
            const dtstart = event.getFirstPropertyValue('dtstart');
            const dtend = event.getFirstPropertyValue('dtend');

            if (dtstart && dtend) {
                let current = dtstart.toJSDate();
                const end = dtend.toJSDate();

                // Adjust for timezones if needed, but ical.js acts in UTC usually
                // Iterate days
                while (current < end) {
                    dates.push(formatDate(current));
                    current.setDate(current.getDate() + 1);
                }
            }
        });

        return dates;
    } catch (e) {
        console.error('Error parsing iCal:', e);
        return [];
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function renderCalendar() {
    const calendarEl = document.querySelector('.calendar');
    const monthDisplay = document.querySelector('.calendar-month');

    if (!calendarEl) return;

    const t = translations[currentLang].calendar;

    // Update month display
    if (monthDisplay) {
        monthDisplay.textContent = `${t.months[currentMonth]} ${currentYear}`;
    }

    // Clear existing days
    calendarEl.innerHTML = '';

    // Add day headers
    t.days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendarEl.appendChild(header);
    });

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Add empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        calendarEl.appendChild(empty);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(new Date(currentYear, currentMonth, day));
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.dataset.date = dateStr;

        // Add day number
        const numberEl = document.createElement('span');
        numberEl.className = 'day-number';
        numberEl.textContent = day;
        dayEl.appendChild(numberEl);

        const dateObj = new Date(currentYear, currentMonth, day);
        const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (isPast) {
            dayEl.classList.add('booked');
        } else if (bookedDates.includes(dateStr)) {
            dayEl.classList.add('booked');
        } else {
            dayEl.classList.add('available');
            const season = getSeasonForDate(dateStr);
            dayEl.classList.add(season + '-season');

            // Add price
            const priceEl = document.createElement('span');
            priceEl.className = 'day-price';
            priceEl.textContent = `€${PRICING.seasons[season].nightly}`;
            dayEl.appendChild(priceEl);

            // Add click handler for available dates
            dayEl.addEventListener('click', () => handleDateClick(dateStr));
        }

        // Apply selection styling
        if (dateStr === selectedCheckIn) {
            dayEl.classList.add('check-in');
        }
        if (dateStr === selectedCheckOut) {
            dayEl.classList.add('check-out');
        }
        if (isInSelectedRange(dateStr)) {
            dayEl.classList.add('in-range');
        }

        calendarEl.appendChild(dayEl);
    }

    // Update selection display
    updateSelectionDisplay();
}

// Handle calendar date click
function handleDateClick(dateStr) {
    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
        // Start new selection
        selectedCheckIn = dateStr;
        selectedCheckOut = null;
    } else {
        // Complete the selection
        if (dateStr < selectedCheckIn) {
            // User clicked an earlier date, swap
            selectedCheckOut = selectedCheckIn;
            selectedCheckIn = dateStr;
        } else if (dateStr === selectedCheckIn) {
            // Same date clicked, clear selection
            selectedCheckIn = null;
        } else {
            selectedCheckOut = dateStr;
        }
    }

    // Check for booked dates in range and invalidate if found
    if (selectedCheckIn && selectedCheckOut && hasBookedDatesInRange()) {
        alert('Selected range contains unavailable dates. Please choose different dates.');
        selectedCheckOut = null;
    }

    renderCalendar();
    syncDatesToForm();
}

// Check if a date is within the selected range
function isInSelectedRange(dateStr) {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
}

// Check if there are booked dates in the selected range
function hasBookedDatesInRange() {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return bookedDates.some(d => d > selectedCheckIn && d < selectedCheckOut);
}

// Update the selection info display
function updateSelectionDisplay() {
    const container = document.querySelector('.calendar-container');
    if (!container) return;

    // Remove existing display
    let display = container.querySelector('.selection-display');
    if (!display) {
        display = document.createElement('div');
        display.className = 'selection-display';
        container.appendChild(display);
    }

    if (selectedCheckIn && selectedCheckOut) {
        const nights = calculateNights(selectedCheckIn, selectedCheckOut);
        const totalPrice = calculateTotalPrice(selectedCheckIn, selectedCheckOut);
        const paymentUrl = getPaymentLink(selectedCheckIn, nights);

        display.innerHTML = `
            <div class="selection-info">
                <span class="selection-dates">
                    <strong>Check-in:</strong> ${formatDisplayDate(selectedCheckIn)} → 
                    <strong>Check-out:</strong> ${formatDisplayDate(selectedCheckOut)}
                </span>
                <span class="selection-nights">${nights} night${nights > 1 ? 's' : ''} — <strong class="price-highlight">${PRICING.currency}${totalPrice}</strong></span>
            </div>
            <div class="selection-actions">
                <button class="clear-selection-btn">Clear</button>
                <a href="${paymentUrl}" target="_blank" rel="noopener noreferrer" class="book-now-btn">
                    Book Now
                </a>
            </div>
        `;

        // Attach event listeners (CSP compliance)
        const clearBtn = display.querySelector('.clear-selection-btn');
        if (clearBtn) clearBtn.addEventListener('click', clearDateSelection);

        const bookBtn = display.querySelector('.book-now-btn');
        if (bookBtn && paymentUrl === '#') {
            bookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Payment links coming soon! Please use the contact form below.');
            });
        }

        display.style.display = 'flex';
    } else if (selectedCheckIn) {
        display.innerHTML = `
            <div class="selection-info">
                <span class="selection-dates">Check-in: ${formatDisplayDate(selectedCheckIn)} — Select check-out date</span>
            </div>
            <button class="clear-selection-btn">Clear</button>
        `;

        const clearBtn = display.querySelector('.clear-selection-btn');
        if (clearBtn) clearBtn.addEventListener('click', clearDateSelection);

        display.style.display = 'flex';
    } else {
        display.style.display = 'none';
    }
}

// Format date for display (e.g., "Jan 15, 2026")
function formatDisplayDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const t = translations[currentLang].calendar;
    return `${t.months[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
}

// Calculate nights between dates
function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

// Clear date selection
function clearDateSelection() {
    selectedCheckIn = null;
    selectedCheckOut = null;
    renderCalendar();
    syncDatesToForm();
}

// Sync selected dates to the contact form
function syncDatesToForm() {
    const datesInput = document.getElementById('dates');
    if (!datesInput) return;

    if (selectedCheckIn && selectedCheckOut) {
        datesInput.value = `${formatDisplayDate(selectedCheckIn)} - ${formatDisplayDate(selectedCheckOut)}`;
        // Removed auto-scroll so user can see price
    } else {
        datesInput.value = '';
    }
}

// ----- Contact Form -----
function initContactForm() {
    const form = document.querySelector('.contact-form form');

    if (form) {
        // Rate limiting: max 3 submissions per 5 minutes
        const RATE_LIMIT = { maxSubmissions: 3, windowMs: 5 * 60 * 1000 };
        let submissions = JSON.parse(sessionStorage.getItem('formSubmissions') || '[]');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clean old submissions outside the window
            const now = Date.now();
            submissions = submissions.filter(time => now - time < RATE_LIMIT.windowMs);

            // Check rate limit
            if (submissions.length >= RATE_LIMIT.maxSubmissions) {
                showFormMessage('Too many submissions. Please try again in a few minutes.', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Honeypot check (if field exists and is filled, it's a bot)
            if (data.website) {
                console.log('Bot detected');
                showFormMessage('Thank you! We\'ll get back to you soon.', 'success');
                form.reset();
                return;
            }

            // Submit to Formspree
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Track submission for rate limiting on success
                    submissions.push(now);
                    sessionStorage.setItem('formSubmissions', JSON.stringify(submissions));

                    showFormMessage('Thank you! We\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    showFormMessage('Oops! There was a problem sending your message.', 'error');
                }
            }).catch(error => {
                showFormMessage('Oops! There was a problem sending your message.', 'error');
            });
        });
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(message, type) {
    const feedback = document.querySelector('.form-feedback');
    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = `form-feedback form-message ${type}`;
    feedback.style.cssText = `
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
    text-align: center;
    ${type === 'success'
            ? 'background: #d4edda; color: #155724;'
            : 'background: #f8d7da; color: #721c24;'}
  `;

    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
        feedback.removeAttribute('style');
    }, 5000);
}

// ----- Sticky Mobile Booking Bar -----
// Hides itself while the Availability or Contact sections are in view
// (user is already looking at the CTA equivalents — bar would be noise).
function initMobileBookBar() {
    const bar = document.querySelector('.mobile-book-bar');
    if (!bar) return;
    // Desktop users never see it; save the observer cost.
    if (window.matchMedia('(min-width: 769px)').matches) return;

    const availability = document.getElementById('availability');
    const contact = document.getElementById('contact');
    const targets = [availability, contact].filter(Boolean);
    if (!targets.length) return;

    const state = new WeakMap();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => state.set(entry.target, entry.isIntersecting));
        const anyVisible = targets.some(t => state.get(t));
        bar.classList.toggle('is-hidden', anyVisible);
    }, { rootMargin: '0px 0px -20% 0px' });

    targets.forEach(t => observer.observe(t));
}

// ----- Scroll Animations -----
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section, .amenity-card, .bedroom-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ----- iCal Integration (placeholder for user's URLs) -----
// To integrate with Airbnb and Booking.com:
// 1. Get your iCal export URLs from each platform
// 2. Use a CORS proxy or backend service to fetch the data
// 3. Call fetchICalData() with each URL
// 4. Merge the results into bookedDates array

/*
Example usage:
async function loadAllBookings() {
  const airbnbUrl = 'YOUR_AIRBNB_ICAL_URL';
  const bookingUrl = 'YOUR_BOOKING_ICAL_URL';
  
  const [airbnbDates, bookingDates] = await Promise.all([
    fetchICalData(airbnbUrl),
    fetchICalData(bookingUrl)
  ]);
  
  bookedDates = [...new Set([...airbnbDates, ...bookingDates])];
  renderCalendar();
}
*/

// ----- Service Worker Registration (PWA) -----
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}
