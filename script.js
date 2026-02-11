/* script.js */


// 1. Mobile Menu Toggle
// This opens and closes the menu when the hamburger icon is tapped
function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('show');
}

// ... (Keep the rest of your Active Link, Form Submission, and Back to Top code below this) ...

// 1. Active Link Highlighter
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');

    menuItems.forEach(item => {
        if (currentLocation.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
});

/* script.js - Updated Form Submission */

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page reload

        // 1. Give the user visual feedback so they know it's working
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true; // Prevents them from clicking twice

        // 2. Get the values
        const formData = new FormData();
        formData.append("name", document.getElementById('name').value);
        formData.append("email", document.getElementById('email').value);
        formData.append("subject", document.getElementById('subject').value);
        formData.append("message", document.getElementById('message').value);

        // 3. YOUR NEW GOOGLE APPS SCRIPT URL
        // Paste the new URL you just generated from Apps Script here:
        const scriptURL = "https://script.google.com/macros/s/AKfycbx-gqFUL0urGMCJP1s9tg3qoGLas3b8mdCAmurvc9pAAVv0gKlFiaf0Nr9Uwr9oIffT/exec";

        // 4. Send the data silently in the background
        fetch(scriptURL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // 5. Success! Show a message, clear the form, reset the button
            alert("Thank you! Your enquiry has been sent successfully. Our team will contact you shortly.");
            contactForm.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error("Error:", error.message);
            alert("Something went wrong. Please try again or contact us directly at +91 81782 19164.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    });
}

/* script.js */

// ... (Keep all your existing code above this) ...

// 3. Back to Top Button Logic
const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
    // Watch the user scroll
    window.addEventListener("scroll", function() {
        // If they scroll down more than 300 pixels, show the button
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");
        } else {
            // Otherwise, hide it
            backToTopButton.classList.remove("show");
        }
    });

    // When clicked, glide back to the top
    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}