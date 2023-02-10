"use strict";

const sliderImages = document.querySelectorAll("main .slider .images ul li");
const sliderShowImg = document.querySelector(".slider .show-img-holder img");
const cartIcon = document.querySelector(".container header .user-options i");
const cartsMenu = document.querySelector(".container header .carts-menu");
const increaseProduct = document.querySelector(".counter button:first-child");
const decreaseProduct = document.querySelector(".counter button:last-child");
const numberOfProducts = document.querySelector(".counter .the-number");
const showNumOfProd = document.querySelector(
  ".user-options i .number-of-products"
);
const addToCart = document.getElementById("add-to-cart-button");
const titleProduct = document.querySelector("main .request-products h2");
const priceProduct = document.querySelector(".price-container .price");
const cartsPlace = document.querySelector(" header .carts-menu .carts");

// Add active class on img
let currentImg = 0;
let currentImgLocal = localStorage.getItem("currentImg");
if (currentImgLocal !== null) {
  currentImg = parseInt(currentImgLocal);
  sliderImages.forEach((img) => {
    if (img.classList.contains("active")) {
      img.classList.remove("active");
    }
  });

  sliderImages[currentImg].classList.add("active");
  sliderShowImg.src = sliderImages[currentImg].children[0].src.replace(
    "-thumbnail",
    ""
  );
}

sliderImages.forEach((img, i) => {
  img.addEventListener("click", () => {
    sliderImages.forEach((img) => {
      if (img.classList.contains("active")) img.classList.remove("active");
    });

    img.classList.add("active");
    currentImg = i;
    localStorage.setItem("currentImg", currentImg);

    sliderShowImg.src = img.children[0].src.replace("-thumbnail", "");

    thumbnailImg = img.children[0].src;
  });
});

// switch cart menu
let hasCheckOutButton = false;
localStorage.setItem("hasCheckOutButton", hasCheckOutButton);
let checkOutButton = document.createElement("a");
checkOutButton.type = "button";
checkOutButton.textContent = "Checkout";
checkOutButton.classList.add("checkout-button");
let anchorProducts = document.createElement("a");
checkOutButton.href = "products.html";

cartIcon.addEventListener("click", () => {
  cartsMenu.classList.contains("open")
    ? cartsMenu.classList.toggle("open")
    : cartsMenu.classList.toggle("open");

  // Add check out button inside cart menu
  Array.from(cartsPlace.children).forEach((ele) => {
    if (ele.classList.contains("product") && !hasCheckOutButton) {
      cartsMenu.appendChild(checkOutButton);
      hasCheckOutButton = true;
      localStorage.setItem("hasCheckOutButton", hasCheckOutButton);
    }
  });
});

// increase one to the number of products
increaseProduct.addEventListener("click", () => {
  let productsNumber = parseInt(numberOfProducts.textContent);
  productsNumber++;
  numberOfProducts.textContent = productsNumber;
});

// decrease one to the number of products
decreaseProduct.addEventListener("click", () => {
  let productsNumber = parseInt(numberOfProducts.textContent);
  if (productsNumber > 0) {
    productsNumber--;
    numberOfProducts.textContent = productsNumber;
  }
});

let thumbnailImg = sliderImages[0].children[0].src;
let carts = [];
let productsLocal = localStorage.getItem("products");
if (productsLocal !== null) {
  carts = JSON.parse(productsLocal);
  updateList();
}

addToCart.addEventListener("click", () => {
  if (
    cartsPlace.children.length === 1 &&
    cartsPlace.children[0].classList.contains("empty")
  ) {
    cartsPlace.children[0].remove();
    console.log(cartsPlace.children);
  }

  addCartToArr();
  updateList();
  clickedEffect(addToCart);

  [...cartsPlace.children].forEach((ele) => {
    if (ele.classList.contains("product") && !hasCheckOutButton) {
      cartsMenu.appendChild(checkOutButton);
      hasCheckOutButton = true;
      localStorage.setItem("hasCheckOutButton", hasCheckOutButton);
    }
  });
});

function clickedEffect(ele) {
  ele.style.transition = "0.1s";
  ele.classList.add("clicked");

  setTimeout(() => {
    ele.classList.remove("clicked");
    ele.style.transition = "";
  }, 100);
}

function addCartToArr() {
  if (numberOfProducts.textContent !== "0") {
    let cart = {
      id: Date.now(),
      thumbnailImg: thumbnailImg,
      numberOfProducts: numberOfProducts.textContent,
      title: titleProduct.textContent,
      price: priceProduct.textContent.slice(1),
    };
    carts.push(cart);
    localStorage.setItem("products", JSON.stringify(carts));
    addCart(cart);
  }
}

function addCart(cart) {
  let total = ` $${cart.price * cart.numberOfProducts}.00`;

  // Product container
  let productContainer = document.createElement("div");
  productContainer.classList.add("product");
  cartsPlace.appendChild(productContainer);

  // Thumbnail img
  let thumbnailImg = document.createElement("img");
  thumbnailImg.src = cart.thumbnailImg;
  productContainer.appendChild(thumbnailImg);

  // content product element
  let contentProduct = document.createElement("div");
  contentProduct.classList.add("product-content");
  productContainer.appendChild(contentProduct);

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
  productContainer.appendChild(deleteProduct);

  // id
  productContainer.setAttribute("data-id", cart.id);

  Array.from(cartsPlace.children).forEach((ele) => {
    if (ele.classList.contains("empty")) ele.remove();
  });

  deleteProductFun(cart.id, deleteProduct);
}

function deleteProductFun(cartId, button) {
  button.addEventListener("click", () => {
    // delete product from list who clicked on delete icon
    carts = carts.filter((cart) => cart.id !== cartId);
    localStorage.setItem("products", JSON.stringify(carts));

    if (cartsPlace.children.length === 1 && hasCheckOutButton) {
      checkOutButton.remove();
      hasCheckOutButton = false;
      localStorage.setItem("hasCheckOutButton", hasCheckOutButton);
    }
    updateList();
  });
}

function showNumbOfProdFun() {
  Array.from(cartsPlace.children).forEach((ele) => {
    if (ele.classList.contains("product")) {
      showNumOfProd.style.display = "block";
      showNumOfProd.textContent = cartsPlace.children.length;
    } else {
      showNumOfProd.style.display = "none";
      showNumOfProd.textContent = cartsPlace.children.length;
    }
  });
}

function updateList() {
  cartsPlace.textContent = "";
  if (carts.length === 0) {
    // create message if there were no products
    let span = document.createElement("span");
    span.textContent = "Your cart is empty.";
    span.className = "empty";
    cartsPlace.appendChild(span);

    cartsMenu.style.justifyContent = "";
    cartsPlace.style.height = "100%";
  } else {
    cartsMenu.style.justifyContent = "space-between";
    cartsPlace.style.height = "";
  }

  carts.forEach((cart) => {
    addCart(cart);
  });
  showNumbOfProdFun();
}

showNumbOfProdFun();

// Slider overlay
const showImg = document.querySelector("main .slider .show-img-holder");
const sliderOverlay = document.querySelector(".slider-overlay");
const sliderOverlayImages = document.querySelectorAll(
  ".slider-overlay .images .img img"
);
const sliderOverlayMainImg = document.querySelector(
  ".slider-overlay .show-frame .img img"
);
const sliderOverlayOut = document.querySelector(".slider-overlay i");
const sliderNext = document.querySelector(".slider-overlay .show-frame .next");
const sliderPrev = document.querySelector(".slider-overlay .show-frame .prev");

showImg.addEventListener("click", () => {
  checkSliderImages();
  sliderOverlay.style.display = "flex";
  sliderOverlayMainImg.src = showImg.children[0].src;

  sliderImages.forEach((li, i) => {
    if (li.classList.contains("active")) {
      currentImg = i;
      localStorage.setItem("currentImg", currentImg);
    }
  });

  sliderOverlayImages.forEach((img, i) => {
    img.addEventListener("click", () => {
      sliderOverlayImages.forEach((img) => {
        if (img.parentElement.classList.contains("active"))
          img.parentElement.classList.remove("active");
      });

      img.parentElement.classList.add("active");
      sliderOverlayMainImg.src = img.src;
      currentImg = i;
      localStorage.setItem("currentImg", currentImg);
    });
  });
});

window.addEventListener("click", (e) => {
  // Close overlay on click on the overlay itself
  if (e.target.className === "slider-overlay") {
    sliderOverlay.style.display = "none";
    setOverlayImgToSliderImg();
  }

  // Close mobile overlay
  if (e.target.classList.contains("close-mobile-nav")) {
    overlay.style.display = "none";
    mobileNav.classList.remove("active");
  }
});
// Close overlay when click on "X" sign
sliderOverlayOut.addEventListener("click", () => {
  sliderOverlay.style.display = "none";
  setOverlayImgToSliderImg();
});

function setOverlayImgToSliderImg() {
  sliderImages.forEach((img) => {
    sliderImages.forEach((img) => {
      if (img.classList.contains("active")) img.classList.remove("active");
    });
  });

  for (let i = 0; i < sliderImages.length; i++) {
    if (currentImg === i) {
      sliderImages[i].classList.add("active");
      sliderShowImg.src = sliderImages[i].children[0].src.replace(
        "-thumbnail",
        ""
      );
      thumbnailImg = sliderImages[i].children[0].src;
      break;
    }
  }
}

let lengthSliderImages = sliderOverlayImages.length - 1;

sliderNext.addEventListener("click", () => {
  if (currentImg !== lengthSliderImages) {
    currentImg++;
    localStorage.setItem("currentImg", currentImg);
  } else isLastImg = true;
  checkSliderImages();
});

sliderPrev.addEventListener("click", () => {
  if (currentImg !== 0) {
    currentImg--;
    localStorage.setItem("currentImg", currentImg);
  } else isFirstImg = true;
  checkSliderImages();
});

function checkSliderImages() {
  // Remove active class from all images
  sliderOverlayImages.forEach((img) => {
    if (img.parentElement.classList.contains("active"))
      img.parentElement.classList.remove("active");
  });

  // add active class on current img
  sliderOverlayImages[currentImg].parentElement.classList.add("active");

  // set current img on show frame img
  let sourceImg = sliderImages[currentImg].children[0].src.replace(
    "-thumbnail",
    ""
  );
  sliderOverlayMainImg.src = sourceImg;
}

let isLastImg = false;
let isFirstImg = false;
window.addEventListener("click", (e) => {
  isLastImgChecker(e);
  isFirstImgChecker(e);
});

function isLastImgChecker(e) {
  function check() {
    if (isLastImg) {
      currentImg = 0;
      localStorage.setItem("currentImg", currentImg);
      checkSliderImages();
      isLastImg = false;
    }
  }

  if (e.target.classList.contains("next")) {
    check();
  } else {
    // or if its i tag
    if (e.target.tagName === "I") {
      check();
    }
  }
}

function isFirstImgChecker(e) {
  function check() {
    if (isFirstImg) {
      currentImg = lengthSliderImages;
      localStorage.setItem("currentImg", currentImg);
      checkSliderImages();
      isFirstImg = false;
    }
  }

  if (e.target.classList.contains("prev")) {
    check();
  } else {
    // or if its i tag
    if (e.target.tagName === "I") {
      check();
    }
  }
}

checkOutButton.addEventListener("click", () => {
  clickedEffect(checkOutButton);
});

// Mobile nav

const navMenu = document.querySelector("header .links-section .mobile-menu");
const mobileNav = document.querySelector(".links-section .mobile-menu nav");
const overlay = document.createElement("div");
const closeMobileNav = document.createElement("i");

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
