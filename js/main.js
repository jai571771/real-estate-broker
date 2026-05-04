document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header & Mobile Nav
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // 2. Property Modal Logic
    const modal = document.getElementById('property-modal');
    const modalClose = document.getElementById('modal-close');
    const openEnquiryBtns = document.querySelectorAll('.open-enquiry-btn');
    
    // Elements to update in modal
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalLocation = document.getElementById('modal-location');
    const modalType = document.getElementById('modal-type');
    const modalFeatures = document.getElementById('modal-features');
    const propertyInterestInput = document.getElementById('property_interest');

    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.property-card');
            
            // Extract data from card to populate modal
            const imgSrc = card.querySelector('.property-img').src;
            const title = card.querySelector('.property-title').textContent;
            const price = card.querySelector('.property-price').textContent;
            const location = card.querySelector('.property-location').textContent.trim();
            const type = card.querySelector('.property-type').textContent;
            const featuresHtml = card.querySelector('.property-features').innerHTML;

            // Populate modal
            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalPrice.textContent = price;
            modalLocation.textContent = location;
            modalType.textContent = type;
            modalFeatures.innerHTML = featuresHtml;
            
            // Set hidden field in form for when user clicks Enquire from modal
            propertyInterestInput.value = `${title} (${location}) - ${price}`;

            // Open Modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 3. Navigate to Form from Modal
    document.querySelector('.open-enquiry-btn').addEventListener('click', () => {
        closeModal();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        // Auto select requirement based on property type (simple heuristic)
        const type = modalType.textContent.toLowerCase();
        const reqSelect = document.getElementById('requirement');
        if (type.includes('commercial')) {
            reqSelect.value = 'Buy Commercial';
        } else if (type.includes('villa') || type.includes('mansion')) {
            reqSelect.value = 'Buy Villa';
        } else {
            reqSelect.value = 'Buy Apartment';
        }
    });

    // 4. WhatsApp Form Submission Redirect
    const form = document.getElementById('enquiry-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

    // Replace with the actual broker WhatsApp number (include country code without +)
    const brokerWhatsAppNumber = "917397417118"; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const requirement = document.getElementById('requirement').value;
        const budget = document.getElementById('budget').value;
        const location = document.getElementById('location').value.trim();
        const message = document.getElementById('message').value.trim();
        const propertyInterest = document.getElementById('property_interest').value;

        // Show loading/success state briefly
        submitBtn.style.display = 'none';
        successMsg.classList.remove('hidden');

        try {
            // Send data to the backend API to securely store the lead
            await fetch('/api/enquire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, phone, email, requirement, budget, location, message, property_interest: propertyInterest
                })
            });
            console.log("Lead successfully saved to database!");
        } catch (err) {
            console.error("Failed to save lead to database. Continuing to WhatsApp redirect anyway.", err);
        }

        // Construct WhatsApp Message
        let waMessage = `*New Real Estate Enquiry*\n\n`;
        waMessage += `*Name:* ${name}\n`;
        waMessage += `*Phone:* ${phone}\n`;
        if (email) waMessage += `*Email:* ${email}\n`;
        waMessage += `*Requirement:* ${requirement}\n`;
        waMessage += `*Budget:* ${budget}\n`;
        waMessage += `*Location:* ${location}\n`;
        
        if (propertyInterest) {
            waMessage += `*Interested In:* ${propertyInterest}\n`;
        }

        if (message) {
            waMessage += `\n*Message:*\n${message}`;
        }

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(waMessage);
        
        // Create WhatsApp API URL
        const waUrl = `https://wa.me/${brokerWhatsAppNumber}?text=${encodedMessage}`;

        // Redirect to WhatsApp after a short delay for better UX
        setTimeout(() => {
            window.open(waUrl, '_blank');
            
            // Reset form UI after redirect
            setTimeout(() => {
                form.reset();
                submitBtn.style.display = 'flex';
                successMsg.classList.add('hidden');
                propertyInterestInput.value = ''; // clear hidden field
            }, 2000);
            
        }, 800);
    });
});
