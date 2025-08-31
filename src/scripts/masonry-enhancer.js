// Masonry Layout Enhancer for Blog Images
document.addEventListener('DOMContentLoaded', function() {
    // Function to optimize masonry layout
    function optimizeMasonryLayout() {
        const masonryContainers = document.querySelectorAll('.post-images-masonry');
        
        masonryContainers.forEach(container => {
            const images = container.querySelectorAll('img');
            
            // Add loading optimization
            images.forEach(img => {
                // Ensure lazy loading
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                
                // Add error handling
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    console.warn('Image failed to load:', this.src);
                });
                
                // Add loading animation
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Responsive column adjustment for masonry
            function adjustMasonry() {
                const containerWidth = container.offsetWidth;
                const isMobile = window.innerWidth <= 768;
                const isSmallScreen = window.innerWidth <= 480;
                const imageCount = container.querySelectorAll('img').length;
                
                // Handle single image - center it and make it larger
                if (imageCount === 1) {
                    container.style.columnCount = '1';
                    container.style.textAlign = 'center';
                    const singleImage = container.querySelector('img');
                    if (singleImage) {
                        if (isMobile || isSmallScreen) {
                            // Mobile single image
                            singleImage.style.maxWidth = '100%';
                            singleImage.style.maxHeight = '400px';
                            singleImage.style.margin = '0 auto 1rem auto';
                        } else {
                            // Desktop single image
                            singleImage.style.maxWidth = '600px';
                            singleImage.style.maxHeight = '500px';
                            singleImage.style.margin = '0 auto 1.5rem auto';
                        }
                        singleImage.style.objectFit = 'contain';
                    }
                    return;
                }
                
                // Reset single image styles for multiple images
                container.style.textAlign = '';
                const images = container.querySelectorAll('img');
                images.forEach(img => {
                    img.style.maxWidth = '';
                    img.style.maxHeight = '';
                    img.style.margin = '';
                    img.style.objectFit = '';
                });
                
                if (isMobile || isSmallScreen) {
                    container.style.columnCount = '1';
                    container.style.columnGap = '1rem';
                } else if (containerWidth < 600) {
                    container.style.columnCount = '1';
                    container.style.columnGap = '1.5rem';
                } else if (containerWidth < 900) {
                    container.style.columnCount = '2';
                    container.style.columnGap = '1.5rem';
                } else if (containerWidth >= 1200) {
                    container.style.columnCount = '3';
                    container.style.columnGap = '2rem';
                } else {
                    container.style.columnCount = '2';
                    container.style.columnGap = '2rem';
                }
            }
            
            // Initial adjustment
            adjustMasonry();
            
            // Adjust on window resize
            window.addEventListener('resize', adjustMasonry);
        });
    }
    
    // Initialize masonry optimization
    optimizeMasonryLayout();
    
    // Re-optimize when new content is loaded (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if new masonry containers were added
                const hasNewMasonry = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 && (
                        node.classList.contains('post-images-masonry') ||
                        node.querySelector('.post-images-masonry')
                    );
                });
                
                if (hasNewMasonry) {
                    setTimeout(optimizeMasonryLayout, 100);
                }
            }
        });
    });
    
    // Observe the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Add smooth loading animation for images
    const allImages = document.querySelectorAll('.post-content img, .post-body img, .posts img');
    allImages.forEach(img => {
        // Set initial state
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Load animation
        if (img.complete) {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
        }
    });
});

// Mobile-specific optimizations
if (window.innerWidth <= 768) {
    // Reduce image quality on mobile for better performance
    const mobileImages = document.querySelectorAll('.post-content img, .post-body img, .posts img');
    mobileImages.forEach(img => {
        // Add mobile-specific classes
        img.classList.add('mobile-optimized');
    });
}

// Add touch-friendly interactions for mobile
document.addEventListener('touchstart', function() {}, {passive: true});

// Optimize scroll performance on mobile
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(function() {
            // Any scroll-based optimizations can go here
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll, {passive: true});
