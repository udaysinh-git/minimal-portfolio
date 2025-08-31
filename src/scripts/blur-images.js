// Blur Images Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to wrap images with blur functionality
    function wrapImagesWithBlur() {
        // Select all images in blog posts
        const images = document.querySelectorAll('.post-content img, .post-body img, .posts img');
        
        images.forEach((img, index) => {
            // Skip if already wrapped
            if (img.parentElement.classList.contains('blur-image-container')) {
                return;
            }
            
            // Check if image has blur class or data attribute
            const shouldBlur = img.classList.contains('blur') || 
                              img.hasAttribute('data-blur') || 
                              img.getAttribute('data-blur') === 'true';
            
            if (shouldBlur) {
                // Create wrapper container
                const wrapper = document.createElement('div');
                wrapper.className = 'blur-image-container blurred';
                wrapper.style.display = 'inline-block';
                
                // Insert wrapper before image
                img.parentNode.insertBefore(wrapper, img);
                
                // Move image into wrapper
                wrapper.appendChild(img);
                
                // Add click event listener
                wrapper.addEventListener('click', function() {
                    this.classList.remove('blurred');
                    this.classList.add('revealed');
                    
                    // Optional: Add a subtle animation
                    this.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                });
                
                // Add keyboard accessibility
                wrapper.setAttribute('tabindex', '0');
                wrapper.setAttribute('role', 'button');
                wrapper.setAttribute('aria-label', 'Click to reveal image');
                
                wrapper.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        });
    }
    
    // Function to manually add blur to specific images
    function addBlurToImage(imgElement) {
        if (imgElement.parentElement.classList.contains('blur-image-container')) {
            return; // Already wrapped
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'blur-image-container blurred';
        wrapper.style.display = 'inline-block';
        
        imgElement.parentNode.insertBefore(wrapper, imgElement);
        wrapper.appendChild(imgElement);
        
        wrapper.addEventListener('click', function() {
            this.classList.remove('blurred');
            this.classList.add('revealed');
            
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
        
        wrapper.setAttribute('tabindex', '0');
        wrapper.setAttribute('role', 'button');
        wrapper.setAttribute('aria-label', 'Click to reveal image');
        
        wrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Initialize blur functionality
    wrapImagesWithBlur();
    
    // Expose function globally for manual use
    window.addBlurToImage = addBlurToImage;
    window.wrapImagesWithBlur = wrapImagesWithBlur;
    
    // Handle dynamically loaded content (if any)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
                        newImages.forEach(img => {
                            if (img.classList.contains('blur') || 
                                img.hasAttribute('data-blur') || 
                                img.getAttribute('data-blur') === 'true') {
                                addBlurToImage(img);
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('Blur images functionality loaded');
});
