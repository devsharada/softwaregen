//Function to check validation contactus form
function contactusValidation(event, formId) {
    event.preventDefault(); // Prevent form submission for validation
    // Get form by ID
    const form = document.getElementById(formId);

    // Get values from inputs within the form
    const name = form.querySelector('#cust_name').value.trim();
    const email = form.querySelector('#cust_email').value.trim();
    const mobile = form.querySelector('#cust_mobile').value.trim();
    const message = form.querySelector('#cust_message').value.trim();
    const captcha = form.querySelector('#captchaAns1').value.trim();

    // Clear previous error messages
    form.querySelector('#nameInvalid').innerText = '';
    form.querySelector('#emailInvalid').innerText = '';
    form.querySelector('#mobileInvalid').innerText = '';
    form.querySelector('#msgInvalid').innerText = '';

    // Regex patterns
    const namePattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+){0,2}$/; // Up to 2 spaces
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email validation
    const mobilePattern = /^[789]\d{9}$/; // Valid 10-digit Indian mobile number

    // Validation checks
    if (!namePattern.test(name)) {
        form.querySelector('#nameInvalid').innerText = "Please enter a valid name (only letters and up to two spaces).";
        return;
    }

    if (!emailPattern.test(email)) {
        form.querySelector('#emailInvalid').innerText = "Please enter a valid email address.";
        return;
    }

    if (!mobilePattern.test(mobile)) {
        form.querySelector('#mobileInvalid').innerText = "Please enter a valid mobile number (10 digits, starting with 7, 8, or 9).";
        return;
    }

    if (message === "") {
        form.querySelector('#msgInvalid').innerText = "Please enter a message.";
        return;
    }

    const storedCaptchaText = sessionStorage.getItem('sessCaptchaAns');
    if (storedCaptchaText != captcha) {
        alert("Please enter a valid captcha.");
        return;
    }

    // If all validations pass, submit the form
    form.submit();
}
// Function to generate captcha text
function generateCaptchaText(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaText = '';
    for (let i = 0; i < length; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captchaText;
}
// Function to draw the captcha on a canvas
function drawCaptcha(canvasId, captchaText) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext('2d');
    const textColors = ["rgb(0,0,0)", "rgb(130,130,130)"];
    const randomNumber = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px Arial';
    ctx.textBaseline = "middle";
    for (let i = 0; i < captchaText.length; i++) {
        const letterSpace = 110 / captchaText.length;
        const xInitialSpace = 7;
        ctx.save();
        ctx.translate(xInitialSpace + i * letterSpace, randomNumber(12, 24));
        if (i % 2 == 0)
            ctx.rotate(-16 * Math.PI / 180);
        else
            ctx.rotate(16 * Math.PI / 180);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }
}

// Function to initialize the captcha for a given canvas
function initCaptcha(canvasId, canvasId1 = '') {
    const captchaText = generateCaptchaText();

    sessionStorage.setItem(`sessCaptchaAns`, captchaText);
    drawCaptcha(canvasId, captchaText);
    if (canvasId1 != '')
    {
        drawCaptcha(canvasId1, captchaText);
    }
    var sessiondata = {'form_name': 'contactus', 'captchaText': captchaText};
    $.post('/session_data/index', sessiondata);
}
// Ensure this function is called with unique canvas IDs
document.addEventListener("DOMContentLoaded", function () {
    initCaptcha('captchaCanvas', 'captchaCanvas1');
});
// Function to check if the captcha is valid
function checkCaptcha(formId) {
    const form = document.getElementById(formId);
    checkIcon = form.querySelector('#captchaInvalid')
    validIcon = form.querySelector('#captchaValidIcon')
    userInput = form.querySelector('#captchaAns1')
    if (!validIcon || !userInput) {
        return false;
    }
    const storedCaptchaText = sessionStorage.getItem(`sessCaptchaAns`);
    if (userInput.value.length >= 6) {
        if (userInput.value === storedCaptchaText) {
            validIcon.style.display = 'block'; // Show the icon
            checkIcon.style.display = 'none';
            return true;
        } else {
            validIcon.style.display = 'none';
            initCaptcha('captchaCanvas', 'captchaCanvas1');
            checkIcon.style.display = 'block';
            userInput.value = '';
            return false;
        }
    } else {
        validIcon.style.display = 'none';
        return false;
    }
}
(function () {
    "use strict";
    // Easy selector helper function
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
    }
    }
    //* Easy event listener function
    const on = (type, el, listener, all = false) => {
        if (all) {
            select(el, all).forEach(e => e.addEventListener(type, listener))
        } else {
            select(el, all).addEventListener(type, listener)
    }
    }
    //Easy on scroll event listener 
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }
//Navbar links active state on scroll
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash)
                return
            let section = select(navbarlink.hash)
            if (!section)
                return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
//Scrolls to an element with header offset
    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        if (!header.classList.contains('header-scrolled')) {
            offset -= 10
        }
        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }
//Toggle .header-scrolled class to #header when page is scrolled
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }
//Back to top button
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }
//Mobile nav toggle
    on('click', '.mobile-nav-toggle', function (e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })
//Mobile nav dropdowns activate
    on('click', '.navbar .dropdown > a', function (e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
    }, true)
//Scrool with ofset on links with a class name .scrollto
    on('click', '.scrollto', function (e) {
        if (select(this.hash)) {
            e.preventDefault()
            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)
//Scroll with ofset on page load with hash links in the url
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });
//main Slider
    new Swiper('.main-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 1,
            }
        }
    });
//Clients Slider
    new Swiper('.clients-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            640: {
                slidesPerView: 4,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 40
            }
        }
    });
    //Feature Work Slider
    new Swiper('.feature-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 40
            },
            480: {
                slidesPerView: 1,
                spaceBetween: 40
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            1200: {
                slidesPerView: 4
            }
        }
    });
    //Testimonials slider
    new Swiper('.testimonials-slider', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 40
            },

            1200: {
                slidesPerView: 3,
            }
        }
    });
//Blog slider
    new Swiper('.blog-slider', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 10
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });
//Animation on scroll
    function aos_init() {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            mirror: false
        });
    }
    window.addEventListener('load', () => {
        aos_init();
    });
    //
})();
//
//career form validation
function validateInput(input) {
    const namePatternCareer = /^[a-zA-Z]+(?:\s[a-zA-Z]+){0,2}$/; // Up to 2 spaces
    const emailPatternCareer = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email validation
    const mobilePatternCareer = /^[789]\d{9}$/; // Valid 10-digit Indian mobile number
    const numericPattern = /^\d+(\.\d+)?$/;
    // Validate text inputs for non-empty value
    if (input.type === 'text' || input.type === 'email') {
        if (input.value.trim() === '') {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
    }

    // Validate email format
    if (input.type === 'email') {
        if (!emailPatternCareer.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please enter a valid email address');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            displayError(input, '');
        }
    }

    // Validate phone number (assuming 10 digits for simplicity)
    if (input.name === 'candidate_mobile') {
        if (!mobilePatternCareer.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please enter a valid 10-digit mobile number');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            displayError(input, '');
        }
    }
    // Validate Customer Name
    if (input.name === 'candidate_fname') {
        if (!namePatternCareer.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please enter a valid name (up to 2 spaces allowed)');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            displayError(input, '');
        }
    }
    if (input.name === 'candidate_lname') {
        if (!namePatternCareer.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please enter a valid name (up to 2 spaces allowed)');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            displayError(input, '');
        }
    }
    if (input.name === 'candidate_location') {
        if (!namePatternCareer.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please enter a valid name (up to 2 spaces allowed)');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
    }
    if (input.name === 'current_salary') {
        if (!numericPattern.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please Enter Numbers Only');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            displayError(input, '');
        }
    }
    if (input.name === 'expected_salary') {
        if (!numericPattern.test(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            displayError(input, 'Please Enter Numbers Only');
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            displayError(input, '');
        }
    }


    // Add more validations as needed for other fields
}
// Function to display error messages
function displayError(input, message) {
    let errorMessage = input.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message1')) {
        // Create a new error message element if it doesn't exist
        errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message1');
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
    }
    errorMessage.textContent = message;
    errorMessage.style.color = 'red'; // You can adjust the styling here
}
//