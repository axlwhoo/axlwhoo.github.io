const items = [
    { 
        name: "Frutiger Aero", 
        price: 45, 
        creator: "", 
        badge: "INSTOCK",
        img: "../assets/images/aeroshirt.png"
    },
    { 
        name: "911 Jeans", 
        price: 150, 
        creator: "", 
        badge: "INSTOCK",
        img: "../assets/images/911jeans.png"
    },
    { 
        name: "Israel Lover", 
        price: 2000, 
        creator: "", 
        badge: "NEW",
        img: "../assets/images/israel.png"
    },
    { 
        name: "Jeffrey Shirt", 
        price: 2000, 
        creator: "", 
        badge: "OUTSTOCK",
        img: "../assets/images/jeffrey.png"
    },
    { 
        name: "Skybox Sweater", 
        price: 2000, 
        creator: "", 
        badge: "NEW",
        img: "../assets/images/skybox.png"
    }
];

function renderCatalog() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let badgeHtml = item.badge ? `<span class="badge ${item.badge.toLowerCase()}">${item.badge}</span>` : '';

        // Dentro de tu items.forEach
        card.innerHTML = `
            <div class="image-container">
                <img src="${item.img}">
                ${badgeHtml}
            </div>
            <a href="#" class="item-name">${item.name}</a>
            <div style="font-size:11px">Creator: <span class="blue-link">${item.creator}</span></div>
            <div class="price-robux">R$: ${item.price}</div>
        `;
        grid.appendChild(card);
    });
}

renderCatalog();