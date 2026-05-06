const ITEMS_PER_PAGE = 16; // Configuración 4x4
let currentPage = 1;

function openProductDetail(productId) {
    const item = items.find(i => i.id === productId);
    if (!item) return;

    // --- LÓGICA DE NAVEGACIÓN ---
    const catalogView = document.querySelector('.content');
    const mainContentHeader = document.querySelector('main > .content-header'); 
    const pagination = document.getElementById('pagination-controls');
    const topHeader = document.querySelector('.top-header');
    const sidebar = document.querySelector('.sidebar');
    const detailView = document.getElementById('product-detail-view');

    if (mainContentHeader) mainContentHeader.style.display = 'none';
    catalogView.style.display = 'none';
    if(pagination) pagination.style.display = 'none';
    topHeader.style.display = 'none';
    sidebar.style.display = 'none';

    detailView.style.display = 'block';
    detailView.innerHTML = '';

    const combinedHTML = `
        <div id="dynamic-back-btn" style="width: 1000px; margin: 0 auto 5px auto; text-align: left;">
            <span onclick="closeProductDetail()" style="color: #0000EE; cursor: pointer; font-size: 13px; font-family: Verdana, sans-serif;">
                &lt;&lt; Regresar
            </span>
        </div>
        <div class="content-header" id="dynamic-detail-header" style="margin-top: 0;">
            <h2>${item.name}</h2>
        </div>
    `;
    detailView.insertAdjacentHTML('beforebegin', combinedHTML);

    // Valores dinámicos (usando lo que hay en tu script.js o valores por defecto)
    const salesCount = item.sales || 0;
    const favCount = item.favorites || 0;
    const dateAdded = item.date || "05/05/2024";

    detailView.innerHTML = `
        <div class="product-detail-container" style="display: flex; padding: 30px; gap: 40px; background: linear-gradient(to bottom, #e5e5e5, 20px, #FFF); box-shadow: inset 0 2px 0 0 #FFF; border: 1px solid #A7A7A7; margin-bottom: 40px; font-family: Verdana, sans-serif;">
            
            <div class="detail-image" style="border: 1px solid #E1E1E1; padding: 15px; background: white;">
                <img src="${item.img}" style="width: 420px; height: 420px; object-fit: contain;">
            </div>
            
            <div class="detail-info" style="flex-grow: 1; text-align: left;">
                
                <div style="font-size: 13px;">
                    <div style="font-size: 13px; color: #666;">
                        ${item.name}
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0px;">
                        <span style="font-weight: bold; color: #0000EE;">MXN$: ${item.price}</span>
                        <button onclick="addToCart(${item.id}); renderDetailCart();" 
                                style="background: linear-gradient(to bottom, #7df37d, 4px, #088409); border: none; border-radius: 4px; color: white; padding: 8px 20px; font-weight: bold; cursor: pointer;">
                            Agregar al carrito
                        </button>
                    </div>

                    <div style="margin-bottom: 5px;">
                        <span style="color: #666;">Creador: </span>
                        <span style="color: #0000EE;">${item.creator || '4kStore'}</span>
                    </div>

                    <div style="margin-bottom: 5px;">
                        <span style="color: #666;">Agregado en: </span>
                        <span style="color: #000;">${item.date}</span>
                    </div>

                    <div style="margin-bottom: 5px;">
                        <span style="color: #666;">Favoritos: </span>
                        <span style="color: #000;">${item.favorites}</span>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <span style="color: #666;">Vendidos: </span>
                        <span style="color: #000;">${item.sales}</span>
                    </div>

                    <div style="color: #000; font-weight: bold; margin-bottom: 10px;">
                        Descripción:
                    </div>

                    <div style="border: 1px solid #A7A7A7; background: transparent; padding: 12px; min-height: 15px; color: #000; line-height: 1.4;">
                        ${item.description || 'Sin descripción disponible.'}
                    </div>

                </div>
            </div>
        </div>

        <div class="content-header">
            <h2>Tu Carrito</h2>
        </div>
        <div id="detail-cart-items" style="padding: 20px; background: linear-gradient(to bottom, #e5e5e5, 20px, #FFF); box-shadow: inset 0 2px 0 0 #FFF; border: 1px solid #A7A7A7; margin-bottom: 40px;"></div>
    `;

    renderDetailCart();
}

function closeProductDetail() {
    window.history.pushState({}, '4kStore', 'index.html');

    // Borrar elementos dinámicos
    const dynamicBackBtn = document.getElementById('dynamic-back-btn');
    if (dynamicBackBtn) dynamicBackBtn.remove();
    
    const dynamicHeader = document.getElementById('dynamic-detail-header');
    if (dynamicHeader) dynamicHeader.remove();

    // Restaurar interfaz (Respetando tu .sidebar en flex)
    document.querySelector('.top-header').style.display = 'block';
    document.querySelector('.sidebar').style.display = 'flex';
    document.querySelector('.main-layout-container').style.display = 'flex';
    
    const mainContentHeader = document.querySelector('main > .content-header');
    if (mainContentHeader) mainContentHeader.style.display = 'block';

    document.getElementById('product-detail-view').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
    
    const pagination = document.getElementById('pagination-controls');
    if(pagination) pagination.style.display = 'flex';
}

function renderDetailCart() {
    const cartContainer = document.getElementById('detail-cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding:20px; font-family:Verdana;">Tu carrito está vacío.</p>';
        return;
    }

    let html = `
        <style>
            /* Eliminar flechas en Chrome, Safari, Edge y Opera */
            input.no-spinners::-webkit-outer-spin-button,
            input.no-spinners::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            /* Eliminar flechas en Firefox */
            input.no-spinners {
                -moz-appearance: textfield;
            }
        </style>
        <table style="width: 100%; border-collapse: collapse; font-family: Verdana, sans-serif; font-size: 13px;">
            <thead>
                <tr style="text-align: left; background: #f2f2f2;">
                    <th style="padding: 10px;">Producto</th>
                    <th style="padding: 10px; text-align: center;">Cantidad</th>
                    <th style="padding: 10px;">Precio</th>
                    <th style="padding: 10px;">Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalGeneral = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalGeneral += subtotal;
        html += `
            <tr style="border-bottom: none;">
                <td style="padding: 10px;">${item.name}</td>
                <td style="padding: 10px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span onclick="updateQuantity(${item.id}, -1)" 
                              style="cursor: pointer; color: #CE0A0A; font-weight: bold; font-size: 20px; user-select: none;">
                              −
                        </span>
                        
                        <input type="number" 
                               class="no-spinners"
                               value="${item.quantity}" 
                               onchange="setQuantity(${item.id}, this.value)"
                               style="width: 35px; text-align: center; border: none; background: transparent; font-family: Verdana; font-size: 14px; font-weight: bold; outline: none; padding: 0;">
                        
                        <span onclick="updateQuantity(${item.id}, 1)" 
                              style="cursor: pointer; color: #088409; font-weight: bold; font-size: 20px; user-select: none;">
                              +
                        </span>
                    </div>
                </td>
                <td style="padding: 10px;">MXN$: ${item.price}</td>
                <td style="padding: 10px; font-weight: bold;">MXN$: ${subtotal}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <div style="margin-top: 20px; text-align: right; font-family: Verdana; font-size: 16px; font-weight: bold; color: #008000; padding: 10px;">
            Total a pagar: MXN$: ${totalGeneral}
        </div>
        <div style="text-align: right; margin-top: 10px;">
            <button onclick="alert('¡Gracias por su compra!'); cart=[]; saveAndRenderCart(); renderDetailCart();" 
                    style="background: linear-gradient(to bottom, #7df37d, 4px, #088409); border-radius: 6px; color: white; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer;">
                Finalizar Compra
            </button>
        </div>
    `;

    cartContainer.innerHTML = html;
}

function setQuantity(productId, value) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        let newQty = parseInt(value);
        if (isNaN(newQty) || newQty <= 0) {
            cart = cart.filter(i => i.id !== productId);
        } else {
            item.quantity = newQty;
        }
        saveAndRenderCart();
        renderDetailCart();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveAndRenderCart();
        renderDetailCart();
    }
}

function renderCatalog() {
    const grid = document.getElementById('product-grid');
    const paginationControls = document.getElementById('pagination-controls');
    if(!grid) return;

    // 1. Filtrado previo (reutilizando tu lógica de categorías si la tienes)
    let filteredItems = [...items]; 
    // Si tienes filtros activos (Top favoritos, etc), aplícalos aquí antes de segmentar.

    // 2. Calcular índices de paginación
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    grid.innerHTML = '';

    // 3. Renderizar items de la página actual
    paginatedItems.forEach(item => {
        const isFavorited = getItemStatus(item.id);
        const salesCount = getSales(item.id);
        const card = document.createElement('div');
        card.className = 'card';
        
        const textoEtiqueta = item.badgeText || item.badge || "";
        let badgeHtml = item.badge 
            ? `<span class="badge ${item.badge.toLowerCase()}">${textoEtiqueta}</span>` 
            : '';

        card.innerHTML = `
    <div class="image-container">
        <img src="${item.img}">
        ${badgeHtml}
    </div>
    <a href="javascript:void(0)" class="item-name" onclick="openProductDetail(${item.id})">${item.name}</a>
            <a href="javascript:void(0)" onclick="addToCart(${item.id})" class="item-name">${item.name}</a>
            <div class="item-info">Creator: <span class="blue-link">${item.creator || 'Demo'}</span></div>
            <div class="item-stats">
                Favoritos: ${isFavorited ? 1 : 0} 
                <button onclick="toggleFavorite(${item.id})" class="fav-btn ${isFavorited ? 'active' : ''}">
                    ${isFavorited ? '★' : '☆'}
                </button>
            </div>
            <div class="item-stats">Vendidos: ${salesCount}</div>
            <div class="price-robux">MXN$: ${item.price}</div>
        `;
        grid.appendChild(card);
    });

    // 4. Renderizar botones de paginación
    renderPaginationButtons(totalPages, paginationControls);
}

function renderPaginationButtons(totalPages, container) {
    container.innerHTML = '';
    if (totalPages <= 1) return;

    // Contenedor interno para alinear a la derecha
    const wrapper = document.createElement('div');
    wrapper.className = 'pagination-wrapper';

    // 1. Mostrar "<< Anterior" SOLO si NO estás en la página 1
    if (currentPage > 1) {
        const prevLink = document.createElement('span');
        prevLink.innerHTML = '<< Anterior';
        prevLink.className = 'nav-link';
        prevLink.onclick = () => { 
            currentPage--; 
            renderCatalog(); 
            window.scrollTo(0, 0); 
        };
        wrapper.appendChild(prevLink);
    }

    // 2. Texto central "Página X de Y" (siempre visible)
    const info = document.createElement('span');
    info.className = 'page-info-text';
    info.innerText = ` Página ${currentPage} de ${totalPages} `;
    wrapper.appendChild(info);

    // 3. Mostrar "Siguiente >>" SOLO si NO estás en la última página
    if (currentPage < totalPages) {
        const nextLink = document.createElement('span');
        nextLink.innerHTML = 'Siguiente >>';
        nextLink.className = 'nav-link';
        nextLink.onclick = () => { 
            currentPage++; 
            renderCatalog(); 
            window.scrollTo(0, 0); 
        };
        wrapper.appendChild(nextLink);
    }

    container.appendChild(wrapper);
}

const items = [
    { id: 1, name: "Playera Frutiger Aero", price: 300, creator: "Demo", badge: "INSTOCK", badgeText: "En stock", img: "../assets/images/aeroshirt.png" },
    { id: 2, name: "Jeans 911", price: 1200, creator: "Demo", badge: "INSTOCK", badgeText: "En stock", img: "../assets/images/911jeans.png" },
    { id: 3, name: "Playera Amante de Israel", price: 300, creator: "Demo", badge: "NEW", badgeText: "Nuevo", img: "../assets/images/israel.png" },
    { id: 4, name: "Playera de la Isla de Jeffrey", price: 300, creator: "Demo", badge: "OUTSTOCK", badgeText: "Sin stock", img: "../assets/images/jeffrey.png" },
    { id: 5, name: "Sueter de Skybox", price: 1200, creator: "Demo", badge: "NEW", badgeText: "Nuevo", img: "../assets/images/skybox.png" },
    { id: 6, name: "Quarter Zip de Jeffrey", price: 1400, creator: "Demo", badge: "OUTSTOCK", badgeText: "Sin stock", img: "../assets/images/jeffreyquarterzip.png" },

    { id: 7, name: "Playera Frutiger Aero", price: 300, creator: "Demo", badge: "INSTOCK", badgeText: "En stock", img: "../assets/images/aeroshirt.png" },
    { id: 8, name: "Jeans 911", price: 1200, creator: "Demo", badge: "INSTOCK", badgeText: "En stock", img: "../assets/images/911jeans.png" },
    { id: 9, name: "Playera Amante de Israel", price: 300, creator: "Demo", badge: "NEW", badgeText: "Nuevo", img: "../assets/images/israel.png" },
    { id: 10, name: "Playera de la Isla de Jeffrey", price: 300, creator: "Demo", badge: "OUTSTOCK", badgeText: "Sin stock", img: "../assets/images/jeffrey.png" },
    { id: 11, name: "Sueter de Skybox", price: 1200, creator: "Demo", badge: "NEW", badgeText: "Nuevo", img: "../assets/images/skybox.png" },
    { id: 12, name: "Quarter Zip de Jeffrey", price: 1400, creator: "Demo", badge: "OUTSTOCK", badgeText: "Sin stock", img: "../assets/images/jeffreyquarterzip.png" },

    { id: 13, name: "Playera Frutiger Aero", price: 300, creator: "Demo", badge: "INSTOCK", badgeText: "En stock", img: "../assets/images/aeroshirt.png" },
    { id: 14, name: "Jeans 911", price: 1200, creator: "Demo", badge: "INSTOCK", badgeText: "En stock", img: "../assets/images/911jeans.png" },
    { id: 15, name: "Playera Amante de Israel", price: 300, creator: "Demo", badge: "NEW", badgeText: "Nuevo", img: "../assets/images/israel.png" },
    { id: 16, name: "Playera de la Isla de Jeffrey", price: 300, creator: "Demo", badge: "OUTSTOCK", badgeText: "Sin stock", img: "../assets/images/jeffrey.png" },
    { id: 17, name: "Sueter de Skybox", price: 1200, creator: "Demo", badge: "NEW", badgeText: "Nuevo", img: "../assets/images/skybox.png" },
    { id: 18, name: "Quarter Zip de Jeffrey", price: 1400, creator: "Demo", badge: "OUTSTOCK", badgeText: "Sin stock", img: "../assets/images/jeffreyquarterzip.png" }
];

let cart = JSON.parse(localStorage.getItem('cart_items')) || [];

function addToCart(itemId) {
    const item = items.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveAndRenderCart();
}

function saveAndRenderCart() {
    localStorage.setItem('cart_items', JSON.stringify(cart));
    const cartList = document.getElementById('cart-list');
    const emptyMsg = document.getElementById('cart-empty-msg');
    const cartActions = document.getElementById('cart-actions'); // El nuevo contenedor
    
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        cartActions.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        cartActions.style.display = 'flex'; // Muestra el grupo de botones
        
        cart.forEach(item => {
            const li = document.createElement('li');
            const shortName = item.name.length > 15 ? item.name.substring(0, 12) + "..." : item.name;
            li.innerHTML = `<strong>${shortName}</strong> - x${item.quantity}`;
            cartList.appendChild(li);
        });
    }
}

// Estado global del filtro actual
let currentFilter = 'all';

function getItemStatus(itemId) {
    const status = localStorage.getItem(`fav_item_${itemId}`);
    return status === 'true';
}

function toggleFavorite(itemId) {
    const currentStatus = getItemStatus(itemId);
    localStorage.setItem(`fav_item_${itemId}`, !currentStatus);
    renderCatalog(); 
}

function getSales(itemId) {
    let sales = localStorage.getItem(`sales_item_${itemId}`);
    if (!sales) {
        sales = Math.floor(Math.random() * 500) + 50;
        localStorage.setItem(`sales_item_${itemId}`, sales);
    }
    return parseInt(sales);
}

function renderCatalog() {
    const grid = document.getElementById('product-grid');
    const paginationControls = document.getElementById('pagination-controls');
    if (!grid) return;

    // 1. Filtrar primero según la categoría seleccionada
    let filteredItems = [...items];
    if (currentFilter === 'favorites') {
        filteredItems.sort((a, b) => (getItemStatus(b.id) ? 1 : 0) - (getItemStatus(a.id) ? 1 : 0));
    } else if (currentFilter === 'sales') {
        filteredItems.sort((a, b) => getSales(b.id) - getSales(a.id));
    } else if (currentFilter === 'new') {
        filteredItems = filteredItems.filter(item => item.badge === 'NEW');
    }

    // 2. Calcular paginación sobre los items ya filtrados
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    
    // Si la página actual es mayor al total (por un filtro nuevo), resetear a 1
    if (currentPage > totalPages && totalPages > 0) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    grid.innerHTML = '';

    // 3. Dibujar los 16 productos
    paginatedItems.forEach(item => {
        const isFavorited = getItemStatus(item.id);
        const salesCount = getSales(item.id);
        const card = document.createElement('div');
        card.className = 'card';
        
        let badgeHtml = item.badge 
            ? `<span class="badge ${item.badge.toLowerCase()}">${item.badgeText || item.badge}</span>` 
            : '';

        card.innerHTML = `
            <div class="image-container">
                <img src="${item.img}">
                ${badgeHtml}
            </div>
            <a href="javascript:void(0)" class="item-name" onclick="openProductDetail(${item.id})">${item.name}</a>
            <div class="item-info">Creador: <span class="blue-link">${item.creator}</span></div>
            <div class="item-stats">
                Favoritos: ${isFavorited ? 1 : 0} 
                <button onclick="toggleFavorite(${item.id})" class="fav-btn ${isFavorited ? 'active' : ''}">
                    ${isFavorited ? '★' : '☆'}
                </button>
            </div>
            <div class="item-stats">Vendidos: ${salesCount}</div>
    
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                <div class="price-robux">MXN$: ${item.price}</div>
                <button onclick="addToCart(${item.id})" class="add-to-cart-btn">
                    <img src="assets/icons/cart-icon.png" alt="Añadir"> 
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // 4. Dibujar los botones de página
    renderPaginationButtons(totalPages, paginationControls);
}

// Configurar los eventos de clic para el menú lateral
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    saveAndRenderCart();
});

saveAndRenderCart();

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get('producto');
    
    if (productSlug) {
        const item = items.find(i => 
            i.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') === productSlug
        );
        if (item) openProductDetail(item.id);
    }
});

// --- MANEJO DE NAVEGACIÓN (SIDEBAR) ---
document.querySelectorAll('.browse-list li').forEach(item => {
    item.addEventListener('click', function() {
        const nuevoTitulo = this.textContent.trim();

        // 1. Quitar clase active de todos y ponerla en el seleccionado
        document.querySelectorAll('.browse-list li').forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        // 2. ACTUALIZAR TÍTULOS (Catálogo y Detalle si existe)
        // Actualiza el del catálogo
        const contentHeader = document.querySelector('.content > .content-header h2');
        if (contentHeader) contentHeader.textContent = nuevoTitulo;

        // Actualiza el del detalle del producto (la barra negra dinámica)
        const dynamicHeader = document.querySelector('#dynamic-detail-header h2');
        if (dynamicHeader) dynamicHeader.textContent = nuevoTitulo;

        // 3. Actualizar descripción según la categoría
        const description = document.querySelector('.category-description');
        if (description) {
            if (nuevoTitulo === "Top favoritos") {
                description.textContent = "Explora los objetos más valorados por la comunidad de 4kStore.";
            } else if (nuevoTitulo === "Más vendidos") {
                description.textContent = "Echa un vistazo a los artículos que todos están comprando ahora mismo.";
            } else {
                description.textContent = "Objetos de Avatar - Roblox tiene un catálogo lleno de objetos increíbles...";
            }
        }

        // 4. Si el usuario hace clic en una categoría estando en el detalle, 
        // lo ideal es regresarlo al catálogo para que vea los resultados.
        const detailView = document.getElementById('product-detail-view');
        if (detailView && detailView.style.display === 'block') {
            closeProductDetail();
        }

        // 5. Actualizar filtro, resetear página y re-renderizar
        currentFilter = this.getAttribute('data-filter');
        currentPage = 1; 
        renderCatalog();
    });
});

renderCatalog();
