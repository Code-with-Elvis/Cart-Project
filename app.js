/*
===================================
Cart Hide && Show
===================================
*/

const body = document.body;
let cartIcon = document.querySelector('.cart'),
    hideCartIcon = document.querySelector('.hide-cart'),
    cartOverlay = document.querySelector('.cart-overlay');

cartIcon.addEventListener('click', ()=> {
  body.classList.add('active');
})

hideCartIcon.addEventListener('click', ()=> {
  body.classList.remove('active');
})

cartOverlay.addEventListener('click', ()=> {
  body.classList.remove('active');
})


/*
===================================
Cart Manipulation
===================================
*/


//IMPORTING PRODUCTS

import { products } from "./data.js";
//import { cart } from "./cart.js";
let cart = JSON.parse(localStorage.getItem('bag')) || [] ;





//*==== Local storage settings

function setLocalStorage() {
  localStorage.setItem('bag', JSON.stringify(cart));
}

//RENDER PRODUCTS

let productsElem = document.querySelector('.products');

function renderProducts() {
  products.forEach(product => {
    let {name, id, imgSrc, price, des} = product;

    productsElem.innerHTML += `
        <div class="product">
          <div class="img">
            <img src="${imgSrc}" alt="image" loading="lazy">
            <button class="Js-add-to-cart" data-product-id="${id}"><i class="bi bi-cart2"></i></button>
          </div>
          <h4>${name}</h4>
          <small>${des}</small>
          <p>Ksh ${price}</p>
        </div>
    `
  })
}

renderProducts();


//ADD TO CART

let addToCartBtns = document.querySelectorAll('.Js-add-to-cart');

addToCartBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    let pId = btn.getAttribute('data-product-id');
    //Call update cart here
    addToCart(pId)
  })
})


function addToCart(productId) {
  let match = '';
  products.forEach(product => {
    if(productId === product.id) {
      match = product;
    }
  })

  if(match) {
    let search = cart.find(item => item.id === productId );

    if(search) {
      if(search.qtn < search.inStock) {
        search.qtn ++;
      }
    } else {
      cart.push({
        ...match,
        qtn: 1
      })
    }
  }

  updateCart();
}

//UPDATE CART

function updateCart() {
  setLocalStorage()
  renderCart();
  updateQtn();
  totalSummary();
}


//RENDER CART HERE

let cartElem = document.querySelector('.main-cart');

function renderCart() {

  cartElem.innerHTML = ''; //Clear the cart

  cart.forEach(item =>{
    let {id, name, imgSrc, price, qtn} = item;

    cartElem.innerHTML += `
      <div class="item">
          <img src="${imgSrc}" alt="image" loading="lazy">
          <div class="left">
            <h3>${name}</h3>
            <p>Ksh ${price}</p>
            <div class="updates">
              <div class="main-updates">
                <i class="bi bi-plus-square-fill plus-btn" data-id="${id}"></i>
                <span class="qtn" data-id="${id}">${qtn}</span>
                <i class="bi bi-dash-square-fill minus-btn" data-id="${id}"></i>
              </div>
              <button class="delete" data-id="${id}">Remove</button>
            </div>
          </div>
      </div>
    `
  })

  //*=====Add event listeners to the plus buttons
  let plusButtons = document.querySelectorAll(".plus-btn");
  for (let button of plusButtons) {
    button.addEventListener("click", function() {
      //*===Get the item
      let itemId = button.getAttribute("data-id");
      let item = cart.find(p => p.id === itemId);

      //*===Increment the quantity by one
      if (item.qtn < item.inStock ) {
        item.qtn++ ;
      }

      updateCart();
    })
  }

  //*=== Add event listeners to the minus buttons
  let minusButtons = document.querySelectorAll(".minus-btn");
  for (let button of minusButtons) {
    button.addEventListener("click", function() {
      //*==== Get the item
      let itemId = button.getAttribute("data-id");
      let item = cart.find(p => p.id === itemId);

      //*==== Decrement the quantity by one
      if (item.qtn > 0) {
        item.qtn-- ;
      }
      if (item.qtn == 0) {
        cart = cart.filter(item => item.id !== itemId);
      }

      updateCart();
    })
  }

  //*===Remove Item icart===*/
  let removeItemBtns = document.querySelectorAll('.delete');
  removeItemBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      let pId = btn.getAttribute("data-id");
      let newCart = cart.filter(item => item.id !== pId);

      cart = newCart;

      console.log(newCart);

      updateCart()
      
    })
  })

}


//UPDATE QUANTITY

function updateQtn() {

  let qtnArray = cart.map(item => item.qtn);
  let sum = qtnArray.reduce((val, acc)=> {
    return val + acc;
  }, 0);

  let qtnElem = document.querySelector('.cart .qtn');
  let subQtn = document.querySelector('.qtn-s');
  qtnElem.innerHTML = sum;
  subQtn.innerHTML = sum;

}

//ADDING UP SUBTOTAL

function totalSummary() {
  let totalArray = cart.map(item => {
    return item.price * item.qtn;
  })

  let summary = totalArray.reduce((val, acc)=> {
    return val + acc;
  },0)

  let totalElem = document.querySelector('.total');
  totalElem.innerHTML = summary;
}



//Update Cart On loading the page for local siorage to work -- place it down here
updateCart();





