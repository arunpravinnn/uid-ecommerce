
let cart = [];

function getCartItems() {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
}


function addToCart(product) {
    
    cart = getCartItems();
  
    cart.push(product);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert(`${product.name} has been added to your cart!`);
    
    
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }
}


function removeFromCart(index) {
    cart = getCartItems();
    
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        return removedItem;
    }
    return null;
}


function displayCartItems() {
    cart = getCartItems();
    const cartContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    if (!cartContainer || !totalPriceElement) return;
    
    cartContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        totalPriceElement.textContent = '0.00';
        
        
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    } else {
       
        if (checkoutBtn) checkoutBtn.style.display = 'flex';
    }

    
    const cartTable = document.createElement('div');
    cartTable.classList.add('cart-table');

    let total = 0;

    
    cart.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item-row');
        itemRow.innerHTML = `
            <div class="cart-cell image-col">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            </div>
            <div class="cart-cell name-col">${item.name}</div>
            <div class="cart-cell price-col">₹${item.price.toFixed(2)}</div>
            <div class="cart-cell action-col">
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartTable.appendChild(itemRow);
        total += item.price; 
    });

    cartContainer.appendChild(cartTable);
    totalPriceElement.textContent = total.toFixed(2); 

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const removedItem = removeFromCart(index);
            if (removedItem) {
                alert(`${removedItem.name} has been removed from your cart!`);
            }
        });
    });
}


function checkout() {
    alert('Proceeding to checkout!');
 
     window.location.href = 'checkout.html';
}

// EVENT - HANDLING : EVENT LISTENER
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    displayCartItems();
});