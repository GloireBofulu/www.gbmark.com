document.addEventListener('DOMContentLoaded', function() {
    // Charger les pièces
    async function loadPieces() {
        try {
            // En production, remplacer par un appel API réel avec les paramètres de filtre
            const response = await fetch('data/pieces.json');
            let pieces = await response.json();
            
            // Appliquer les filtres de l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const categoryFilter = urlParams.get('category');
            
            if(categoryFilter) {
                pieces = pieces.filter(p => p.category === categoryFilter);
                // Mettre à jour le titre si filtre par catégorie
                const categoryTitle = document.querySelector('.list-header h2');
                if(categoryTitle) {
                    const categoryName = getCategoryName(categoryFilter);
                    categoryTitle.textContent = `Pièces ${categoryName}`;
                }
            }
            
            // Trier les pièces
            const sortSelect = document.getElementById('pieceSort');
            if(sortSelect) {
                sortSelect.addEventListener('change', function() {
                    sortPieces(this.value, pieces);
                });
            }
            
            // Afficher les pièces
            displayPieces(pieces);
            
        } catch (error) {
            console.error('Erreur lors du chargement des pièces:', error);
            document.getElementById('piecesGrid').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Une erreur est survenue lors du chargement des pièces. Veuillez réessayer plus tard.</p>
                </div>
            `;
        }
    }
    
    // Obtenir le nom d'une catégorie
    function getCategoryName(categoryId) {
        const categories = {
            'moteur': 'Moteur',
            'freinage': 'Freinage',
            'suspension': 'Suspension',
            'carrosserie': 'Carrosserie',
            'electrique': 'Électrique',
            'accessoire': 'Accessoires'
        };
        
        return categories[categoryId] || '';
    }
    
    // Afficher les pièces
    function displayPieces(pieces) {
        const grid = document.getElementById('piecesGrid');
        if(!grid) return;
        
        if(pieces.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-cogs"></i>
                    <h3>Aucune pièce trouvée</h3>
                    <p>Essayez de modifier vos critères de recherche.</p>
                    <a href="pieces.html" class="btn">Réinitialiser les filtres</a>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = pieces.map(piece => `
            <div class="piece-card" data-id="${piece.id}">
                <div class="piece-image">
                    <img src="${piece.image}" alt="${piece.name}">
                    <span class="piece-condition">${piece.condition}</span>
                </div>
                <div class="piece-info">
                    <h3>${piece.name}</h3>
                    <div class="piece-meta">
                        <span class="piece-ref">Réf: ${piece.reference}</span>
                        <span class="piece-compatibility">${piece.compatibility}</span>
                    </div>
                    <div class="piece-price">${piece.price} $</div>
                    <div class="piece-stock ${piece.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${piece.stock > 0 ? 'En stock' : 'Sur commande'}
                    </div>
                    <div class="piece-actions">
                        <button class="btn quick-view" data-id="${piece.id}">Voir détails</button>
                        <button class="btn btn-secondary contact-btn" data-id="${piece.id}">
                            <i class="fas fa-shopping-cart"></i> Commander
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Gestion de la vue rapide
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const pieceId = this.getAttribute('data-id');
                showPieceModal(pieceId);
            });
        });
    }
    
    // Trier les pièces
    function sortPieces(sortValue, pieces) {
        switch(sortValue) {
            case 'date-desc':
                pieces.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'price-asc':
                pieces.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                pieces.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                pieces.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        displayPieces(pieces);
    }
    
    // Afficher la modale de pièce
    async function showPieceModal(pieceId) {
        try {
            // En production, remplacer par un appel API réel
            const response = await fetch(`data/piece-${pieceId}.json`);
            const piece = await response.json();
            
            const modalContent = document.getElementById('modalPieceContent');
            modalContent.innerHTML = `
                <div class="modal-piece">
                    <div class="modal-piece-images">
                        <div class="main-image">
                            <img src="${piece.images[0]}" alt="${piece.name}" id="mainPieceImage">
                        </div>
                        <div class="thumbnail-container">
                            ${piece.images.map((img, index) => `
                                <img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-piece-details">
                        <h2>${piece.name}</h2>
                        <div class="piece-price">${piece.price} $</div>
                        
                        <div class="piece-meta">
                            <div class="meta-item">
                                <strong>Référence:</strong> ${piece.reference}
                            </div>
                            <div class="meta-item">
                                <strong>Marque pièce:</strong> ${piece.brand}
                            </div>
                            <div class="meta-item">
                                <strong>Compatibilité:</strong> ${piece.compatibility}
                            </div>
                            <div class="meta-item">
                                <strong>État:</strong> ${piece.condition}
                            </div>
                            <div class="meta-item stock ${piece.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                                <strong>Disponibilité:</strong> ${piece.stock > 0 ? 'En stock' : 'Sur commande (délai: ${piece.deliveryTime})'}
                            </div>
                        </div>
                        
                        <div class="piece-description">
                            <h3>Description</h3>
                            <p>${piece.description}</p>
                        </div>
                        
                        <div class="piece-specs">
                            <h3>Spécifications techniques</h3>
                            <ul>
                                ${piece.specs.map(spec => `<li><strong>${spec.name}:</strong> ${spec.value}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="modal-piece-actions">
                            <form class="order-form">
                                <div class="form-group">
                                    <label for="pieceQuantity">Quantité</label>
                                    <input type="number" id="pieceQuantity" min="1" max="${piece.stock}" value="1">
                                </div>
                                <button type="submit" class="btn">
                                    <i class="fas fa-shopping-cart"></i> Ajouter au panier
                                </button>
                            </form>
                            <a href="contact.html?subject=Demande%20sur%20la%20pièce%20${piece.reference}" class="btn btn-secondary">
                                <i class="fas fa-question-circle"></i> Question sur cette pièce
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Gestion des thumbnails
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const mainImage = document.getElementById('mainPieceImage');
                    mainImage.src = this.getAttribute('data-image');
                    
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Gestion du formulaire de commande
            const orderForm = document.querySelector('.order-form');
            if(orderForm) {
                orderForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const quantity = document.getElementById('pieceQuantity').value;
                    
                    // Ici, vous ajouteriez normalement la pièce au panier
                    console.log(`Commande de ${quantity} x ${piece.reference}`);
                    showSuccessModal(`${quantity} x ${piece.name} ajouté à votre panier!`);
                });
            }
            
            // Afficher la modale
            document.getElementById('pieceModal').style.display = "block";
            
        } catch (error) {
            console.error('Erreur lors du chargement de la pièce:', error);
            showSuccessModal("Une erreur est survenue lors du chargement des détails de la pièce.");
        }
    }
    
    // Gestion du formulaire de recherche
    const searchForm = document.getElementById('pieceSearchForm');
    if(searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = document.getElementById('pieceSearchInput').value;
            const category = document.getElementById('pieceCategory').value;
            const brand = document.getElementById('pieceBrand').value;
            const condition = document.getElementById('pieceCondition').value;
            
            // Construire l'URL avec les paramètres
            let url = 'pieces.html?';
            if(searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
            if(category !== 'all') url += `category=${category}&`;
            if(brand !== 'all') url += `brand=${brand}&`;
            if(condition !== 'all') url += `condition=${condition}`;
            
            // Charger les pièces filtrées
            window.location.href = url;
        });
    }
    
    // Charger les pièces au démarrage
    if(document.getElementById('piecesGrid')) {
        loadPieces();
    }
});