let currentAudio;

function playTrack(track, playerId) {
  if (currentAudio) {
    currentAudio.pause();
  }
  let player = document.getElementById(playerId);
  player.src = track;
  player.play();
  currentAudio = player;
  visualizeAudio(player);
}

function visualizeAudio(player) {
  const canvas = document.getElementById("waveformCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(player);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  function animateWaveform() {
    requestAnimationFrame(animateWaveform);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
    x = 0;
  }

  animateWaveform();
}

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
