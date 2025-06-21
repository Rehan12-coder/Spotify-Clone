/**
 * Spotify Login/Signup Page JavaScript
 * Handles all interactive functionality and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLink = document.getElementById('toggleLink');
    const toggleText = document.getElementById('toggleText');
    const formTitle = document.getElementById('formTitle');
    const toggleFormBtn = document.getElementById('toggleForm');
    const hamburger = document.querySelector('.hamburger');
    const closeBtn = document.querySelector('.close');
    const leftPanel = document.querySelector('.left');
    const socialButtons = document.querySelectorAll('.social-btn');
    const passwordInput = document.getElementById('password');
    const signupPasswordInput = document.getElementById('signupPassword');
    const passwordToggle = document.createElement('span');
    
    // Initialize page state
    let isLoginForm = true;
    let passwordVisible = false;

    // Add password toggle eye icon
    function addPasswordToggle() {
        passwordToggle.innerHTML = '👁️';
        passwordToggle.style.cursor = 'pointer';
        passwordToggle.style.marginLeft = '10px';
        passwordToggle.style.fontSize = '16px';
        passwordToggle.title = 'Show password';
        
        passwordInput.parentNode.appendChild(passwordToggle);
        signupPasswordInput.parentNode.appendChild(passwordToggle.cloneNode(true));
        
        document.querySelectorAll('.form-group').forEach(group => {
            if (group.querySelector('input[type="password"]')) {
                const toggle = group.querySelector('span');
                toggle.addEventListener('click', togglePasswordVisibility);
            }
        });
    }

    // Toggle password visibility
    function togglePasswordVisibility(e) {
        const input = e.target.previousElementSibling;
        passwordVisible = !passwordVisible;
        
        if (passwordVisible) {
            input.type = 'text';
            e.target.innerHTML = '👁️';
            e.target.title = 'Hide password';
        } else {
            input.type = 'password';
            e.target.innerHTML = '👁️';
            e.target.title = 'Show password';
        }
    }

    // Toggle between login and signup forms
    function toggleForms() {
        isLoginForm = !isLoginForm;
        
        if (isLoginForm) {
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
            formTitle.textContent = 'Log in to Spotify';
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleLink">Sign up for Spotify</a>';
            toggleFormBtn.textContent = 'Sign up';
            document.title = 'Spotify | Login';
            updateMetaDescription('Log in to your Spotify account to access your music, playlists, and podcasts.');
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
            formTitle.textContent = 'Sign up for Spotify';
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLink">Log in</a>';
            toggleFormBtn.textContent = 'Log in';
            document.title = 'Spotify | Sign Up';
            updateMetaDescription('Sign up for Spotify to enjoy millions of songs, podcasts, and playlists.');
        }
        
        // Re-bind the event listener for the new toggle link
        document.getElementById('toggleLink').addEventListener('click', function(e) {
            e.preventDefault();
            toggleForms();
        });
    }

    // Update meta description for SEO
    function updateMetaDescription(description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
    }

    // Validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate password strength
    function validatePassword(password) {
        return password.length >= 8;
    }

    // Show form validation error
    function showError(input, message) {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#ff4d4d';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        error.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        
        input.style.borderColor = '#ff4d4d';
    }

    // Clear form validation error
    function clearError(input) {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        input.style.borderColor = '#535353';
    }

    // Handle login form submission
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        let isValid = true;

        // Validate email
        if (!email) {
            showError(document.getElementById('email'), 'Email or username is required');
            isValid = false;
        } else if (email.includes('@') && !validateEmail(email)) {
            showError(document.getElementById('email'), 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(document.getElementById('email'));
        }

        // Validate password
        if (!password) {
            showError(document.getElementById('password'), 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(document.getElementById('password'), 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError(document.getElementById('password'));
        }

        if (isValid) {
            // Simulate successful login
            console.log('Login submitted:', { email, password });
            alert('Login successful! Redirecting to home page...');
            window.location.href = 'index.html';
        }
    }

    // Handle signup form submission
    function handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const displayName = document.getElementById('displayName').value.trim();
        const day = document.getElementById('dobDay').value;
        const month = document.getElementById('dobMonth').value;
        const year = document.getElementById('dobYear').value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const terms = document.getElementById('terms').checked;
        
        let isValid = true;

        // Validate email
        if (!email) {
            showError(document.getElementById('signupEmail'), 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(document.getElementById('signupEmail'), 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(document.getElementById('signupEmail'));
        }

        // Validate password
        if (!password) {
            showError(document.getElementById('signupPassword'), 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(document.getElementById('signupPassword'), 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError(document.getElementById('signupPassword'));
        }

        // Validate display name
        if (!displayName) {
            showError(document.getElementById('displayName'), 'Display name is required');
            isValid = false;
        } else {
            clearError(document.getElementById('displayName'));
        }

        // Validate date of birth
        if (!day || !month || !year) {
            showError(document.getElementById('dobDay'), 'Please enter a valid date of birth');
            isValid = false;
        } else {
            clearError(document.getElementById('dobDay'));
        }

        // Validate gender
        if (!gender) {
            const genderError = document.querySelector('.gender-selection .error-message') || document.createElement('div');
            genderError.className = 'error-message';
            genderError.style.color = '#ff4d4d';
            genderError.style.fontSize = '12px';
            genderError.style.marginTop = '5px';
            genderError.textContent = 'Please select a gender';
            
            if (!document.querySelector('.gender-selection .error-message')) {
                document.querySelector('.gender-selection').appendChild(genderError);
            }
            isValid = false;
        } else {
            const existingError = document.querySelector('.gender-selection .error-message');
            if (existingError) existingError.remove();
        }

        // Validate terms
        if (!terms) {
            showError(document.getElementById('terms'), 'You must agree to the terms and conditions');
            isValid = false;
        } else {
            clearError(document.getElementById('terms'));
        }

        if (isValid) {
            // Simulate successful signup
            console.log('Signup submitted:', { 
                email, 
                password, 
                displayName, 
                dob: `${day}/${month}/${year}`, 
                gender: gender.value,
                terms
            });
            alert('Account created successfully! Redirecting to home page...');
            window.location.href = 'index.html';
        }
    }

    // Initialize event listeners
    function initEventListeners() {
        // Form toggling
        toggleLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleForms();
        });
        
        toggleFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleForms();
        });

        // Form submissions
        loginForm.addEventListener('submit', handleLogin);
        signupForm.addEventListener('submit', handleSignup);

        // Navigation
        hamburger.addEventListener('click', () => {
            leftPanel.style.left = '0';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when panel is open
        });

        closeBtn.addEventListener('click', () => {
            leftPanel.style.left = '-110%';
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Social login buttons
        socialButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
                alert(`Redirecting to ${provider} authentication...`);
                // In a real app, this would redirect to OAuth flow
            });
        });

        // Forgot password
        document.querySelector('.forgot-password').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Redirecting to password reset page...');
            // In a real app, this would redirect to password reset flow
        });

        // Real-time validation for email fields
        document.getElementById('email').addEventListener('input', function() {
            if (this.value.includes('@') && !validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });

        document.getElementById('signupEmail').addEventListener('input', function() {
            if (!validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });

        // Real-time password strength feedback
        document.getElementById('password').addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 8) {
                showError(this, 'Password must be at least 8 characters');
            } else {
                clearError(this);
            }
        });

        document.getElementById('signupPassword').addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 8) {
                showError(this, 'Password must be at least 8 characters');
            } else {
                clearError(this);
            }
        });
    }

    // Initialize the page
    function init() {
        addPasswordToggle();
        initEventListeners();
        updateMetaDescription('Log in to your Spotify account to access your music, playlists, and podcasts.');
        
        // Set initial page title
        document.title = 'Spotify | Login';
        
        // Add canonical URL for SEO
        const canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = window.location.href;
        document.head.appendChild(canonicalLink);
        
        // Add viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            viewportMeta.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(viewportMeta);
        }
    }

    // Start the application
    init();
});