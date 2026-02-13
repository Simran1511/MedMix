/* MEDMIX HEALTHCARE - FINAL ARROW SCRIPT */

document.addEventListener('DOMContentLoaded', function() {

// --- 1. HAMBURGER MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
            if (nav.classList.contains('show')) {
                menuToggle.innerText = "✕";
            } else {
                menuToggle.innerText = "☰";
                // Reset submenus when closing main menu
                dropdowns.forEach(el => el.classList.remove('active'));
            }
        });
    }

// --- 2. ARROW BUTTON LOGIC (Enhanced Sticky Fix) ---
    const arrowButtons = document.querySelectorAll('.arrow-btn');

    arrowButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 
            e.stopPropagation();

            const parentDropdown = this.closest('.dropdown');
            
            // Toggle 'active' on the current dropdown
            const isActive = parentDropdown.classList.contains('active');
            
            // Close any other open dropdowns first (Optional: for a cleaner look)
            document.querySelectorAll('.dropdown').forEach(el => el.classList.remove('active'));

            // If it wasn't active, open it now
            if (!isActive) {
                parentDropdown.classList.add('active');
            }
        });
    });
    
// --- 3. BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById("backToTop");
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopButton.classList.add('show');
            else backToTopButton.classList.remove('show');
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


// --- 5. SOCIAL FAB TOGGLE ---
    // --- 5. SOCIAL FAB TOGGLE ---
    const socialFabToggle = document.getElementById('socialFabToggle');
    
    if (socialFabToggle) {
        socialFabToggle.addEventListener('click', function(e) {
            // Prevent default behavior
            e.preventDefault();
            
            // Toggle the 'active' class on the container parent
            this.parentElement.classList.toggle('active');
        });
        
        // Optional: Close the menu if user clicks anywhere else on the page
        document.addEventListener('click', function(e) {
            const container = document.querySelector('.social-fab-container');
            if (container.classList.contains('active') && !container.contains(e.target)) {
                container.classList.remove('active');
            }
        });
    }


  

// --- 4. FORM SUBMISSION (CONTACT & TRAINING) ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop page reload

            // A. GET FORM VALUES
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value; // <--- NEW PHONE INPUT
            const subject = document.getElementById('subject').value; 
            const message = document.getElementById('message').value;

            // B. VALIDATION LOGIC
            // Check if Phone OR Email is empty
            if (!email || !phone) {
                alert("Please fill in both Email and Phone Number.");
                return; 
            }

            // STRICT PHONE CHECK: Must be exactly 10 digits
            // (The HTML pattern handles letters, this handles length)
            if (phone.length !== 10) {
                alert("Please enter a valid 10-digit mobile number.");
                return; 
            }

            // Button Loading Effect
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Processing...";
            submitBtn.disabled = true;

            // C. DETECT SOURCE (Training vs Contact)
            const sourceElement = document.getElementById('source');
            const source = sourceElement ? sourceElement.value : "contact"; 

            // D. PREPARE DATA FOR GOOGLE SHEET
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone); // <--- SENDING PHONE DATA
            formData.append("subject", subject);
            formData.append("message", message);
            formData.append("source", source); 

            // E. GOOGLE SCRIPT URL
            // ⚠️ IMPORTANT: Replace this with your NEWEST Web App URL ending in /exec
            const scriptURL = "https://script.google.com/macros/s/AKfycbwHbqKMixi0tOUOQ2QlpAaAipYrKidWbBV8c29OOgB2vE9CF-NAAedVGWRio7lRsgij/exec";

            // F. SEND DATA
            fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                // SUCCESS! OPEN CONFIRMATION PAGE
                submitBtn.innerText = "Success!";
                
                // Open a new blank tab
                const newWindow = window.open("", "_blank");
                
                // Write the "Receipt" HTML into that new tab
                newWindow.document.write(`
                    <html>
                    <head>
                        <title>Enquiry Submitted | Medmix Healthcare</title>
                        <style>
                            body { font-family: 'Segoe UI', sans-serif; text-align: center; padding: 40px; background: #f0f4f8; }
                            .card { background: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-top: 5px solid #003366; }
                            h1 { color: #003366; margin-bottom: 10px; }
                            p { color: #666; font-size: 16px; }
                            .details { text-align: left; background: #f9fbfd; padding: 25px; border-radius: 8px; margin-top: 30px; border: 1px solid #e1e4e8; }
                            .row { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; display: flex; justify-content: space-between; }
                            .row:last-child { border-bottom: none; }
                            strong { color: #333; }
                            .btn { display: inline-block; margin-top: 30px; padding: 12px 25px; background: #dc3545; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; transition: background 0.3s; }
                            .btn:hover { background: #c82333; }
                            .check-icon { font-size: 50px; color: #28a745; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="check-icon">✓</div>
                            <h1>Enquiry Sent Successfully!</h1>
                            <p>Thank you, <strong>${name}</strong>. We have received your details.</p>
                            
                            <div class="details">
                                <div class="row"><strong>Department:</strong> <span>${source === 'training' ? 'Training Institute' : 'General Enquiry'}</span></div>
                                <div class="row"><strong>Name:</strong> <span>${name}</span></div>
                                <div class="row"><strong>Contact:</strong> <span>${phone}</span></div>
                                <div class="row"><strong>Email:</strong> <span>${email}</span></div>
                                <div class="row"><strong>Interest:</strong> <span>${subject}</span></div>
                                <div class="row" style="display:block"><strong>Your Message:</strong><br><span style="display:block; margin-top:5px; color:#555;">${message}</span></div>
                            </div>

                            <p style="margin-top:20px; font-size: 14px; color:#999;">Our team will review your enquiry and contact you shortly.</p>
                            <a href="#" onclick="window.close()" class="btn">Close Window</a>
                        </div>
                    </body>
                    </html>
                `);

                // Reset the original form on the main page
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Something went wrong. Please check your internet connection.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

// --- AUTOMATICALLY HIGHLIGHT ACTIVE NAV LINK ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Get the current page URL path (e.g., "/index.html" or just "/")
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';

    // 2. Select all nav links
    const navLinks = document.querySelectorAll('.nav-link');

    // 3. Loop through links and check if they match the current page
    navLinks.forEach(link => {
        // Get the href of the link (e.g., "index.html")
        const linkPage = link.getAttribute('href');

        // If the link matches the current page, make it active
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});