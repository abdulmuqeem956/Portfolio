// ===================================
// MUQEEM EDITS - PORTFOLIO JAVASCRIPT
// All Interactive Features & Animations
// ===================================

// ===== Smooth Scroll Navigation =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToPortfolio() {
    scrollToSection('portfolio');
}

function scrollToContact() {
    scrollToSection('contact');
}

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    // Toggle menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = navLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
    
    // Prevent scrolling when menu is open
    const observer = new MutationObserver(() => {
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.filter = 'blur(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards with staggered delays
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.service-card, .video-card, .video-showcase-large, .comparison-container, .about-content, .contact-container'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(60px)';
        el.style.filter = 'blur(8px)';
        
        // Stagger delay for cards in the same section
        const delay = (index % 3) * 0.15; // 0s, 0.15s, 0.3s for cards side by side
        el.style.transition = `opacity 1s ease ${delay}s, transform 1s ease ${delay}s, filter 1s ease ${delay}s`;
        
        observer.observe(el);
    });
});

// ===== YouTube Video Hover Preview & Modal Handler =====
document.addEventListener('DOMContentLoaded', () => {
    const videoContainers = document.querySelectorAll('.video-container[data-video-id]');
    const modal = document.getElementById('videoModal');
    const modalClose = document.getElementById('modalClose');
    const videoFrame = document.getElementById('videoFrame');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    let hoverTimeout;
    let isHovering = false;
    
    // Hover preview functionality
    videoContainers.forEach(container => {
        const thumbnail = container.querySelector('.video-thumbnail');
        let previewFrame = null;
        
        // Mouse enter - start preview after delay
        container.addEventListener('mouseenter', function() {
            const videoId = this.getAttribute('data-video-id');
            
            if (videoId && videoId.trim() !== '') {
                isHovering = true;
                
                // Wait 500ms before showing preview
                hoverTimeout = setTimeout(() => {
                    if (isHovering) {
                        // Create iframe for preview
                        previewFrame = document.createElement('iframe');
                        previewFrame.className = 'video-preview-frame';
                        previewFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`;
                        previewFrame.frameBorder = '0';
                        previewFrame.allow = 'autoplay';
                        
                        // Hide thumbnail, show preview
                        const img = thumbnail.querySelector('.thumbnail-img');
                        const playOverlay = thumbnail.querySelector('.play-overlay');
                        
                        if (img) img.style.opacity = '0';
                        if (playOverlay) playOverlay.style.opacity = '0';
                        
                        thumbnail.appendChild(previewFrame);
                        
                        // Fade in preview
                        setTimeout(() => {
                            previewFrame.style.opacity = '1';
                        }, 50);
                    }
                }, 500);
            }
        });
        
        // Mouse leave - remove preview
        container.addEventListener('mouseleave', function() {
            isHovering = false;
            clearTimeout(hoverTimeout);
            
            if (previewFrame) {
                previewFrame.style.opacity = '0';
                
                setTimeout(() => {
                    if (previewFrame && previewFrame.parentNode) {
                        previewFrame.remove();
                    }
                    
                    // Show thumbnail again
                    const img = thumbnail.querySelector('.thumbnail-img');
                    const playOverlay = thumbnail.querySelector('.play-overlay');
                    
                    if (img) img.style.opacity = '1';
                    if (playOverlay) playOverlay.style.opacity = '1';
                }, 300);
                
                previewFrame = null;
            }
        });
        
        // Click to open full modal
        container.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            
            if (videoId && videoId.trim() !== '') {
                // Clear hover preview if exists
                isHovering = false;
                clearTimeout(hoverTimeout);
                if (previewFrame) {
                    previewFrame.remove();
                    previewFrame = null;
                }
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Load YouTube video with sound
                videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                
                // Add animation
                const playButton = this.querySelector('.play-button');
                if (playButton) {
                    playButton.style.transform = playButton.classList.contains('small') ? 'scale(0.9)' : 'scale(1.2)';
                    setTimeout(() => {
                        playButton.style.transform = '';
                    }, 200);
                }
            } else {
                // Show message to add video
                showNotification('Please add your YouTube video ID in the HTML', 'info');
            }
        });
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        videoFrame.src = '';
    }
    
    // Close on button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// ===== Contact Form Handler =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Create mailto link
        const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        const mailtoLink = `mailto:muqeem.edits@gmail.com?subject=${subject}&body=${body}`;
        
        // Open mail client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Opening your email client...', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

// ===== Notification System =====
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Icon based on type
    let icon = '';
    if (type === 'success') {
        icon = '<path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else if (type === 'info') {
        icon = '<circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/><path d="M10 10V14M10 6H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                ${icon}
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 16px 24px;
        color: var(--text-primary);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.2);
        max-width: 400px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const svg = notification.querySelector('svg');
    svg.style.color = type === 'success' ? 'var(--primary-green)' : 'var(--accent-green)';
    svg.style.flexShrink = '0';
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add animation keyframes and mobile menu styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    /* Mobile Menu Styles */
    @media (max-width: 968px) {
        .nav-links {
            position: fixed;
            top: 70px;
            right: 2.5%;
            left: 2.5%;
            width: 95%;
            max-width: 500px;
            margin: 0 auto;
            background: rgba(10, 15, 13, 0.98);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 2px solid var(--glass-border);
            border-radius: 20px;
            padding: 10px;
            flex-direction: column;
            gap: 0;
            transform: translateY(-20px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 20px 60px rgba(0, 255, 136, 0.3);
            z-index: 999;
        }
        
        .nav-links.active {
            display: flex !important;
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }
        
        .nav-links li {
            width: 100%;
            padding: 0;
            margin: 0;
            list-style: none;
        }
        
        .nav-links a {
            display: block;
            padding: 16px 20px;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
            border-radius: 12px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .nav-links a:hover,
        .nav-links a.active {
            background: var(--glass-bg);
            color: var(--primary-green);
            transform: translateX(5px);
        }
        
        .nav-links a::after {
            display: none;
        }
        
        /* Mobile menu button animation */
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(7px, 7px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
            transform: translateX(-20px);
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    }
    
    @media (max-width: 640px) {
        .nav-links {
            top: 60px;
        }
        
        .nav-links a {
            padding: 14px 18px;
            font-size: 15px;
        }
    }
`;
document.head.appendChild(style);

// ===== Parallax Effect for Background =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const lights = document.querySelectorAll('.light-effect');
    
    lights.forEach((light, index) => {
        const speed = (index + 1) * 0.3;
        light.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== Glass Card Hover Effect Enhancement =====
document.addEventListener('DOMContentLoaded', () => {
    const glassCards = document.querySelectorAll('.glass');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create glow effect that follows mouse
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            
            this.style.setProperty('--glow-x', `${glowX}%`);
            this.style.setProperty('--glow-y', `${glowY}%`);
        });
    });
});

// Add glow effect styles
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    .glass {
        position: relative;
    }
    
    .glass::after {
        content: '';
        position: absolute;
        top: var(--glow-y, 50%);
        left: var(--glow-x, 50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(
            circle,
            rgba(0, 255, 136, 0.1) 0%,
            transparent 70%
        );
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        border-radius: 50%;
    }
    
    .glass:hover::after {
        opacity: 1;
    }
`;
document.head.appendChild(glowStyle);

// ===== Typing Effect for Hero Title (Optional Enhancement) =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== Smooth Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Active Link Highlighting =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link style
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-links a.active {
        color: var(--primary-green) !important;
    }
    
    .nav-links a.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeLinkStyle);

// ===== Cursor Trail Effect (Optional Enhancement) =====
class CursorTrail {
    constructor() {
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        // Create trail dots
        for (let i = 0; i < 8; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i}px;
                height: ${8 - i}px;
                background: var(--primary-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.5 - i * 0.05};
                transition: transform 0.${i}s ease;
                display: none;
            `;
            document.body.appendChild(dot);
            this.dots.push(dot);
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            this.dots.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.display = 'block';
                    dot.style.left = this.mouse.x + 'px';
                    dot.style.top = this.mouse.y + 'px';
                    dot.style.transform = 'translate(-50%, -50%)';
                }, index * 20);
            });
        });
        
        // Hide on mouse leave
        document.addEventListener('mouseleave', () => {
            this.dots.forEach(dot => {
                dot.style.display = 'none';
            });
        });
    }
}

// Initialize cursor trail on desktop only
if (window.innerWidth > 968) {
    new CursorTrail();
}

// ===== Console Easter Egg =====
console.log('%c🎬 Muqeem Edits Portfolio', 'font-size: 20px; font-weight: bold; color: #00ff88;');
console.log('%cLooking for a professional video editor?', 'font-size: 14px; color: #b8e6d5;');
console.log('%cContact: muqeem.edits@gmail.com', 'font-size: 14px; color: #00ff88;');

// ===== Performance Optimization =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScroll = debounce(() => {
    // Scroll-related code here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== Lazy Loading for Images (when you add real images) =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===== Touch Support for Mobile Devices =====
// Make buttons more touch-friendly
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary, .social-btn');
    
    buttons.forEach(button => {
        // Add touch feedback
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Improve click area for small links on mobile
    if (window.innerWidth <= 968) {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.style.minHeight = '44px';
            link.style.display = 'flex';
            link.style.alignItems = 'center';
        });
    }
});

// ===== Prevent iOS Safari Zoom on Input Focus =====
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.fontSize = '16px'; // Prevents zoom
        });
    });
}

// ===== Handle Orientation Change =====
window.addEventListener('orientationchange', () => {
    // Close mobile menu on orientation change
    if (navLinks && mobileMenuBtn) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
    
    // Recalculate positions if needed
    setTimeout(() => {
        window.scrollTo(0, window.pageYOffset);
    }, 100);
});

// ===== Improve Scroll Performance on Mobile =====
let ticking = false;
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Your scroll-based animations here
            ticking = false;
        });
        
        ticking = true;
    }
}, { passive: true });

console.log('✅ Muqeem Edits Portfolio - All scripts loaded successfully!');
console.log('📱 Mobile optimizations enabled');
console.log('✨ Touch support activated');
