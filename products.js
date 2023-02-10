"use strict";

const productContainer = document.querySelector("section.products"),
  navMenu = document.querySelector("header .links-section .mobile-menu"),
  mobileNav = document.querySelector(".links-section .mobile-menu nav"),
  overlay = document.createElement("div"),
  closeMobileNav = document.createElement("i");





let carts = [];
let productsLocal = localStorage.getItem("products");
if (productsLocal !== null) {
  carts = JSON.parse(productsLocal);

  carts.forEach((cart) => {
    cart.thumbnailImg = cart.thumbnailImg.replace("-thumbnail", "");
  });
  updateList();
}





let hasCheckOutButton = localStorage.getItem("hasCheckOutButton");
if (hasCheckOutButton === null) {
  hasCheckOutButton = false;
}





function updateList() {
  productContainer.textContent = "";
  if (carts.length === 0) {
    // create message if there were no products
    let span = document.createElement("span");
    span.textContent = "Your cart is empty.";
    span.className = "empty";
    productContainer.appendChild(span);

    productContainer.style.height = "100%";
  } else {
    productContainer.style.height = "";
  }

  carts.forEach((cart) => {
    addCart(cart);
  });
}
updateList();





function addCart(cart) {
  let total = ` $${cart.price * cart.numberOfProducts}.00`;

  // Product container
  let productContent = document.createElement("div");
  productContent.classList.add("product");
  productContainer.appendChild(productContent);

  // Thumbnail img
  let thumbnailImg = document.createElement("img");
  thumbnailImg.src = cart.thumbnailImg;
  productContent.appendChild(thumbnailImg);

  // content product element
  let contentProduct = document.createElement("div");
  contentProduct.classList.add("product-content");
  productContent.appendChild(contentProduct);

  // title
  let title = document.createElement("p");
  title.textContent = cart.title;
  contentProduct.appendChild(title);

  // price & total price
  let price = document.createElement("span");
  price.classList.add("price");
  price.textContent = `$${cart.price} x ${cart.numberOfProducts}`;
  contentProduct.appendChild(price);
  let totalPrice = document.createElement("b");
  totalPrice.textContent = total;
  price.appendChild(totalPrice);

  // delete icon
  let deleteProduct = document.createElement("i");
  deleteProduct.className = "bi bi-trash-fill";
  productContent.appendChild(deleteProduct);

  // id
  productContent.setAttribute("data-id", cart.id);

  Array.from(productContainer.children).forEach((ele) => {
    if (ele.classList.contains("empty")) ele.remove();
  });

  deleteProductFun(cart.id, deleteProduct);
}





function deleteProductFun(cartId, button) {
  button.addEventListener("click", () => {
    // delete product from list who clicked on delete icon
    carts = carts.filter((cart) => cart.id !== cartId);
    localStorage.setItem("products", JSON.stringify(carts));
    updateList();
  });
}





// mobile nav
overlay.className = "overlay";
document.body.appendChild(overlay);
closeMobileNav.className = "bi bi-x close-mobile-nav";
closeMobileNav.style.width = "fit-content";





navMenu.addEventListener("click", () => {
  overlay.style.display = "block";
  mobileNav.prepend(closeMobileNav);
  mobileNav.classList.add("active");
});

overlay.addEventListener("click", (e) => {
  e.target.style.display = "none";
  mobileNav.classList.remove("active");
});






window.addEventListener("click", (e) => {
  // close mobile overlay
  if (e.target.classList.contains('close-mobile-nav')) {
    overlay.style.display = 'none'
    mobileNav.classList.remove('active')
  }
});