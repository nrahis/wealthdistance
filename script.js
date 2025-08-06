// Modern JavaScript for The Mileage of Wealth

class WealthVisualization {
  constructor() {
    this.progressBar = document.getElementById('progressBar');
    this.navToggle = document.getElementById('navToggle');
    this.navList = document.getElementById('navList');
    this.backToTop = document.getElementById('backToTop');
    this.quizResult = document.getElementById('quizResult');
    
    this.scrollPosition = 0;
    this.documentHeight = 0;
    this.windowHeight = 0;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupQuiz();
    this.calculateDocumentHeight();
    this.handleScroll(); // Initial call
    this.setupIntersectionObserver();
  }

  setupEventListeners() {
    // Throttled scroll event for better performance
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    
    // Resize event with debouncing
    window.addEventListener('resize', this.debounce(() => {
      this.calculateDocumentHeight();
    }, 250));

    // Mobile navigation toggle
    if (this.navToggle && this.navList) {
      this.navToggle.addEventListener('click', this.toggleMobileNav.bind(this));
      
      // Close mobile nav when clicking on a link
      this.navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.navList.classList.remove('open');
          this.updateNavToggleState(false);
        });
      });

      // Close mobile nav when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.navToggle.contains(e.target) && !this.navList.contains(e.target)) {
          this.navList.classList.remove('open');
          this.updateNavToggleState(false);
        }
      });
    }

    // Back to top button
    if (this.backToTop) {
      this.backToTop.addEventListener('click', this.scrollToTop.bind(this));
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });

    // Keyboard navigation improvements
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
  }

  setupQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    if (quizOptions.length === 0) return;

    quizOptions.forEach(option => {
      option.addEventListener('click', this.handleQuizSelection.bind(this));
    });
  }

  handleQuizSelection(e) {
    const selectedOption = e.target;
    const allOptions = document.querySelectorAll('.quiz-option');
    
    // Remove previous selections
    allOptions.forEach(option => option.classList.remove('selected'));
    
    // Mark current selection
    selectedOption.classList.add('selected');
    
    // Show result based on selection
    const answer = selectedOption.dataset.answer;
    this.showQuizResult(answer);
  }

  showQuizResult(answer) {
    if (!this.quizResult) return;

    const results = {
      china: "That's a good guess, but 1 billion dollars goes much further!",
      world: "You're getting warmer, but it's even more than that!",
      moon: "Exactly! You could travel 80% of the way to the moon with 1 billion dollars."
    };

    this.quizResult.textContent = results[answer] || "Great guess!";
    this.quizResult.className = answer === 'moon' ? 'quiz-result show' : 'quiz-result show';
    
    // Add appropriate styling based on correctness
    if (answer === 'moon') {
      this.quizResult.style.background = '#5f9ea0'; // Cadet blue
    } else {
      this.quizResult.style.background = '#daa520'; // Gold rod
    }
  }

  calculateDocumentHeight() {
    this.documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    this.windowHeight = window.innerHeight;
  }

  handleScroll() {
    this.scrollPosition = window.pageYOffset;
    
    this.updateProgressBar();
    this.updateBackToTopButton();
    this.updateHeaderOnScroll();
  }

  updateProgressBar() {
    if (!this.progressBar) return;

    const scrollableDistance = this.documentHeight - this.windowHeight;
    const scrollPercentage = (this.scrollPosition / scrollableDistance) * 100;
    
    this.progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
  }

  updateBackToTopButton() {
    if (!this.backToTop) return;

    if (this.scrollPosition > 300) {
      this.backToTop.classList.add('show');
    } else {
      this.backToTop.classList.remove('show');
    }
  }

  updateHeaderOnScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    if (this.scrollPosition > 100) {
      header.style.background = 'rgba(44, 62, 80, 0.98)';
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.background = 'rgba(44, 62, 80, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    }
  }

  toggleMobileNav() {
    const isOpen = this.navList.classList.contains('open');
    
    if (isOpen) {
      this.navList.classList.remove('open');
    } else {
      this.navList.classList.add('open');
    }
    
    this.updateNavToggleState(!isOpen);
  }

  updateNavToggleState(isOpen) {
    const spans = this.navToggle.querySelectorAll('span');
    
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  handleKeyboardNavigation(e) {
    // Handle keyboard navigation for accessibility
    switch(e.key) {
      case 'Escape':
        // Close mobile navigation if open
        if (this.navList.classList.contains('open')) {
          this.navList.classList.remove('open');
          this.updateNavToggleState(false);
          this.navToggle.focus();
        }
        break;
        
      case 'Home':
        // Scroll to top when Home key is pressed
        if (e.ctrlKey) {
          e.preventDefault();
          this.scrollToTop();
        }
        break;
        
      case 'End':
        // Scroll to bottom when End key is pressed
        if (e.ctrlKey) {
          e.preventDefault();
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }
        break;
    }
  }

  setupIntersectionObserver() {
    // Animate elements as they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
          entry.target.style.opacity = '1';
        }
      });
    }, observerOptions);

    // Observe sections for animation
    const animatedElements = document.querySelectorAll('.content-section, .comparison-table-container, .revenue-showcase');
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

// Additional utility functions for wealth calculations
class WealthCalculator {
  static convertToDistance(dollars) {
    // Convert dollars to feet, then to miles (1 mile = 5,280 feet)
    const feet = dollars;
    const miles = feet / 5280;
    return miles;
  }

  static convertToTime(dollars, speed = 45) {
    // Convert dollars to distance, then calculate time at given speed (mph)
    const miles = this.convertToDistance(dollars);
    const hours = miles / speed;
    return hours;
  }

  static formatTime(hours) {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      if (minutes < 60) {
        return `${minutes} minutes`;
      }
    }
    
    if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    }
    
    if (hours < 168) { // Less than a week
      const days = Math.round(hours / 24);
      return `${days} days`;
    }
    
    if (hours < 8760) { // Less than a year
      const weeks = Math.round(hours / 168);
      return `${weeks} weeks`;
    }
    
    const years = Math.round(hours / 8760);
    return `${years} years`;
  }

  static formatDistance(miles) {
    if (miles < 1) {
      const feet = Math.round(miles * 5280);
      return `${feet} feet`;
    }
    
    if (miles < 1000) {
      return `${miles.toFixed(1)} miles`;
    }
    
    return `${Math.round(miles).toLocaleString()} miles`;
  }

  static formatMoney(amount) {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)} billion`;
    }
    
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)} million`;
    }
    
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    
    return `$${amount.toLocaleString()}`;
  }
}

// Interactive wealth comparison tool
class WealthComparer {
  constructor() {
    this.addInteractiveCalculator();
  }

  addInteractiveCalculator() {
    const calculatorHTML = `
      <div class="wealth-calculator" style="background: var(--color-bg-secondary); padding: var(--spacing-2xl); border-radius: var(--border-radius-xl); margin: var(--spacing-2xl) 0; max-width: 600px; margin-left: auto; margin-right: auto;">
        <h3 style="text-align: center; margin-bottom: var(--spacing-xl);">Try Your Own Numbers</h3>
        <div style="display: grid; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
          <label style="font-weight: 500;">Enter an amount ($):</label>
          <input type="number" id="wealthInput" placeholder="e.g., 50000" style="padding: var(--spacing-md); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); font-size: var(--font-size-lg);">
          <button id="calculateWealth" style="background: var(--color-secondary); color: white; border: none; padding: var(--spacing-md); border-radius: var(--border-radius-md); font-weight: 600; cursor: pointer; font-size: var(--font-size-lg);">Calculate Distance & Time</button>
        </div>
        <div id="calculatorResult" style="background: var(--color-bg-primary); padding: var(--spacing-lg); border-radius: var(--border-radius-md); display: none;"></div>
      </div>
    `;

    // Insert the calculator after the first comparison table
    const firstTable = document.querySelector('.comparison-table-container');
    if (firstTable) {
      firstTable.insertAdjacentHTML('afterend', calculatorHTML);
      this.setupCalculator();
    }
  }

  setupCalculator() {
    const input = document.getElementById('wealthInput');
    const button = document.getElementById('calculateWealth');
    const result = document.getElementById('calculatorResult');

    if (!input || !button || !result) return;

    button.addEventListener('click', () => {
      const amount = parseFloat(input.value);
      if (isNaN(amount) || amount <= 0) {
        result.innerHTML = '<p style="color: var(--color-danger);">Please enter a valid amount.</p>';
        result.style.display = 'block';
        return;
      }

      const distance = WealthCalculator.convertToDistance(amount);
      const time = WealthCalculator.convertToTime(amount);
      
      result.innerHTML = `
        <h4 style="margin-bottom: var(--spacing-md); color: var(--color-secondary);">${WealthCalculator.formatMoney(amount)} equals:</h4>
        <p><strong>Distance:</strong> ${WealthCalculator.formatDistance(distance)}</p>
        <p><strong>Travel Time:</strong> ${WealthCalculator.formatTime(time)} at 45 mph</p>
      `;
      result.style.display = 'block';
    });

    // Allow Enter key to trigger calculation
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        button.click();
      }
    });
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.checkPerformance();
  }

  checkPerformance() {
    // Monitor loading time
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.startTime;
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Monitor scroll performance
    let scrollCount = 0;
    const scrollMonitor = () => {
      scrollCount++;
      if (scrollCount % 100 === 0) {
        console.log(`Scroll events: ${scrollCount}`);
      }
    };

    window.addEventListener('scroll', scrollMonitor);
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main functionality
  const wealthViz = new WealthVisualization();
  const wealthComparer = new WealthComparer();
  const performanceMonitor = new PerformanceMonitor();

  // Add loading animation cleanup
  document.body.classList.add('loaded');

  // Handle reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Set up error handling for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      console.log(`Failed to load image: ${this.src}`);
    });
  });

  console.log('The Mileage of Wealth - Initialized successfully');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WealthVisualization,
    WealthCalculator,
    WealthComparer,
    PerformanceMonitor
  };
}
