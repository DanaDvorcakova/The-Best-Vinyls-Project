// RECORDS CAROUSEL SCROLL //
const carousels = document.querySelectorAll('.carousel-container');
carousels.forEach(container => {
    const track = container.querySelector('.carousel-track');
    const leftBtn = container.querySelector('.arrow.left');
    const rightBtn = container.querySelector('.arrow.right');
    const cardWidth = container.querySelector('.record-card').offsetWidth + 20;

    leftBtn.addEventListener('click', () => track.scrollBy({ left: -cardWidth, behavior: 'smooth' }));
    rightBtn.addEventListener('click', () => track.scrollBy({ left: cardWidth, behavior: 'smooth' }));
});

function scrollCarousel(id, direction) {
    const carousel = document.getElementById(id);
    if (!carousel) return;
    carousel.scrollBy({ left: direction * 220, behavior: 'smooth' });
}

// RECORD CARD HOVER ANIMATION //
document.querySelectorAll('.record-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
    });
});

// PRICE ANIMATION WITH FADE //
function animatePriceChange(el, newPrice) {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = 0;
    setTimeout(() => {
        el.textContent = newPrice;
        el.style.opacity = 1;
    }, 300);
}

// CURRENCY SWITCHER & CART LOGIC //
document.addEventListener('DOMContentLoaded', () => {
    const currencies = ["€", "£", "$"];
    const switcher = document.getElementById("currencySwitcher");

    if (!localStorage.getItem("currency")) localStorage.setItem("currency", "€");
    let currentCurrency = localStorage.getItem("currency");

    if (switcher) switcher.value = currentCurrency;

    const exchangeRates = {
        "€": { "€": 1, "£": 0.882375, "$": 1.16191},
        "£": { "€": 1.13331 , "£": 1, "$": 1.31678 },
        "$": { "€": 0.86065, "£": 0.759428, "$": 1 }
    };

    // CART TOTAL CALCULATION WITH ANIMATION //
    function recalcCartTotal() {
        const totalEl = document.getElementById("cart-total");
        if (!totalEl) return;

        let total = 0;
        document.querySelectorAll(".cart-item").forEach(item => {
            const price = parseFloat(item.querySelector(".price").dataset.price);
            const qty = parseInt(item.querySelector(".quantity").textContent);
            total += price * qty;
        });

        const newTotal = `${currentCurrency}${(total * exchangeRates["€"][currentCurrency]).toFixed(2)}`;
        animatePriceChange(totalEl, newTotal);
    }

    // HANDLE QUANTITY INCREASE AND DECREASE BUTTONS //
    document.querySelectorAll(".quantity-btn").forEach(button => {
        button.addEventListener("click", () => {
            const itemId = button.dataset.id;
            const quantityElement = document.getElementById(`quantity-${itemId}`);
            let quantity = parseInt(quantityElement.textContent);

            if (button.classList.contains("increase")) quantity++;
            else if (button.classList.contains("decrease") && quantity > 1) quantity--;

            quantityElement.textContent = quantity;

            // UPDATE THE ITEM TOTAL WITH ANIMATION
            const priceEl = document.querySelector(`#cart-item-${itemId} .price`);
            const basePrice = parseFloat(priceEl.dataset.price);
            const itemTotalEl = document.getElementById(`item-total-${itemId}`);
            if (itemTotalEl) {
                const convertedPrice = (basePrice * quantity * exchangeRates["€"][currentCurrency]).toFixed(2);
                animatePriceChange(itemTotalEl, `${currentCurrency}${convertedPrice}`);
            }

            // UPDATE THE CART TOTAL
            recalcCartTotal();

            updateCart(itemId, button.classList.contains("increase") ? "increase" : "decrease");
        });
    });

    // UPDATE PRICES BASED ON CURRENCY //
    function updatePrices() {
        document.querySelectorAll(".price").forEach(priceEl => {
            const basePrice = parseFloat(priceEl.dataset.price);
            if (!isNaN(basePrice)) {
                const converted = `${currentCurrency}${(basePrice * exchangeRates["€"][currentCurrency]).toFixed(2)}`;
                animatePriceChange(priceEl, converted);
            }
        });

        document.querySelectorAll(".item-total").forEach(itemEl => {
            const cartItem = itemEl.closest(".cart-item");
            const price = parseFloat(cartItem.querySelector(".price").dataset.price);
            const qty = parseInt(cartItem.querySelector(".quantity").textContent);
            const convertedTotal = (price * qty * exchangeRates["€"][currentCurrency]).toFixed(2);
            animatePriceChange(itemEl, `${currentCurrency}${convertedTotal}`);
        });

        recalcCartTotal();
        if (switcher) switcher.value = currentCurrency;
    }

    // REMOVE ITEMS PERMANENTLY FROM CART //
    function setupRemoveButtons() {
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", () => {
                const itemId = button.dataset.id;

                fetch(`/remove_from_cart/${itemId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const itemEl = document.getElementById(`cart-item-${itemId}`);
                        if (itemEl) {
                            itemEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            itemEl.style.opacity = '0';
                            itemEl.style.transform = 'translateX(80px)';
                            itemEl.addEventListener('transitionend', () => {
                                itemEl.remove();
                                recalcCartTotal();
                                if (document.querySelectorAll(".cart-item").length === 0) {
                                    const container = document.querySelector(".cart-container");
                                    if (container)
                                        container.innerHTML = '<p class="empty-cart">Your cart is empty </p>';
                                }
                            }, { once: true });
                        }
                    } else {
                        console.error("Failed to remove item from server.");
                    }
                })
                .catch(err => console.error("Error:", err));
            });
        });
    }

    // UPDATE ALL LINK CURRENCIES //
    function updateLinksCurrency() {
        document.querySelectorAll("a").forEach(link => {
            if (!link.href.includes("mailto:") && !link.href.startsWith("#")) {
                const url = new URL(link.href, window.location.origin);
                url.searchParams.set("currency", currentCurrency);
                link.href = url.toString();
            }
        });
    }

    // INITIALIZE //
    updatePrices();
    setupRemoveButtons();
    updateLinksCurrency();

    // SWITCH CURRENCY — DROPDOWN //
    if (switcher) {
        switcher.addEventListener("change", () => {
            currentCurrency = switcher.value;
            localStorage.setItem("currency", currentCurrency);
            updatePrices();
            updateLinksCurrency();
        });
    }
});




// FLASH MESSAGES AUDIO HIDE //
document.addEventListener('DOMContentLoaded', () => {
    const flashMessages = document.querySelectorAll('.flash-messages li');
    if (flashMessages.length > 0) {
        setTimeout(() => {
            flashMessages.forEach(msg => {
                msg.style.transition = 'opacity 0.5s, transform 0.5s';
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-10px)';
            });
            // Remove from DOM after transition
            setTimeout(() => {
                const container = document.querySelector('.flash-messages');
                if (container) container.remove();
            }, 500); // matches the transition
        }, 3000); // 3 seconds visible
    }
});

// BACK TO TOP BUTTON //
const backBtn = document.createElement('button');
backBtn.id = 'back-to-top';
backBtn.innerText = '↑ Top';
Object.assign(backBtn.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    padding: '10px 15px',
    background: 'white',
    color: 'rgb(128, 36, 36)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'none',
    zIndex: 1000
});
document.body.appendChild(backBtn);

window.addEventListener('scroll', () => {
    backBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});

backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// MODAL VIEW FOR RECORD IMAGES WITH FADE //
const modal = document.createElement('div');
modal.id = 'image-modal';
Object.assign(modal.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: 2000
});
const modalImg = document.createElement('img');
Object.assign(modalImg.style, {
    maxWidth: '90%',
    maxHeight: '90vh',
    borderRadius: '8px',
    objectFit: 'contain',
    transition: 'transform 0.3s ease'
});
modal.appendChild(modalImg);

const closeBtn = document.createElement('span');
closeBtn.innerHTML = '&times;';
Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '20px',
    right: '30px',
    fontSize: '2rem',
    color: '#fff',
    cursor: 'pointer'
});
modal.appendChild(closeBtn);
document.body.appendChild(modal);

function showModal(src) {
    modalImg.style.transform = 'scale(0.8)';
    modalImg.src = src;
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = 1, 10);
    setTimeout(() => modalImg.style.transform = 'scale(1)', 50);
}

function hideModal() {
    modal.style.opacity = 0;
    modalImg.style.transform = 'scale(0.8)';
    modal.addEventListener('transitionend', () => modal.style.display = 'none', { once: true });
}

document.querySelectorAll('.view-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showModal(link.dataset.img);
    });
});

closeBtn.addEventListener('click', hideModal);
modal.addEventListener('click', e => { if (e.target === modal) hideModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

//  SEARCH BAR ROTATING PLACEHOLDER //
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#search-bar'); // <-- adjust if your input has a different ID
    if (!searchInput) return; // stop if no search bar on page

    const bands = [
        "Queen",
        "Maneskin", 
        "AC/DC",
        "Nirvana",
        "Harry Styles"
    ];

    let index = 0;
    searchInput.placeholder = `Search for ${bands[index]}...`;

    setInterval(() => {
        index = (index + 1) % bands.length;
        searchInput.placeholder = `Search for ${bands[index]}...`;
    }, 2000); // change every 2 seconds
});

// REVEAL ON SCROLL //
  function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  
  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150; // adjust when the element appears
    
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // reveal on page load if visible

// SLIDESHOW //
let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("mySlides");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 6500); // Change image every 3 seconds
}


// TYPEWRITTER EFFECT //
const div = document.querySelector(".collection-genre");
const text = 'Hey vinyl lovers! Welcome to "The Best Vinyls" shop and enjoy browsing through our collection!';

function textTypingEffect(element, text, i = 0) {
    if (i === 0) {
    element.textContent = "";
    }
    element.textContent += text[i];
    if (i === text.length - 1) {
        return;
    }
    setTimeout(() => textTypingEffect(element, text, i + 1) , 50);
}
textTypingEffect(div, text);
