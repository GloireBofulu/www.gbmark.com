// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Fermer le menu mobile quand on clique sur un lien
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        });
    });

    // Onglets de formulaire de contact
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if(tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Retirer active de tous les boutons et contenus
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Ajouter active au bouton et contenu cliqué
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Initialiser les datepickers
    if(document.querySelector('.datepicker')) {
        flatpickr('.datepicker', {
            dateFormat: "d/m/Y",
            minDate: "today",
            locale: "fr"
        });
    }

    // Gestion des modales
    const modals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .modal .btn');
    
    modals.forEach(modal => {
        // Fermer la modale quand on clique sur la croix ou le bouton
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = "none";
            });
        });
        
        // Fermer la modale quand on clique en dehors
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    // Smooth scrolling pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation au défilement
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .vehicle-card, .piece-card, .department-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if(elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécuter une fois au chargement
});

// Fonction pour afficher la modale de succès
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    if(message) {
        successMessage.textContent = message;
    }
    
    modal.style.display = "block";
}

// Fonction pour charger des véhicules (exemple)
async function loadFeaturedVehicles() {
    try {
        // En production, remplacer par un appel API réel
        const response = await fetch('data/vehicles.json');
        const vehicles = await response.json();
        
        const slider = document.getElementById('vehicleSlider');
        if(slider) {
            slider.innerHTML = vehicles.slice(0, 4).map(vehicle => `
                <div class="vehicle-card">
                    <div class="vehicle-image">
                        <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
                        <span class="vehicle-status">${vehicle.status}</span>
                    </div>
                    <div class="vehicle-info">
                        <h3>${vehicle.make} ${vehicle.model} ${vehicle.year}</h3>
                        <div class="vehicle-specs">
                            <span><i class="fas fa-tachometer-alt"></i> ${vehicle.mileage} km</span>
                            <span><i class="fas fa-gas-pump"></i> ${vehicle.fuel}</span>
                            <span><i class="fas fa-cog"></i> ${vehicle.transmission}</span>
                        </div>
                        <div class="vehicle-price">${vehicle.price} $</div>
                        <a href="vehicules.html?id=${vehicle.id}" class="btn">Voir détails</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
    }
}

// Initialiser le slider de véhicules
if(document.getElementById('vehicleSlider')) {
    loadFeaturedVehicles();
    
    // Navigation du slider
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    const slider = document.querySelector('.vehicle-slider');
    
    if(nextBtn && prevBtn && slider) {
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 300, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
}

// Gestion de la newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if(newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Ici, vous enverriez normalement l'email à votre serveur
        console.log('Email à enregistrer:', email);
        
        // Afficher un message de succès
        showSuccessModal('Merci pour votre inscription à notre newsletter!');
        this.reset();
    });
}