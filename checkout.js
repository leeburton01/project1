document.addEventListener("DOMContentLoaded", () => {
  const basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];
  const checkoutItemsContainer = document.getElementById("checkout-items");
  const totalPriceElement = document.getElementById("checkout-total-price");

  let totalPrice = 0;

  function calculateDiscountedPrice(price, quantity) {
    let discount = 0;
    if (quantity >= 4 && quantity <= 7) {
      discount = 0.1;
    } else if (quantity >= 8 && quantity <= 11) {
      discount = 0.2;
    } else if (quantity >= 12) {
      discount = 0.3;
    }
    return price * quantity * (1 - discount);
  }

  basketItems.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "checkout-item";
    const discountedPrice = calculateDiscountedPrice(
      item.price,
      item.quantity
    ).toFixed(2);
    itemElement.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-quantity">
          <button class="quantity-control button" data-index="${index}" data-action="decrease">-</button>
          ${item.quantity}
          <button class="quantity-control button" data-index="${index}" data-action="increase">+</button>
      </span>
      <span class="item-price">Price: €${discountedPrice}</span>
      <button class="remove-item button" data-index="${index}">Remove</button>
    `;
    checkoutItemsContainer.appendChild(itemElement);
    totalPrice += parseFloat(discountedPrice);
  });

  totalPriceElement.innerText = `Total €${totalPrice.toFixed(2)}`;

  checkoutItemsContainer.addEventListener("click", (event) => {
    const index = event.target.getAttribute("data-index");

    if (event.target.classList.contains("quantity-control")) {
      const action = event.target.getAttribute("data-action");

      if (action === "increase") {
        basketItems[index].quantity += 1;
      } else if (action === "decrease" && basketItems[index].quantity > 1) {
        basketItems[index].quantity -= 1;
      }

      localStorage.setItem("basketItems", JSON.stringify(basketItems));
      location.reload();
    }

    if (event.target.classList.contains("remove-item")) {
      basketItems.splice(index, 1);
      localStorage.setItem("basketItems", JSON.stringify(basketItems));
      location.reload();
    }
  });

  const paypalButton = document.getElementById("paypal-button");
  paypalButton.addEventListener("click", () => {
    // Implement PayPal checkout functionality here
    alert("Redirecting to PayPal for payment...");
  });
});


