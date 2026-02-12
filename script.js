/* MEDMIX HEALTHCARE - MAIN SCRIPT 
   Updated: handling Training & Contact forms + Success Page 
*/

// --- 1. MOBILE MENU TOGGLE ---
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        
        // Change icon from ☰ to X
        if (nav.classList.contains('show')) {
            menuToggle.innerText = "✕";
        } else {
            menuToggle.innerText = "☰";
        }
    });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('show')) {
            nav.classList.remove('show');
            menuToggle.innerText = "☰";
        }
    });
});


// --- 2. BACK TO TOP BUTTON ---
const backToTopButton = document.getElementById("backToTop");

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// --- 3. FORM SUBMISSION (CONTACT & TRAINING) ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page reload

        // Button Loading Effect
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        // A. GET FORM VALUES
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value; // Works for both Text Input and Dropdown
        const message = document.getElementById('message').value;

        // B. DETECT SOURCE (Training vs Contact)
        // We look for the hidden <input id="source"> tag.
        // If it exists (Training page), we use its value. If not, we default to "contact".
        const sourceElement = document.getElementById('source');
        const source = sourceElement ? sourceElement.value : "contact"; 

        // C. PREPARE DATA FOR GOOGLE SHEET
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("subject", subject);
        formData.append("message", message);
        formData.append("source", source); // Sends the flag to Google Script

        // D. GOOGLE SCRIPT URL
        // ⚠️ IMPORTANT: Replace this with your NEWEST Web App URL ending in /exec
        const scriptURL = "https://script.google.com/macros/s/AKfycbwuLVh4DRgrold_YpTN3wDIfP1cJtD09PS94-7V4HufYJxJWd-xlg75aQT6zgMCqTtY/exec";

        // E. SEND DATA
        fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // F. SUCCESS! OPEN CONFIRMATION PAGE
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
                            <div class="row"><strong>Contact:</strong> <span>${email}</span></div>
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