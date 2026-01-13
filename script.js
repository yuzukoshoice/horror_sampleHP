// Shared Cart Logic
const CART_KEY = 'twilight_cart';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.length;
    // Handle both relative paths (index vs subpages) or just select all matching classes
    const cartLinks = document.querySelectorAll('.cart-link');
    cartLinks.forEach(link => {
        link.innerText = `カート (${count})`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // 1. Atmosphere: Random flickering or noise
    const body = document.body;

    // たまに画面が瞬く（明滅）
    setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance
            body.style.opacity = 0.8;
            setTimeout(() => body.style.opacity = 1, 50);
        }
    }, 2000);

    // 2. Search Box Cursed Keywords
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        const grid = document.querySelector('.product-grid');

        if (query === '事故' || query === '呪い' || query === '助けて') {
            triggerHorrorEvent('search-curse');
        } else if (query === '秘密') {
            // 謎解き要素: 隠しアイテムの出現
            grid.innerHTML = ''; // 既存の商品を消去

            const secretItem = document.createElement('article');
            secretItem.className = 'product-card';
            // 視覚的な演出をCSSで動的に生成
            secretItem.innerHTML = `
                <a href="listings/product.html?id=secret">
                    <div class="img-wrapper" style="background-color: #111; display: flex; justify-content: center; align-items: center; height: 300px;">
                        <span style="color: #8b0000; font-size: 5rem; font-family: 'Zen Old Mincho'; border: 3px solid #8b0000; padding: 1rem; border-radius: 50%;">秘</span>
                    </div>
                    <div class="product-info">
                        <h4>店主の古い日記</h4>
                        <p class="price">¥ ---</p>
                        <p class="tag">#重要 #閲覧注意</p>
                    </div>
                </a>
            `;
            grid.appendChild(secretItem);

            // 効果音代わりの背景変化
            document.body.style.backgroundColor = '#222';
            document.body.style.color = '#ccc';
            alert('......鍵が開く音がした。');

        } else if (query === 'アケルナ') {
            // Secret Unsealed
            alert('封印ガ解カレマシタ...');
            document.body.style.transition = "filter 3s";
            document.body.style.filter = "brightness(0)";

            setTimeout(() => {
                // Determine path based on current location
                const pathParts = location.pathname.split('/');
                const currentDir = pathParts[pathParts.length - 2];
                let prefix = '';
                if (currentDir === 'listings' || currentDir === 'hidden') {
                    prefix = '../';
                }
                window.location.href = prefix + 'hidden/abyss.html';
            }, 2000);

        } else if (query) {
            alert('申し訳ありません。その商品は現在「品切れ」かもしれません...');
        }
    });

    // 3. Konami Code (Upper Upper Down Down Left Right Left Right B A)
    // デバッグモードというか、裏モード発動
    let inputs = [];
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        inputs.push(e.key);
        inputs.splice(-secretCode.length - 1, inputs.length - secretCode.length);

        if (inputs.join('') === secretCode.join('')) {
            alert('裏口が開きました...');
            document.body.style.filter = 'invert(1)';
        }
    });

    // 4. Ambient Horror: Looking at items
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // 稀に画像が一瞬だけ変わる処理などはここに記述予定
            if (Math.random() < 0.1) {
                const img = card.querySelector('img');
                img.style.transform = 'scale(1.1) rotate(2deg)';
                setTimeout(() => {
                    img.style.transform = 'scale(1) rotate(0deg)';
                }, 200);
            }
        });
    });
});

function triggerHorrorEvent(type) {
    if (type === 'search-curse') {
        document.body.style.backgroundColor = '#300';
        document.querySelectorAll('p, h2, h3, h4').forEach(el => {
            el.innerText = '逃ゲテ';
            el.style.color = 'red';
            el.style.fontFamily = 'Courier New';
        });

        // 3秒後に戻る（夢落ち）
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
}

// 5. Hide Purchased Items on Index Page
function checkPurchasedItems() {
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        const cart = getCart();
        cart.forEach(cartItem => {
            const card = productGrid.querySelector(`.product-card[data-id="${cartItem.id}"]`);
            if (card) {
                card.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkPurchasedItems();
    // ... existing initialization ...
});

// Create a separate handler for pageshow to ensure it runs on back navigation
window.addEventListener('pageshow', (event) => {
    // event.persisted indicates if the page was loaded from cache
    checkPurchasedItems();
    updateCartCount(); // Ensure cart count is also updated
});
