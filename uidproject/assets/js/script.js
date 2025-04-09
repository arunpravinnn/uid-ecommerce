
'use strict';


const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", function () {
  navbar.classList.toggle("active");
});


const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  header.classList[this.scrollY > 50 ? "add" : "remove"]("active");
});


document.querySelectorAll("[data-button]").forEach(button => {
  button.addEventListener("click", function () {
    const action = this.dataset.button;
    if (action === "shop") {
      window.location.href = "products.html";
    } else if (action === "signup") {
      window.location.href = "signup.html";
    } else if (action === "login") {
      window.location.href = "signin.html";
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const productLinks = document.querySelectorAll(".product-link");
  productLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const productId = this.dataset.id;
      window.location.href = `product.html?id=${productId}`;
    });
  });
});

