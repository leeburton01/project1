let totalPrice = 0;
let basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];

function addToBasket(itemName, itemPrice) {
  const priceValue = parseFloat(itemPrice.replace("€", ""));
  totalPrice += priceValue;

  const existingItem = basketItems.find((item) => item.name === itemName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    basketItems.push({ name: itemName, price: priceValue, quantity: 1 });
  }

  localStorage.setItem("basketItems", JSON.stringify(basketItems));
  updateTotalPrice();
}

function updateTotalPrice() {
  totalPrice = basketItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  document.getElementById(
    "total-price"
  ).innerText = `Total €${totalPrice.toFixed(2)}`;
}

function goToCheckout() {
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
  basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
  updateTotalPrice();
});
