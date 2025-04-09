
let registeredUsers = [];

// Load users from localStorage if available
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('registeredUsers')) {
    registeredUsers = JSON.parse(localStorage.getItem('registeredUsers'));
  }

  initForms();
});

function initForms() {
  const signinForm = document.getElementById('signin-form');
  const createAccountForm = document.getElementById('create-account-form');

  if (signinForm) {
    signinForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      clearErrors();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      
      let isValid = true;
      
      if (!validateEmail(email)) {
        displayError('email-error', 'Please enter a valid email address');
        isValid = false;
      }
      
      if (password.trim() === '') {
        displayError('password-error', 'Password cannot be empty');
        isValid = false;
      }
      
      if (isValid) {
        
        const user = registeredUsers.find(user => user.email === email);
        
        if (!user) {
          displayError('signin-error', 'Email not found. Please create an account first.');
          return false;
        }
        
        if (user.password !== password) {
          displayError('signin-error', 'Incorrect password');
          return false;
        }
        
        // Successful login
        localStorage.setItem('currentUser', JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }));
        
        // Show success message before redirecting
        alert('Sign in successful! Welcome back, ' + user.firstName + '!');
        
        // Redirect to home page
        window.location.href = 'index.html';
      }
    });
  }
  
  // Set up create account form if present on page
  if (createAccountForm) {
    createAccountForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      clearErrors();
      
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const phone = document.getElementById('phone').value;
      
      // Validate all fields
      let isValid = true;
      
      if (firstName.trim() === '') {
        displayError('firstName-error', 'First name is required');
        isValid = false;
      }
      
      if (lastName.trim() === '') {
        displayError('lastName-error', 'Last name is required');
        isValid = false;
      }
      
      if (!validateEmail(email)) {
        displayError('email-error', 'Please enter a valid email address');
        isValid = false;
      } else if (emailExists(email)) {
        displayError('email-error', 'This email is already registered');
        isValid = false;
      }
      
      if (!validatePassword(password)) {
        displayError('password-error', 'Password does not meet requirements');
        isValid = false;
      }
      
      if (password !== confirmPassword) {
        displayError('confirmPassword-error', 'Passwords do not match');
        isValid = false;
      }
      
      if (phone && !validatePhone(phone)) {
        displayError('phone-error', 'Please enter a valid phone number');
        isValid = false;
      }
      
      if (isValid) {
        // Register the user
        const newUser = {
          firstName,
          lastName,
          email,
          password,
          phone: phone || '',
          registeredOn: new Date().toISOString()
        };
        
        // Add to registered users array
        registeredUsers.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify({
          firstName,
          lastName,
          email
        }));
        

        alert('Account created successfully! Welcome, ' + firstName + '!');
        
        window.location.href = 'index.html';
      }
    });
  }
}



function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

function validatePhone(phone) {
  
  const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
}

function emailExists(email) {
  return registeredUsers.some(user => user.email === email);
}

function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
    element.style.display = 'none';
  });
}


function isLoggedIn() {
  return localStorage.getItem('currentUser') !== null;
}


function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'signin.html';
}