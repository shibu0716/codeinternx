/**
 * CodeInternX Document Utilities
 * These scripts are injected into the HTML templates to handle dynamic layout adjustments before PDF rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    autoScaleText();
    calculatePerformanceRating();
});

/**
 * Automatically scales down text if it exceeds its container width.
 * Requires the container to have a fixed width and overflow: hidden.
 * The text element should have class 'auto-scale'
 */
function autoScaleText() {
    const scaleElements = document.querySelectorAll('.auto-scale');
    
    scaleElements.forEach(el => {
        const container = el.parentElement;
        if (!container) return;

        // Reset any existing transform
        el.style.transform = 'scale(1)';
        el.style.transformOrigin = 'left center';
        
        const containerWidth = container.clientWidth;
        const textWidth = el.scrollWidth;
        
        if (textWidth > containerWidth && containerWidth > 0) {
            const scale = containerWidth / textWidth;
            // Prevent it from getting illegibly small
            const finalScale = Math.max(scale, 0.5); 
            el.style.transform = `scale(${finalScale})`;
        }
    });
}

/**
 * Specific for Performance Report to calculate the overall rating circle.
 */
function calculatePerformanceRating() {
    const ratingElement = document.getElementById('overall-rating-value');
    const circleProgress = document.getElementById('overall-rating-circle');
    
    if (ratingElement && circleProgress) {
        const rating = parseFloat(ratingElement.innerText) || 0;
        // Rating is out of 5
        const percentage = (rating / 5) * 100;
        
        // Update circle stroke dasharray based on percentage
        // Assuming circle circumference is accessible or we use a conic-gradient approach
        // Let's use CSS variable for simplicity in the CSS
        document.documentElement.style.setProperty('--rating-percentage', `${percentage}%`);
        
        // Also update a text percentage if needed
        const percentageText = document.getElementById('overall-rating-percentage');
        if (percentageText) {
            percentageText.innerText = `${Math.round(percentage)}%`;
        }
    }
}
