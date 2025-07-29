document.addEventListener('DOMContentLoaded', function() {
    // Charger les véhicules
    async function loadVehicles() {
        try {
            // En production, remplacer par un appel API réel avec les paramètres de filtre
            const response = await fetch('data/vehicles.json');
            let vehicles = await response.json();
            
            // Appliquer les filtres si nécessaire
            const urlParams = new URLSearchParams(window.location.search);
            const typeFilter = urlParams.get('type');
            const statusFilter = urlParams.get('status');
            
            if(typeFilter) {
                vehicles = vehicles.filter(v => v.type === typeFilter);
            }
            
            if(statusFilter) {
                vehicles = vehicles.filter(v => v.status === statusFilter);
            }
            
            // Trier les véhicules
            const sortSelect = document.getElementById('vehicleSort');
            if(sortSelect) {
                sortSelect.addEventListener('change', function() {
                    sortVehicles(this.value, vehicles);
                });
            }
            
            // Afficher les véhicules
            displayVehicles(vehicles);
            
        } catch (error) {
            console.error('Erreur lors du chargement des véhicules:', error);
            document.getElementById('vehiclesGrid').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Une erreur est survenue lors du chargement des véhicules. Veuillez réessayer plus tard.</p>
                </div>
            `;
        }
    }
    
    // Afficher les véhicules
    function displayVehicles(vehicles) {
        const grid = document.getElementById('vehiclesGrid');
        if(!grid) return;
        
        if(vehicles.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-car-crash"></i>
                    <h3>Aucun véhicule trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche.</p>
                    <a href="vehicules.html" class="btn">Réinitialiser les filtres</a>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = vehicles.map(vehicle => `
            <div class="vehicle-card" data-id="${vehicle.id}">
                <div class="vehicle-image">
                    <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
                    <span class="vehicle-status">${vehicle.status}</span>
                    <div class="vehicle-actions">
                        <button class="quick-view" data-id="${vehicle.id}"><i class="fas fa-eye"></i> Voir rapide</button>
                    </div>
                </div>
                <div class="vehicle-info">
                    <h3>${vehicle.make} ${vehicle.model} ${vehicle.year}</h3>
                    <div class="vehicle-specs">
                        <span><i class="fas fa-tachometer-alt"></i> ${vehicle.mileage} km</span>
                        <span><i class="fas fa-gas-pump"></i> ${vehicle.fuel}</span>
                        <span><i class="fas fa-cog"></i> ${vehicle.transmission}</span>
                    </div>
                    <div class="vehicle-price">${vehicle.price} $</div>
                    <div class="vehicle-btns">
                        <a href="vehicules.html?id=${vehicle.id}" class="btn">Détails</a>
                        <button class="btn btn-secondary contact-btn" data-id="${vehicle.id}">
                            <i class="fas fa-phone"></i> Contact
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Gestion de la vue rapide
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const vehicleId = this.getAttribute('data-id');
                showVehicleModal(vehicleId);
            });
        });
    }
    
    // Trier les véhicules
    function sortVehicles(sortValue, vehicles) {
        switch(sortValue) {
            case 'date-desc':
                vehicles.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'date-asc':
                vehicles.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
                break;
            case 'price-asc':
                vehicles.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                vehicles.sort((a, b) => b.price - a.price);
                break;
            case 'mileage-asc':
                vehicles.sort((a, b) => a.mileage - b.mileage);
                break;
        }
        
        displayVehicles(vehicles);
    }
    
    // Afficher la modale de véhicule
    async function showVehicleModal(vehicleId) {
        try {
            // En production, remplacer par un appel API réel
            const response = await fetch(`data/vehicle-${vehicleId}.json`);
            const vehicle = await response.json();
            
            const modalContent = document.getElementById('modalVehicleContent');
            modalContent.innerHTML = `
                <div class="modal-vehicle">
                    <div class="modal-vehicle-gallery">
                        <div class="main-image">
                            <img src="${vehicle.images[0]}" alt="${vehicle.make} ${vehicle.model}" id="mainVehicleImage">
                        </div>
                        <div class="thumbnail-container">
                            ${vehicle.images.map((img, index) => `
                                <img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-vehicle-details">
                        <h2>${vehicle.make} ${vehicle.model} ${vehicle.year}</h2>
                        <div class="vehicle-price">${vehicle.price} $</div>
                        
                        <div class="vehicle-specs">
                            <div class="spec-item">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>Kilométrage: ${vehicle.mileage} km</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-gas-pump"></i>
                                <span>Carburant: ${vehicle.fuel}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-cog"></i>
                                <span>Transmission: ${vehicle.transmission}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-car"></i>
                                <span>Type: ${vehicle.type}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-paint-brush"></i>
                                <span>Couleur: ${vehicle.color}</span>
                            </div>
                        </div>
                        
                        <div class="vehicle-description">
                            <h3>Description</h3>
                            <p>${vehicle.description}</p>
                        </div>
                        
                        <div class="vehicle-features">
                            <h3>Caractéristiques</h3>
                            <ul>
                                ${vehicle.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="modal-vehicle-actions">
                            <a href="contact.html?subject=Demande%20sur%20le%20véhicule%20${vehicle.make}%20${vehicle.model}" class="btn">
                                <i class="fas fa-envelope"></i> Demande d'info
                            </a>
                            <a href="contact.html#rdv" class="btn btn-secondary">
                                <i class="fas fa-calendar-alt"></i> Essai routier
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Gestion des thumbnails
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const mainImage = document.getElementById('mainVehicleImage');
                    mainImage.src = this.getAttribute('data-image');
                    
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Afficher la modale
            document.getElementById('vehicleModal').style.display = "block";
            
        } catch (error) {
            console.error('Erreur lors du chargement du véhicule:', error);
            showSuccessModal("Une erreur est survenue lors du chargement des détails du véhicule.");
        }
    }
    
    // Gestion du formulaire de filtre
    const filterForm = document.getElementById('vehicleFilterForm');
    if(filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('vehicleType').value;
            const status = document.getElementById('vehicleStatus').value;
            const brand = document.getElementById('vehicleBrand').value;
            const price = document.getElementById('priceRange').value;
            
            // Construire l'URL avec les paramètres
            let url = 'vehicules.html?';
            if(type !== 'all') url += `type=${type}&`;
            if(status !== 'all') url += `status=${status}&`;
            if(brand !== 'all') url += `brand=${brand}&`;
            if(price !== 'all') url += `maxPrice=${price}`;
            
            // Charger les véhicules filtrés
            window.location.href = url;
        });
    }
    
    // Charger les véhicules au démarrage
    if(document.getElementById('vehiclesGrid')) {
        loadVehicles();
    }
});