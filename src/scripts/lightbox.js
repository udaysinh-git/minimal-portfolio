// Lightbox functionality for masonry images
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox overlay
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
            <button class="lightbox-close" aria-label="Close lightbox">
                <span class="close-icon">×</span>
            </button>
        </div>
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
    const closeButton = lightboxOverlay.querySelector('.lightbox-close');

    // Function to open lightbox
    function openLightbox(imageSrc, imageAlt) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Add click event to masonry images
    function addLightboxToImages() {
        const masonryImages = document.querySelectorAll('.post-images-masonry img');
        
        masonryImages.forEach(img => {
            // Skip if already has lightbox functionality
            if (img.hasAttribute('data-lightbox-initialized')) {
                return;
            }
            
            img.setAttribute('data-lightbox-initialized', 'true');
            
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the original image source (not the thumbnail)
                const originalSrc = this.src;
                const imageAlt = this.alt || 'Image';
                
                openLightbox(originalSrc, imageAlt);
            });
        });
    }

    // Close lightbox when clicking overlay or close button
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    closeButton.addEventListener('click', closeLightbox);

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Initialize lightbox for existing images
    addLightboxToImages();

    // Watch for new images being added (for dynamic content)
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
                    setTimeout(addLightboxToImages, 100);
                }
            }
        });
    });

    // Observe the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add loading indicator for lightbox images
    lightboxImage.addEventListener('load', function() {
        this.style.opacity = '1';
    });

    lightboxImage.addEventListener('loadstart', function() {
        this.style.opacity = '0.7';
    });

    // Prevent lightbox from opening for blur images (they have their own click handler)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.blur-image-container')) {
            e.stopPropagation();
        }
    });
});
