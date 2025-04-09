
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotalElement = document.getElementById('checkout-total');
    
    
    loadCartTotal();
    
   
    function getCartItems() {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    }
    
    
    function loadCartTotal() {
      const cart = getCartItems();
      let total = 0;
      
      if (cart.length > 0) {
        
        cart.forEach(item => {
          total += item.price;
        });
      }
      
      
      if (checkoutTotalElement) {
        checkoutTotalElement.textContent = total.toLocaleString('en-IN');
      }
    }
  
   
    addErrorElements();
  
   
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
       
        clearErrors();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;
        const country = document.getElementById('country').value;
        
       
        let isValid = true;
        
        if (name.trim() === '') {
          displayError('name-error', 'Full name is required');
          isValid = false;
        }
        
        if (!validateEmail(email)) {
          displayError('email-error', 'Please enter a valid email address');
          isValid = false;
        }
        
        if (!validatePhone(phone)) {
          displayError('phone-error', 'Please enter a valid 10-digit phone number');
          isValid = false;
        }
        
        if (address.trim() === '') {
          displayError('address-error', 'Shipping address is required');
          isValid = false;
        }
        
        if (city.trim() === '') {
          displayError('city-error', 'City is required');
          isValid = false;
        }
        
        if (state.trim() === '') {
          displayError('state-error', 'State is required');
          isValid = false;
        }
        
        if (!validateZip(zip)) {
          displayError('zip-error', 'Please enter a valid 6-digit PIN code');
          isValid = false;
        }
        
        if (country.trim() === '') {
          displayError('country-error', 'Country is required');
          isValid = false;
        }
        
        if (isValid) {
          
          const orderDetails = {
            name,
            email,
            phone,
            address,
            city,
            state,
            zip,
            country,
            paymentMethod: document.getElementById('payment').value,
            totalAmount: parseFloat(checkoutTotalElement.textContent.replace(/,/g, '')),
            items: getCartItems(),
            orderDate: new Date().toISOString()
          };
          
          
          saveOrderToHistory(orderDetails);
          
          
          localStorage.removeItem('cart');
          
         
          alert('Thank you for your purchase! Your order details will be sent to your email shortly.');
          
      
          window.location.href = 'index.html';
        }
      });
    }
  });
  
  
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validatePhone(phone) {
    
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }
  
  function validateZip(zip) {
    
    const zipRegex = /^\d{6}$/;
    return zipRegex.test(zip);
  }
  
  function addErrorElements() {
    
    const inputFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
    
    inputFields.forEach(field => {
      const input = document.getElementById(field);
      if (input) {
       
        const existingError = document.getElementById(`${field}-error`);
        if (!existingError) {
          const errorElement = document.createElement('p');
          errorElement.id = `${field}-error`;
          errorElement.className = 'error-message';
          errorElement.style.color = 'red';
          errorElement.style.fontSize = '14px';
          errorElement.style.marginTop = '5px';
          errorElement.style.display = 'none';
          
          
          input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
      }
    });
    
    
    const submitButton = document.querySelector('#checkout-form button[type="submit"]');
    if (submitButton && !document.getElementById('form-error')) {
      const formError = document.createElement('p');
      formError.id = 'form-error';
      formError.className = 'error-message';
      formError.style.color = 'red';
      formError.style.fontSize = '14px';
      formError.style.marginTop = '10px';
      formError.style.display = 'none';
      
      submitButton.parentNode.insertBefore(formError, submitButton);
    }
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
  
  function saveOrderToHistory(orderDetails) {
    
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    
    
    orderHistory.push({
      ...orderDetails,
      orderId: generateOrderId(),
      status: 'Processing'
    });
    
    
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }
  
  function generateOrderId() {
    
    const randomPart = Math.random();
    
    return `{randomPart}`;
  }