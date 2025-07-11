document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL SCRIPTS (RUN ON EVERY PAGE) ---

    // 1. HEADER SCROLL EFFECT
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // 2. MOBILE NAVIGATION
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 3. FIRE EMBER ANIMATION
    const emberContainer = document.getElementById('fire-ember-container');
    if (emberContainer) {
        const numberOfEmbers = 40;
        for (let i = 0; i < numberOfEmbers; i++) {
            const ember = document.createElement('div');
            ember.classList.add('ember');

            const startX = Math.random() * 100;
            const xEnd = (Math.random() * 200) - 100;
            const riseDuration = (Math.random() * 10) + 7;
            const riseDelay = Math.random() * 12;
            const size = (Math.random() * 6) + 2;

            ember.style.left = `${startX}vw`;
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.setProperty('--x-end', `${xEnd}px`);
            ember.style.animationDuration = `${riseDuration}s`;
            ember.style.animationDelay = `${riseDelay}s`;
            ember.style.opacity = Math.random() * 0.6 + 0.2;

            emberContainer.appendChild(ember);
        }
    }

    // --- PRODUCTS PAGE ONLY SCRIPTS ---
    if (document.getElementById('products')) {
        
        // --- STRIPE & CART SETUP ---
        const stripe = Stripe('pk_test_51...YOUR_PUBLISHABLE_KEY'); 
        let cart = [];
        let elements;

        // --- DOM ELEMENT SELECTORS ---
        const cartButton = document.getElementById('cart-button');
        const cartModal = document.getElementById('cart-modal');
        const closeCartBtn = document.getElementById('close-cart-btn');
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCountElement = document.getElementById('cart-count');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const cartTotalElement = document.getElementById('cart-total');
        const goToCheckoutBtn = document.getElementById('go-to-checkout-btn');
        const backToCartBtn = document.getElementById('back-to-cart-btn');
        const checkoutForm = document.getElementById('checkout-form');
        const payBtn = document.getElementById('pay-btn');
        const modalTitle = document.getElementById('modal-title');
        const cartViews = document.querySelector('.cart-views');

        // --- EVENT LISTENERS ---
        cartButton.addEventListener('click', () => cartModal.classList.add('open'));
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('open');
            setTimeout(showCartView, 400); 
        });
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const product = e.target.dataset;
                addToCart({ id: product.id, name: product.name, price: parseFloat(product.price), img: product.img });
            });
        });

        goToCheckoutBtn.addEventListener('click', showCheckoutView);
        backToCartBtn.addEventListener('click', showCartView);
        checkoutForm.addEventListener('submit', handleFormSubmit);

        // --- VIEW MANAGEMENT ---
        function showCheckoutView() {
            cartViews.style.transform = 'translateX(-100%)';
            modalTitle.textContent = 'Checkout';
            initializeStripeElements();
        }

        function showCartView() {
            cartViews.style.transform = 'translateX(0%)';
            modalTitle.textContent = 'Your Cart';
        }

        // --- CART LOGIC ---
        function addToCart(product) {
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        }

        function updateCart() {
            renderCartItems();
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

            cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;
            goToCheckoutBtn.disabled = cart.length === 0;

            if (totalItems > 0) {
                cartCountElement.textContent = totalItems;
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
        }

        function renderCartItems() {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
                return;
            }
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                </div>
            `).join('');

            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => btn.addEventListener('click', e => {
                cart = cart.filter(item => item.id !== e.target.dataset.id);
                updateCart();
            }));
            cartItemsContainer.querySelectorAll('.cart-item-quantity').forEach(input => input.addEventListener('change', e => {
                const item = cart.find(item => item.id === e.target.dataset.id);
                if (item) item.quantity = parseInt(e.target.value) || 1;
                updateCart();
            }));
        }

        // --- STRIPE PAYMENT LOGIC ---
        async function initializeStripeElements() {
            // UPDATED: The path now points to your 'payment.js' function.
            const { clientSecret } = await fetch('/.netlify/functions/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart }),
            }).then(r => r.json());

            elements = stripe.elements({ clientSecret, appearance: { theme: 'night', labels: 'floating' } });
            const paymentElement = elements.create("payment");
            paymentElement.mount("#card-element");
        }

        async function handleFormSubmit(e) {
            e.preventDefault();
            setLoading(true);

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/success.html`,
                    shipping: {
                        name: document.getElementById('name').value,
                        address: {
                            line1: document.getElementById('address').value,
                            city: document.getElementById('city').value,
                            state: document.getElementById('state').value,
                            postal_code: document.getElementById('zip').value,
                            country: document.getElementById('country').value,
                        },
                    },
                },
            });

            if (error.type === "card_error" || error.type === "validation_error") {
                showMessage(error.message);
            } else {
                showMessage("An unexpected error occurred.");
            }
            setLoading(false);
        }

        // --- UI HELPERS ---
        function showMessage(messageText) {
            const messageContainer = document.querySelector("#payment-message");
            messageContainer.classList.remove("hidden");
            messageContainer.textContent = messageText;
            setTimeout(() => {
                messageContainer.classList.add("hidden");
                messageContainer.textContent = "";
            }, 4000);
        }

        function setLoading(isLoading) {
            const buttonText = document.getElementById('button-text');
            const spinner = document.getElementById('spinner');
            if (isLoading) {
                payBtn.disabled = true;
                buttonText.classList.add('hidden');
                spinner.classList.remove('hidden');
            } else {
                payBtn.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        }
    }
});
