
// Global Variables
let currentGalleryIndex = 0;
let currentTestimonialIndex = 0;
let galleryImages = [];
let heroImages = [];

// Services Data
const services = [
    { icon: getTruckIcon(), name: 'Heavy-Duty Towing & Recovery' },
    { icon: getArrowUpDownIcon(), name: 'Load Transfers' },
    { icon: getCarIcon(), name: 'Light / Medium Towing & Recovery' },
    { icon: getRefreshIcon(), name: 'Swap Outs' },
    { icon: getConstructionIcon(), name: 'Rotator / Mobile Crane' },
    { icon: getAnchorIcon(), name: 'Winch Outs' },
    { icon: getLayersIcon(), name: 'Decking / Undecking' },
    { icon: getWrenchIcon(), name: 'Minor Roadside Assistance' },
    { icon: getMapIcon(), name: 'Local & Long Distance' },
    { icon: getCompassIcon(), name: 'Load Shifts' },
    { icon: getForkliftIcon(), name: 'Landoll Service*', isSublet: true },
    { icon: getAlertTriangleIcon(), name: 'Hazmat Cleanup*', isSublet: true }
];

// Testimonials Data
const testimonials = [
    {
        name: "John M.",
        role: "Fleet Manager",
        quote: "When our semi was stuck on I-10 with a full load, Fellers had us back on the road in record time. Their team was professional and efficient.",
        stars: 5
    },
    {
        name: "Sarah L.",
        role: "Transportation Director",
        quote: "We've used Fellers Resources for years for our heavy-duty recovery needs. They're always reliable, even in the middle of the night.",
        stars: 5
    },
    {
        name: "Michael T.",
        role: "Owner-Operator",
        quote: "After my rollover incident, Fellers handled everything with care. Their rotator service saved my equipment from serious damage.",
        stars: 5
    }
];

// Why Choose Us Reasons
const reasons = [
    'Certified operators with years of experience',
    'Modern fleet of well-maintained equipment',
    'Fully insured for your peace of mind',
    'Family-owned with personal service',
    'Fast response times, 24/7/365',
    'Specialized in heavy-duty recovery situations'
];

// Icon Functions
function getTruckIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path>
    </svg>`;
}

function getArrowUpDownIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
    </svg>`;
}

function getCarIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
    </svg>`;
}

function getRefreshIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>`;
}

function getConstructionIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
    </svg>`;
}

function getAnchorIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3h12l4 6-10 13L2 9l4-6z"></path>
    </svg>`;
}

function getLayersIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="12,2 22,8.5 12,15 2,8.5"></polygon>
        <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="2,17.5 12,24 22,17.5"></polyline>
        <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="2,12.5 12,19 22,12.5"></polyline>
    </svg>`;
}

function getWrenchIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>`;
}

function getMapIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"></polygon>
    </svg>`;
}

function getCompassIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle stroke-linecap="round" stroke-linejoin="round" stroke-width="2" cx="12" cy="12" r="10"></circle>
        <polygon stroke-linecap="round" stroke-linejoin="round" stroke-width="2" points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"></polygon>
    </svg>`;
}

function getForkliftIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`;
}

function getAlertTriangleIcon() {
    return `<svg class="w-8 h-8 text-fellers-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`;
}

function getCheckIcon() {
    return `<svg class="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
    </svg>`;
}

function getStarIcon() {
    return `<svg class="star-icon" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>`;
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupScrollEffects();
    renderServices();
    renderReasons();
    loadGalleryImages();
    loadHeroImages();
    renderTestimonials();
    setupCarousels();
    setupFormHandling();
    setCurrentYear();
    setupSmoothScrolling();
}

function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
        });
    }

    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    }

    // Close mobile menu when clicking on links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('translate-x-full');
            }
        });
    });

    // Close mobile menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('translate-x-full');
            }
        });
    }
}

function setupScrollEffects() {
    let scrolled = false;
    const scrolledNav = document.getElementById('scrolled-nav');

    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > 50;
        
        if (shouldShow !== scrolled) {
            scrolled = shouldShow;
            if (scrolledNav) {
                if (scrolled) {
                    scrolledNav.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
                    scrolledNav.classList.add('translate-y-0', 'opacity-100');
                } else {
                    scrolledNav.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
                    scrolledNav.classList.remove('translate-y-0', 'opacity-100');
                }
            }
        }
    });
}

function renderServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = services.map((service, index) => `
        <div class="services-item" style="animation-delay: ${index * 50}ms;">
            <div class="mb-2 md:mb-4">
                ${service.icon}
            </div>
            <h3 class="text-center text-white text-sm sm:text-base font-semibold">${service.name}</h3>
        </div>
    `).join('');
}

function renderReasons() {
    const reasonsList = document.getElementById('reasons-list');
    if (!reasonsList) return;

    reasonsList.innerHTML = reasons.map((reason, index) => `
        <li class="flex items-center animate-fade-in-up" style="animation-delay: ${index * 100}ms;">
            <div class="bg-fellers-green rounded-full p-1 mr-3 flex-shrink-0">
                ${getCheckIcon()}
            </div>
            <span class="text-sm sm:text-base text-white font-medium">${reason}</span>
        </li>
    `).join('');
}

function loadGalleryImages() {
    const savedImages = localStorage.getItem('galleryImages');
    if (savedImages) {
        try {
            const parsedImages = JSON.parse(savedImages);
            if (parsedImages.length > 0) {
                const sortedImages = [...parsedImages].sort((a, b) => a.order - b.order);
                galleryImages = sortedImages.map(img => img.url);
                renderGallery();
            }
        } catch (error) {
            console.error("Error parsing gallery images:", error);
        }
    }

    // Listen for storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'galleryImages') {
            loadGalleryImages();
        }
    });

    // Listen for custom events
    window.addEventListener('galleryImagesUpdated', () => {
        loadGalleryImages();
    });
}

function loadHeroImages() {
    const savedImages = localStorage.getItem('galleryImages');
    const fallbackImage = '/lovable-uploads/046e5f95-7772-4564-888a-5026ab430faf.png';
    
    if (savedImages) {
        try {
            const parsedImages = JSON.parse(savedImages);
            if (parsedImages.length > 0) {
                const sortedImages = [...parsedImages].sort((a, b) => a.order - b.order);
                heroImages = sortedImages.map(img => img.url);
            } else {
                heroImages = [fallbackImage];
            }
        } catch (error) {
            console.error("Error parsing hero images:", error);
            heroImages = [fallbackImage];
        }
    } else {
        heroImages = [fallbackImage];
    }
    
    renderHeroCarousel();
}

function renderGallery() {
    const gallerySection = document.getElementById('gallery');
    const galleryTrack = document.getElementById('gallery-track');
    
    if (galleryImages.length === 0) {
        if (gallerySection) {
            gallerySection.style.display = 'none';
        }
        return;
    }

    if (gallerySection) {
        gallerySection.style.display = 'block';
    }
    
    if (!galleryTrack) return;

    galleryTrack.innerHTML = galleryImages.map((image, index) => `
        <div class="gallery-item">
            <div class="gallery-item-inner">
                <img src="${image}" alt="Fellers Resources heavy towing equipment ${index + 1}" loading="lazy">
            </div>
        </div>
    `).join('');

    // Preload images
    galleryImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function renderHeroCarousel() {
    const heroCarousel = document.getElementById('hero-carousel');
    if (!heroCarousel) return;

    heroCarousel.innerHTML = heroImages.map((image, index) => `
        <div class="carousel-slide ${index === 0 ? 'active' : ''} w-full h-full bg-cover bg-center" style="background-image: url('${image}'); filter: brightness(0.4);"></div>
    `).join('');

    // Preload hero images
    heroImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Start hero carousel if multiple images
    if (heroImages.length > 1) {
        startHeroCarousel();
    }
}

function startHeroCarousel() {
    let currentHeroIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    
    if (slides.length <= 1) return;

    setInterval(() => {
        slides[currentHeroIndex].classList.remove('active');
        currentHeroIndex = (currentHeroIndex + 1) % slides.length;
        slides[currentHeroIndex].classList.add('active');
    }, 5000);
}

function renderTestimonials() {
    const testimonialTrack = document.getElementById('testimonial-track');
    if (!testimonialTrack) return;

    testimonialTrack.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-item">
            <div class="testimonial-content">
                <div class="testimonial-stars">
                    ${Array(testimonial.stars).fill(getStarIcon()).join('')}
                </div>
                <blockquote class="testimonial-quote">
                    "${testimonial.quote}"
                </blockquote>
                <div>
                    <p class="testimonial-author">${testimonial.name}</p>
                    <p class="testimonial-role">${testimonial.role}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function setupCarousels() {
    setupGalleryCarousel();
    setupTestimonialCarousel();
}

function setupGalleryCarousel() {
    const galleryTrack = document.getElementById('gallery-track');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    
    if (!galleryTrack || !galleryPrev || !galleryNext) return;

    galleryPrev.addEventListener('click', () => {
        currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
        updateGalleryPosition();
    });

    galleryNext.addEventListener('click', () => {
        const maxIndex = Math.max(0, galleryImages.length - getVisibleGalleryItems());
        currentGalleryIndex = Math.min(maxIndex, currentGalleryIndex + 1);
        updateGalleryPosition();
    });

    updateGalleryPosition();
}

function getVisibleGalleryItems() {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 640) return 2;  // sm
    return 1; // mobile
}

function updateGalleryPosition() {
    const galleryTrack = document.getElementById('gallery-track');
    if (!galleryTrack) return;

    const itemWidth = 100 / getVisibleGalleryItems();
    const translateX = -(currentGalleryIndex * itemWidth);
    galleryTrack.style.transform = `translateX(${translateX}%)`;

    // Update button states
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    
    if (galleryPrev) {
        galleryPrev.disabled = currentGalleryIndex === 0;
    }
    
    if (galleryNext) {
        const maxIndex = Math.max(0, galleryImages.length - getVisibleGalleryItems());
        galleryNext.disabled = currentGalleryIndex >= maxIndex;
    }
}

function setupTestimonialCarousel() {
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    
    if (!testimonialTrack || !testimonialPrev || !testimonialNext) return;

    testimonialPrev.addEventListener('click', () => {
        currentTestimonialIndex = Math.max(0, currentTestimonialIndex - 1);
        updateTestimonialPosition();
    });

    testimonialNext.addEventListener('click', () => {
        currentTestimonialIndex = Math.min(testimonials.length - 1, currentTestimonialIndex + 1);
        updateTestimonialPosition();
    });

    updateTestimonialPosition();

    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonialPosition();
    }, 8000);
}

function updateTestimonialPosition() {
    const testimonialTrack = document.getElementById('testimonial-track');
    if (!testimonialTrack) return;

    const translateX = -(currentTestimonialIndex * 100);
    testimonialTrack.style.transform = `translateX(${translateX}%)`;

    // Update button states
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    
    if (testimonialPrev) {
        testimonialPrev.disabled = currentTestimonialIndex === 0;
    }
    
    if (testimonialNext) {
        testimonialNext.disabled = currentTestimonialIndex >= testimonials.length - 1;
    }
}

function setupFormHandling() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email') || 'No email provided',
            location: formData.get('location'),
            details: formData.get('details')
        };

        try {
            // Simulate form submission - in real app this would call Supabase function
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            if (successMessage) {
                successMessage.classList.remove('hidden');
            }
            
            showToast("We're rolling—expect a call in minutes. Thank you for your service request!", 'success');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.add('hidden');
                }
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Failed to send your request. Please try again or call our dispatch directly.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Service Request';
            }
        }
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.remove('translate-x-full');
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
    }, 5000);
}

function setCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

function setupSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle window resize for carousels
window.addEventListener('resize', () => {
    updateGalleryPosition();
});

// Export functions for potential admin use
window.FellersApp = {
    loadGalleryImages,
    loadHeroImages,
    renderGallery,
    renderHeroCarousel
};
