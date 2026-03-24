/**
 * Global App Logic for HomeChef Sydney MVP
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight Active Nav Link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // In local dev without server, path might just be index.html or root
    navLinks.forEach(link => {
        if(currentPath.includes(link.getAttribute('href'))) {
            // Already handled in HTML for some pages, but good for dynamic routing
        }
    });

    // 2. Mobile Menu Toggle
    if (window.innerWidth <= 768) { setupMobileMenu(); }
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
            setupMobileMenu();
        }
    });

    // 3. Dynamic Chef Data for Subscription Form
    setupDynamicSubscription();

    // 4. Phone Number Auto-formatter
    setupPhoneFormatter();

    // 5. Form Submissions
    setupFormValidationAndSubmission('subscribe-form');
    setupFormValidationAndSubmission('chef-application');
});

function setupMobileMenu() {
    const headerContainer = document.querySelector('.header-container');
    const navLinks = document.querySelector('.nav-links');
    
    if(!headerContainer || !navLinks) return;
    
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<i class="ph ph-list" style="font-size: 28px;"></i>';
    menuBtn.style.background = 'none';
    menuBtn.style.border = 'none';
    menuBtn.style.cursor = 'pointer';
    menuBtn.style.color = 'var(--text-main)';
    
    // Basic mobile nav styles
    navLinks.style.display = 'none';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '80px';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'var(--bg-white)';
    navLinks.style.padding = '24px';
    navLinks.style.boxShadow = 'var(--shadow-md)';
    navLinks.style.borderBottom = '1px solid var(--border)';
    
    headerContainer.appendChild(menuBtn);
    
    menuBtn.addEventListener('click', () => {
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
        menuBtn.innerHTML = isVisible ? '<i class="ph ph-list" style="font-size: 28px;"></i>' : '<i class="ph ph-x" style="font-size: 28px;"></i>';
    });
}

function setupPhoneFormatter() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, ''); // strip non-digits
            
            // Format for Australian Mobile: 04XX XXX XXX
            if (x.length > 4 && x.length <= 7) {
                x = x.slice(0, 4) + ' ' + x.slice(4);
            } else if (x.length > 7) {
                x = x.slice(0, 4) + ' ' + x.slice(4, 7) + ' ' + x.slice(7, 10);
            }
            e.target.value = x.slice(0, 12); // length limit to 12 chars
        });
    });
}

const CHEF_DB = {
    'priya': {
        name: 'Chef Priya',
        details: 'North Indian • $75/week • 5 Meals',
        img: 'https://images.unsplash.com/photo-1556910103-1c02745a8731?w=150&q=80'
    },
    'marco': {
        name: 'Chef Marco',
        details: 'Italian • $80/week • 5 Meals',
        img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&q=80'
    }
}

function setupDynamicSubscription() {
    const summaryCard = document.getElementById('dynamic-chef-summary');
    if (!summaryCard) return;

    const urlParams = new URLSearchParams(window.location.search);
    const chefId = urlParams.get('chef');

    if (chefId && CHEF_DB[chefId.toLowerCase()]) {
        const chef = CHEF_DB[chefId.toLowerCase()];
        document.getElementById('summary-img').src = chef.img;
        document.getElementById('summary-img').alt = chef.name;
        document.getElementById('summary-name').innerText = `You're subscribing to: ${chef.name}`;
        document.getElementById('summary-details').innerText = chef.details;
        document.getElementById('chef_id').value = chefId.toLowerCase();
    } else {
        // Fallback UI if no ?chef= param provided
        summaryCard.style.display = 'none';
        document.getElementById('chef_id').value = 'none_selected';
    }
}

function setupFormValidationAndSubmission(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form is valid because standard HTML5 validation passes before submit event.
        // Change button state to loading
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Processing...';
        btn.disabled = true;

        // Collect FormData
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(`Submitting ${formId} data:`, data);

        // MOCK API POST: In reality, post this to the Airtable Webhook URL
        // Example: fetch('https://hook.us1.make.com/xxxxxx', { method: 'POST', body: JSON.stringify(data) })
        
        // For MVP frontend demo, simulate network delay and show success
        setTimeout(() => {
            // Hide form, show success box
            form.style.display = 'none';
            const successBox = document.getElementById('success-box');
            if(successBox) successBox.style.display = 'block';
            
            // Scroll to the top of the message
            window.scrollTo({ top: successBox.offsetTop - 100, behavior: 'smooth' });
        }, 1500);
    });
}

// Add simple spin animation CSS globally via JS for the loading button
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
