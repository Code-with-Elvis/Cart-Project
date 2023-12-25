"use strict";

var _data = require("./data.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
===================================
Cart Hide && Show
===================================
*/
var body = document.body;
var cartIcon = document.querySelector('.cart'),
    hideCartIcon = document.querySelector('.hide-cart'),
    cartOverlay = document.querySelector('.cart-overlay');
cartIcon.addEventListener('click', function () {
  body.classList.add('active');
});
hideCartIcon.addEventListener('click', function () {
  body.classList.remove('active');
});
cartOverlay.addEventListener('click', function () {
  body.classList.remove('active');
});
/*
===================================
Cart Manipulation
===================================
*/
//IMPORTING PRODUCTS

//import { cart } from "./cart.js";
var cart = JSON.parse(localStorage.getItem('bag')) || []; //*==== Local storage settings

function setLocalStorage() {
  localStorage.setItem('bag', JSON.stringify(cart));
} //RENDER PRODUCTS


var productsElem = document.querySelector('.products');

function renderProducts() {
  _data.products.forEach(function (product) {
    var name = product.name,
        id = product.id,
        imgSrc = product.imgSrc,
        price = product.price,
        des = product.des;
    productsElem.innerHTML += "\n        <div class=\"product\">\n          <div class=\"img\">\n            <img src=\"".concat(imgSrc, "\" alt=\"image\" loading=\"lazy\">\n            <button class=\"Js-add-to-cart\" data-product-id=\"").concat(id, "\"><i class=\"bi bi-cart2\"></i></button>\n          </div>\n          <h4>").concat(name, "</h4>\n          <small>").concat(des, "</small>\n          <p>Ksh ").concat(price, "</p>\n        </div>\n    ");
  });
}

renderProducts(); //ADD TO CART

var addToCartBtns = document.querySelectorAll('.Js-add-to-cart');
addToCartBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var pId = btn.getAttribute('data-product-id'); //Call update cart here

    addToCart(pId);
  });
});

function addToCart(productId) {
  var match = '';

  _data.products.forEach(function (product) {
    if (productId === product.id) {
      match = product;
    }
  });

  if (match) {
    var search = cart.find(function (item) {
      return item.id === productId;
    });

    if (search) {
      if (search.qtn < search.inStock) {
        search.qtn++;
      }
    } else {
      cart.push(_objectSpread({}, match, {
        qtn: 1
      }));
    }
  }

  updateCart();
} //UPDATE CART


function updateCart() {
  setLocalStorage();
  renderCart();
  updateQtn();
  totalSummary();
} //RENDER CART HERE


var cartElem = document.querySelector('.main-cart');

function renderCart() {
  cartElem.innerHTML = ''; //Clear the cart

  cart.forEach(function (item) {
    var id = item.id,
        name = item.name,
        imgSrc = item.imgSrc,
        price = item.price,
        qtn = item.qtn;
    cartElem.innerHTML += "\n      <div class=\"item\">\n          <img src=\"".concat(imgSrc, "\" alt=\"image\" loading=\"lazy\">\n          <div class=\"left\">\n            <h3>").concat(name, "</h3>\n            <p>Ksh ").concat(price, "</p>\n            <div class=\"updates\">\n              <div class=\"main-updates\">\n                <i class=\"bi bi-plus-square-fill plus-btn\" data-id=\"").concat(id, "\"></i>\n                <span class=\"qtn\" data-id=\"").concat(id, "\">").concat(qtn, "</span>\n                <i class=\"bi bi-dash-square-fill minus-btn\" data-id=\"").concat(id, "\"></i>\n              </div>\n              <button class=\"delete\" data-id=\"").concat(id, "\">Remove</button>\n            </div>\n          </div>\n      </div>\n    ");
  }); //*=====Add event listeners to the plus buttons

  var plusButtons = document.querySelectorAll(".plus-btn");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var button = _step.value;
      button.addEventListener("click", function () {
        //*===Get the item
        var itemId = button.getAttribute("data-id");
        var item = cart.find(function (p) {
          return p.id === itemId;
        }); //*===Increment the quantity by one

        if (item.qtn < item.inStock) {
          item.qtn++;
        }

        updateCart();
      });
    };

    for (var _iterator = plusButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    } //*=== Add event listeners to the minus buttons

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var minusButtons = document.querySelectorAll(".minus-btn");
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop2 = function _loop2() {
      var button = _step2.value;
      button.addEventListener("click", function () {
        //*==== Get the item
        var itemId = button.getAttribute("data-id");
        var item = cart.find(function (p) {
          return p.id === itemId;
        }); //*==== Decrement the quantity by one

        if (item.qtn > 0) {
          item.qtn--;
        }

        if (item.qtn == 0) {
          cart = cart.filter(function (item) {
            return item.id !== itemId;
          });
        }

        updateCart();
      });
    };

    for (var _iterator2 = minusButtons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      _loop2();
    } //*===Remove Item icart===*/

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var removeItemBtns = document.querySelectorAll('.delete');
  removeItemBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pId = btn.getAttribute("data-id");
      var newCart = cart.filter(function (item) {
        return item.id !== pId;
      });
      cart = newCart;
      console.log(newCart);
      updateCart();
    });
  });
} //UPDATE QUANTITY


function updateQtn() {
  var qtnArray = cart.map(function (item) {
    return item.qtn;
  });
  var sum = qtnArray.reduce(function (val, acc) {
    return val + acc;
  }, 0);
  var qtnElem = document.querySelector('.cart .qtn');
  var subQtn = document.querySelector('.qtn-s');
  qtnElem.innerHTML = sum;
  subQtn.innerHTML = sum;
} //ADDING UP SUBTOTAL


function totalSummary() {
  var totalArray = cart.map(function (item) {
    return item.price * item.qtn;
  });
  var summary = totalArray.reduce(function (val, acc) {
    return val + acc;
  }, 0);
  var totalElem = document.querySelector('.total');
  totalElem.innerHTML = summary;
} //Update Cart On loading the page for local siorage to work -- place it down here


updateCart();