/**
 * HARCHOY - Main JavaScript
 * Bespoke Suit Manufacturer Website
 */

(function () {
    'use strict';

    // ==================== DOM Elements ====================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const faqItems = document.querySelectorAll('.faq-item__question');
    const contactForm = document.getElementById('contactForm');
    const heroScroll = document.querySelector('.hero__scroll');

    // ==================== Header Scroll Effect ====================
    let lastScrollY = 0;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add scrolled class
        if (currentScrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNav(currentScrollY);

        lastScrollY = currentScrollY;
    }

    // ==================== Active Navigation on Scroll ====================
    function updateActiveNav(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // ==================== Mobile Navigation ====================
    navToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('nav__menu--open');
        navToggle.setAttribute('aria-expanded', isOpen);
        
        // Toggle hamburger animation
        navToggle.classList.toggle('nav__toggle--active');
        
        // Prevent body scroll when menu open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking nav links (mobile)
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('nav__menu--open')) {
                navMenu.classList.remove('nav__menu--open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('nav__toggle--active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('nav__menu--open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('nav__menu--open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('nav__toggle--active');
            document.body.style.overflow = '';
        }
    });

    // ==================== FAQ Accordion ====================
    faqItems.forEach(function (button) {
        button.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(function (item) {
                item.setAttribute('aria-expanded', 'false');
                const answer = item.nextElementSibling;
                answer.style.maxHeight = null;
            });

            // Toggle current
            if (!expanded) {
                this.setAttribute('aria-expanded', 'true');
                const answer = this.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Initialize first FAQ item as collapsed
    faqItems.forEach(function (button) {
        button.setAttribute('aria-expanded', 'false');
        const answer = button.nextElementSibling;
        answer.style.maxHeight = null;
    });

    // ==================== Contact Form ====================
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Basic validation
            const name = document.getElementById('name').value.trim();
            const company = document.getElementById('company').value.trim();
            const email = document.getElementById('email').value.trim();
            const interest = document.getElementById('interest').value;

            if (!name || !company || !email || !interest) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // UI Feedback: Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Actual form submission
            const formAction = contactForm.getAttribute('action');
            if (formAction && !formAction.includes('YOUR_FORMSPREE_ID') && formAction !== '#') {
                const formData = new FormData(contactForm);
                fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(function(response) {
                    if (response.ok) {
                        showFormMessage('Thank you! Your inquiry has been sent successfully.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(function(error) {
                    showFormMessage('Sorry, there was a problem. Please email us directly.', 'error');
                })
                .finally(function() {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
            } else {
                // Simulate submission for demonstration/placeholders
                setTimeout(function() {
                    showFormMessage('Thank you! Your message has been received. (Developer Mode)', 'success');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }, 1000);
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMsg = document.querySelector('.contact__form-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        const msgEl = document.createElement('div');
        msgEl.className = 'contact__form-message contact__form-message--' + type;
        msgEl.textContent = message;
        msgEl.style.cssText = [
            'padding: 12px 16px',
            'margin-top: 16px',
            'border-radius: 4px',
            'font-size: 0.9rem',
            'text-align: center',
            type === 'success' 
                ? 'background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;'
                : 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;'
        ].join(';');

        contactForm.appendChild(msgEl);

        // Auto remove
        setTimeout(function () {
            msgEl.style.opacity = '0';
            msgEl.style.transition = 'opacity 0.3s';
            setTimeout(function () { msgEl.remove(); }, 300);
        }, 4000);
    }

    // ==================== Smooth Scroll for Hero CTA ====================
    if (heroScroll) {
        heroScroll.addEventListener('click', function () {
            const solutionsSection = document.getElementById('solutions');
            if (solutionsSection) {
                solutionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        heroScroll.style.cursor = 'pointer';
    }

    // ==================== Scroll Animation (Intersection Observer) ====================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll([
            '.solution-card',
            '.product-card',
            '.fabric-card',
            '.feature-item',
            '.process-step',
            '.testimonial-card',
            '.faq-item'
        ].join(','));

        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements
            animatedElements.forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animatedElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ==================== Init ====================
    function init() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        initScrollAnimations();

        // Set copyright year dynamically
        const yearSpan = document.querySelector('.footer__bottom p');
        if (yearSpan) {
            const currentYear = new Date().getFullYear();
            yearSpan.textContent = yearSpan.textContent.replace('2024', currentYear);
        }

        // ==================== Gallery Lightbox ====================
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox__img');
        const lightboxClose = document.querySelector('.lightbox__close');
        const galleryItems = document.querySelectorAll('.gallery__item');

        if (lightbox && galleryItems.length) {
            galleryItems.forEach(function(item) {
                item.addEventListener('click', function() {
                    const img = this.querySelector('img');
                    if (img) {
                        lightboxImg.src = img.src;
                        lightboxImg.alt = img.alt;
                        lightbox.classList.add('lightbox--open');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) closeLightbox();
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
                    closeLightbox();
                }
            });
        }

        function closeLightbox() {
            lightbox.classList.remove('lightbox--open');
            document.body.style.overflow = '';
        }

        // ==================== Back to Top Button ====================
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 600) {
                    backToTopBtn.classList.add('floating-btn--visible');
                } else {
                    backToTopBtn.classList.remove('floating-btn--visible');
                }
            });

            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ==================== Lazy Loading Observer ====================
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading - add loading="lazy" to all images
            document.querySelectorAll('img:not([loading])').forEach(function(img) {
                if (!img.closest('.hero') && !img.closest('.lightbox')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }

        // Mark lazy images as loaded
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() { this.classList.add('loaded'); });
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
