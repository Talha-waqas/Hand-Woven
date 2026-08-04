document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. Preloader & Loading Animation
     ========================================== */
  const preloader = document.getElementById('preloader');
  const body = document.body;

  // Prevent scrolling during preloader phase
  body.style.overflow = 'hidden';

  // Simulate loading progress
  setTimeout(() => {
    preloader.classList.add('fade-out');
    body.style.overflow = ''; // Restore scrolling
    
    // Staggered trigger for hero section elements
    setTimeout(() => {
      const heroContent = document.getElementById('hero-content-block');
      const heroImage = document.getElementById('hero-image-block');
      if (heroContent) heroContent.classList.add('reveal');
      if (heroImage) heroImage.classList.add('reveal');
    }, 200);
  }, 1400);

  /* ==========================================
     2. Scroll Progress Bar & Sticky Header
     ========================================== */
  const headerNav = document.getElementById('header-nav');
  const scrollProgress = document.getElementById('scroll-progress');
  
  const handleScroll = () => {
    // Sticky navigation state
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }

    // Scroll progress calculations
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load

  /* ==========================================
     3. Mobile Menu / Hamburger Toggle
     ========================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navOverlay = document.getElementById('nav-overlay');

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Handle window resizing to clean up active mobile state above desktop breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      if (navMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  /* ==========================================
     4. Scroll Reveal Animations (Intersection Observer)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger animation
        entry.target.classList.add('reveal');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    // Exclude hero section since it is animated by the preloader callback
    if (el.id !== 'hero-content-block' && el.id !== 'hero-image-block') {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      revealObserver.observe(el);
    }
  });

  /* ==========================================
     5. Testimonial Slider / Carousel
     ========================================== */
  const track = document.getElementById('slider-track');
  const slides = Array.from(track.children);
  const nextButton = document.getElementById('slider-next');
  const prevButton = document.getElementById('slider-prev');
  const dotsContainer = document.getElementById('slider-dots');
  const dots = Array.from(dotsContainer.children);
  
  let currentSlideIndex = 0;

  const updateSlider = (index) => {
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlideIndex].classList.add('active');
  };

  nextButton.addEventListener('click', () => {
    updateSlider(currentSlideIndex + 1);
  });

  prevButton.addEventListener('click', () => {
    updateSlider(currentSlideIndex - 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
    });
  });

  // Autoplay functionality with pause on mouse hover
  let autoplayTimer = setInterval(() => {
    updateSlider(currentSlideIndex + 1);
  }, 7000);

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      updateSlider(currentSlideIndex + 1);
    }, 7000);
  };

  [nextButton, prevButton, dotsContainer].forEach(element => {
    element.addEventListener('click', resetAutoplay);
  });

  // Pause on hover
  const testimonialContainer = document.getElementById('testimonials-slider');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', () => {
      clearInterval(autoplayTimer);
    });
    testimonialContainer.addEventListener('mouseleave', () => {
      resetAutoplay();
    });
  }

  // Swipe gesture support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  const handleGesture = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      updateSlider(currentSlideIndex + 1);
      resetAutoplay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      updateSlider(currentSlideIndex - 1);
      resetAutoplay();
    }
  };

  /* ==========================================
     6. Custom Lightbox Image Gallery Preview
     ========================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  // Find all openable images (both product grid images and instagram showcase items)
  const items = Array.from(document.querySelectorAll('.product-image-container img, .instagram-item img'));
  let activeImageIndex = 0;

  const openLightbox = (index) => {
    activeImageIndex = index;
    lightboxImg.src = items[activeImageIndex].src;
    lightboxImg.alt = items[activeImageIndex].alt;
    lightbox.classList.add('active');
    body.style.overflow = 'hidden'; // Disable scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    body.style.overflow = ''; // Restore scroll
  };

  const showNextImage = () => {
    activeImageIndex = (activeImageIndex + 1) % items.length;
    lightboxImg.src = items[activeImageIndex].src;
    lightboxImg.alt = items[activeImageIndex].alt;
  };

  const showPrevImage = () => {
    activeImageIndex = (activeImageIndex - 1 + items.length) % items.length;
    lightboxImg.src = items[activeImageIndex].src;
    lightboxImg.alt = items[activeImageIndex].alt;
  };

  // Add click listeners to items
  items.forEach((item, index) => {
    // Wrap click triggers on overlay icons or containers where applicable
    const parentContainer = item.closest('.product-image-container, .instagram-item');
    if (parentContainer) {
      // Exclude direct buttons in product-overlay from opening lightbox
      parentContainer.addEventListener('click', (e) => {
        if (!e.target.closest('.btn')) {
          openLightbox(index);
        }
      });
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* ==========================================
     7. Active Link Highlight on Scroll
     ========================================== */
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
});
