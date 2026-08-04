document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. Scroll Progress Bar
     ========================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  
  const handleScroll = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ==========================================
     2. Category Filtering Logic
     ========================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('#catalog-grid .product-card');

  // Helper to get active visible cards
  const getVisibleCards = () => {
    return Array.from(productCards).filter(card => card.style.display !== 'none');
  };

  const filterProducts = (category) => {
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        // Force reflow for transitions
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.98)';
        // Delay display setting to allow fade transition
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active classes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.getAttribute('data-category');
      filterProducts(selectedCategory);
    });
  });

  /* ==========================================
     3. Full-Screen Slider Overlay Logic
     ========================================== */
  const slider = document.getElementById('collection-slider');
  const sliderImage = document.getElementById('slider-image');
  const sliderTitle = document.getElementById('slider-title');
  const sliderPrice = document.getElementById('slider-price');
  const sliderDesc = document.getElementById('slider-desc');
  const sliderCounter = document.getElementById('slider-counter');

  const closeBtn = document.getElementById('slider-close-btn');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');

  let activeIndex = 0;
  let activeVisibleCards = [];

  const updateSliderContent = () => {
    if (activeVisibleCards.length === 0) return;
    
    const card = activeVisibleCards[activeIndex];
    const imageSrc = card.querySelector('.product-image').src;
    const imageAlt = card.querySelector('.product-image').alt;
    const name = card.querySelector('.product-name').textContent;
    const price = card.querySelector('.product-price').textContent;
    const desc = card.querySelector('.product-desc').textContent;

    sliderImage.style.opacity = '0';
    sliderImage.style.transform = 'scale(0.95)';

    setTimeout(() => {
      sliderImage.src = imageSrc;
      sliderImage.alt = imageAlt;
      sliderTitle.textContent = name;
      sliderPrice.textContent = price;
      sliderDesc.textContent = desc;
      sliderCounter.textContent = `${activeIndex + 1} / ${activeVisibleCards.length}`;
      
      sliderImage.style.opacity = '1';
      sliderImage.style.transform = 'scale(1)';
    }, 200);
  };

  const openSlider = (clickedCard) => {
    activeVisibleCards = getVisibleCards();
    activeIndex = activeVisibleCards.indexOf(clickedCard);
    
    updateSliderContent();
    slider.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  const closeSlider = () => {
    slider.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };

  const navigateSlider = (direction) => {
    if (activeVisibleCards.length === 0) return;
    
    if (direction === 'next') {
      activeIndex = (activeIndex + 1) % activeVisibleCards.length;
    } else {
      activeIndex = (activeIndex - 1 + activeVisibleCards.length) % activeVisibleCards.length;
    }
    updateSliderContent();
  };

  // Bind clicks to each product card image container or overlay
  productCards.forEach(card => {
    const triggerArea = card.querySelector('.product-image-container');
    if (triggerArea) {
      triggerArea.addEventListener('click', () => {
        openSlider(card);
      });
    }
  });

  // Slider events
  closeBtn.addEventListener('click', closeSlider);
  nextBtn.addEventListener('click', () => navigateSlider('next'));
  prevBtn.addEventListener('click', () => navigateSlider('prev'));

  // Close on background backdrop click
  slider.addEventListener('click', (e) => {
    if (e.target === slider || e.target.classList.contains('slider-main-content')) {
      closeSlider();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!slider.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeSlider();
    if (e.key === 'ArrowRight') navigateSlider('next');
    if (e.key === 'ArrowLeft') navigateSlider('prev');
  });

  // Swipe detection for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped left -> show next
      navigateSlider('next');
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped right -> show prev
      navigateSlider('prev');
    }
  };
});
