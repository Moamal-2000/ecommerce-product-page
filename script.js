"use strict";

const sliderImages = document.querySelectorAll("main .slider .images ul li"),
  sliderShowImg = document.querySelector(".slider .show-img-holder img"),
  cartIcon = document.querySelector(".container header .user-options i"),
  cartsMenu = document.querySelector(".container header .carts-menu"),
  increaseProduct = document.querySelector(".counter button:first-child"),
  decreaseProduct = document.querySelector(".counter button:last-child"),
  numberOfProducts = document.querySelector(".counter .the-number"),
  showNumOfProd = document.querySelector(".user-options i .number-of-products"),
  addToCart = document.getElementById("add-to-cart-button"),
  titleProduct = document.querySelector("main .request-products h2"),
  priceProduct = document.querySelector(".price-container .price"),
  oldPrice = document.querySelector(
    ".request-products .price-container .old-price"
  ),
  cartsPlace = document.querySelector(" header .carts-menu .carts"),
  discount = document.querySelector(
    ".request-products .price-container .discount"
  );

let currentImg = 0,
  currentImgLocal = localStorage.getItem("currentImg"),
  priceLocal = localStorage.getItem("price"),
  oldPriceLocal = localStorage.getItem("old-price"),
  discountLocal = localStorage.getItem("discount");

if (currentImgLocal !== null) {
  currentImg = parseInt(currentImgLocal);
  // add active class on current img
  sliderImages.forEach((img) => {
    if (img.classList.contains("active")) img.classList.remove("active");
  });

  sliderImages[currentImg].classList.add("active");
  sliderShowImg.src = sliderImages[currentImg].children[0].src.replace(
    "-thumbnail",
    ""
  );

  priceProduct.textContent = priceLocal;
  oldPrice.textContent = oldPriceLocal;
  discount.textContent = discountLocal;
}

sliderImages.forEach((img, i) => {
  img.addEventListener("click", () => {
    // remove all active classes
    sliderImages.forEach((img) => {
      if (img.classList.contains("active")) img.classList.remove("active");
    });

    // add active class on clicked img
    img.classList.add("active");
    currentImg = i;
    localStorage.setItem("currentImg", currentImg);

    // change main source url image to the clicked img
    sliderShowImg.src = img.children[0].src.replace("-thumbnail", "");
    // store clicked img src in variable
    thumbnailImg = img.children[0].src;
    localStorage.setItem("thumbnailImg", thumbnailImg);

    changeProductInfo(i);
  });
});

function changeProductInfo(i) {
  if (i === 0) {
    priceProduct.textContent = "$125.00";
    oldPrice.textContent = "$250.00";
    discount.textContent = "50%";
  } else if (i === 1) {
    priceProduct.textContent = "$115.00";
    oldPrice.textContent = "$150.00";
    discount.textContent = "30%";
  } else if (i === 2) {
    priceProduct.textContent = "$180.00";
    oldPrice.textContent = "$300.00";
    discount.textContent = "40%";
  } else if (i === 3) {
    priceProduct.textContent = "$120.00";
    oldPrice.textContent = "$220.00";
    discount.textContent = "45%";
  }

  localStorage.setItem("price", priceProduct.textContent);
  localStorage.setItem("old-price", oldPrice.textContent);
  localStorage.setItem("discount", discount.textContent);
}

let hasCheckOutButton = false;
localStorage.setItem("hasCheckOutButton", hasCheckOutButton);

let checkOutButton = document.createElement("a");
checkOutButton.type = "button";
checkOutButton.textContent = "Checkout";
checkOutButton.classList.add("checkout-button");
let anchorProducts = document.createElement("a");
checkOutButton.href = "products.html";

cartIcon.addEventListener("click", () => {
  // open & close carts menu
  cartsMenu.classList.contains("open")
    ? cartsMenu.classList.toggle("open")
    : cartsMenu.classList.toggle("open");

  // Add [check out] button inside cart menu
  Array.from(cartsPlace.children).forEach((ele) => {
    if (ele.classList.contains("product") && !hasCheckOutButton) {
      cartsMenu.appendChild(checkOutButton);
      hasCheckOutButton = true;
      localStorage.setItem("hasCheckOutButton", hasCheckOutButton);
    }
  });
});

// add 1 to the number of products
increaseProduct.addEventListener("click", () => {
  let productsNumber = parseInt(numberOfProducts.textContent);
  productsNumber++;
  numberOfProducts.textContent = productsNumber;
});

// minus 1 from the number of products
decreaseProduct.addEventListener("click", () => {
  let productsNumber = parseInt(numberOfProducts.textContent);
  if (productsNumber > 0) {
    productsNumber--;
    numberOfProducts.textContent = productsNumber;
  }
});

let thumbnailImg = sliderImages[0].children[0].src;
let thumbnailImgLocal = localStorage.getItem("thumbnailImg");
if (thumbnailImgLocal !== null) thumbnailImg = thumbnailImgLocal;

let carts = [];
let productsLocal = localStorage.getItem("products");
// update list of products from data in local storage
if (productsLocal !== null) {
  carts = JSON.parse(productsLocal);
  updateList();
}

addToCart.addEventListener("click", () => {
  if (
    cartsPlace.children.length === 1 &&
    cartsPlace.children[0].classList.contains("empty")
  )
    cartsPlace.children[0].remove();

  addCartToArr();
  updateList();
  clickedEffect(addToCart);

  // add checkout button to cart menu depending on number of products
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
  let isNewProduct = false;
  if (numberOfProducts.textContent !== "0") {
    let cart = {
      id: Date.now(),
      thumbnailImg: thumbnailImg,
      numberOfProducts: numberOfProducts.textContent,
      title: titleProduct.textContent,
      price: priceProduct.textContent.slice(1),
    };

    // Add first project and end function
    if (carts.length === 0) {
      carts.push(cart);
      localStorage.setItem("products", JSON.stringify(carts));
      addCart(cart);
      return;
    }

    // Current product number
    let imgProduct = cart.thumbnailImg;
    let numberOfImg = imgProduct
      .slice(imgProduct.indexOf("product-"), imgProduct.indexOf("-thumbnail"))
      .slice(imgProduct.indexOf(/\d/gi));

    for (let i = 0; i < carts.length; i++) {
      // All products numbers
      let imgProductArr = carts[i].thumbnailImg;
      let numberOfImgArr = imgProductArr
        .slice(
          imgProductArr.indexOf("product-"),
          imgProductArr.indexOf("-thumbnail")
        )
        .slice(imgProductArr.indexOf(/\d/gi));

      // Check if product is not exist in the cart
      if (numberOfImgArr !== numberOfImg) isNewProduct = true;
      else {
        isNewProduct = false;
        // Add new price on the current price
        carts[i].numberOfProducts =
          parseInt(carts[i].numberOfProducts) +
          parseInt(numberOfProducts.textContent);
        localStorage.setItem("products", JSON.stringify(carts));
        break;
      }
    }

    // Add product to cart if its not exist in the cart
    if (isNewProduct) {
      carts.push(cart);
      localStorage.setItem("products", JSON.stringify(carts));
      addCart(cart);
    }
  }
}

// Create product content
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

  // delete message if carts menu is empty
  Array.from(cartsPlace.children).forEach((ele) => {
    if (ele.classList.contains("empty")) ele.remove();
  });

  deleteProductFun(cart.id, deleteProduct);
}

function deleteProductFun(cartId, button) {
  button.addEventListener("click", () => {
    // delete clicked product from list [on delete icon]
    carts = carts.filter((cart) => cart.id !== cartId);
    localStorage.setItem("products", JSON.stringify(carts));

    // if there is no products in carts menu [delete check out button]
    if (cartsPlace.children.length === 1 && hasCheckOutButton) {
      checkOutButton.remove();
      hasCheckOutButton = false;
      localStorage.setItem("hasCheckOutButton", hasCheckOutButton);
    }
    // update list of products after delete one of them
    updateList();
  });
}

function updateList() {
  // empty carts menu
  cartsPlace.textContent = "";
  // create message if there were no products
  if (carts.length === 0) {
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

  // Add products to the carts menu
  carts.forEach((cart) => {
    addCart(cart);
  });
  showNumbOfProdFun();
}

// show number on icon carts menu
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
showNumbOfProdFun();

// slider overlay logic
const showImg = document.querySelector("main .slider .show-img-holder"),
  sliderOverlay = document.querySelector(".slider-overlay"),
  sliderOverlayImages = document.querySelectorAll(
    ".slider-overlay .images .img img"
  ),
  sliderOverlayMainImg = document.querySelector(
    ".slider-overlay .show-frame .img img"
  ),
  sliderOverlayOut = document.querySelector(".slider-overlay i"),
  sliderNext = document.querySelector(".slider-overlay .show-frame .next"),
  sliderPrev = document.querySelector(".slider-overlay .show-frame .prev");

// click on showed img from the previous slider
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
      changeProductInfo(i);
    });
  });
});

window.addEventListener("click", (e) => {
  // close overlay depending on the click on the overlay itself
  if (e.target.className === "slider-overlay" || e.target.tagName !== "IMG") {
    sliderOverlay.style.display = "none";
    setOverlayImgToSliderImg();
  }

  // close mobile overlay
  if (e.target.classList.contains("close-mobile-nav")) {
    overlay.style.display = "none";
    mobileNav.classList.remove("active");
  }
});

// close overlay slider when click on "X" sign
sliderOverlayOut.addEventListener("click", () => {
  sliderOverlay.style.display = "none";
  setOverlayImgToSliderImg();
});

function setOverlayImgToSliderImg() {
  sliderImages.forEach((img) => {
    if (img.classList.contains("active")) img.classList.remove("active");
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
  // remove active classes from all images
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
  // check if the current img is last one in the slider
  function check() {
    if (isLastImg) {
      currentImg = 0;
      localStorage.setItem("currentImg", currentImg);
      checkSliderImages();
      isLastImg = false;
    }
  }

  if (e.target.classList.contains("next")) check();
  else if (e.target.tagName === "I") check();
}

function isFirstImgChecker(e) {
  // check if the current img is first one in the slider
  function check() {
    if (isFirstImg) {
      currentImg = lengthSliderImages;
      localStorage.setItem("currentImg", currentImg);
      checkSliderImages();
      isFirstImg = false;
    }
  }

  if (e.target.classList.contains("prev")) check();
  else if (e.target.tagName === "I") check();
}

checkOutButton.addEventListener("click", () => {
  clickedEffect(checkOutButton);
});

// mobile nav
const navMenu = document.querySelector("header .links-section .mobile-menu"),
  mobileNav = document.querySelector(
    ".links-section .mobile-menu-container nav"
  ),
  overlay = document.createElement("div"),
  closeMobileNav = document.createElement("i");

// overlay settings
overlay.className = "overlay";
document.body.appendChild(overlay);
closeMobileNav.className = "bi bi-x close-mobile-nav";
closeMobileNav.style.width = "fit-content";

navMenu.addEventListener("click", () => {
  overlay.style.display = "block";
  mobileNav.prepend(closeMobileNav);
  mobileNav.classList.add("active");
  document.body.style.overflow = 'hidden'
});

overlay.addEventListener("click", (e) => {
  e.target.style.display = "none";
  mobileNav.classList.remove("active");
  document.body.style.overflow = ''
});
