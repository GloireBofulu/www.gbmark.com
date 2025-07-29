document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            // Ici, vous enverriez normalement ces données à votre serveur
            console.log('Message envoyé:', { name, email, phone, subject, message });
            
            // Afficher un message de succès
            showSuccessModal('Merci pour votre message! Nous vous contacterons dans les plus brefs délais.');
            contactForm.reset();
        });
    }
    
    // Gestion du formulaire de rendez-vous
    const appointmentForm = document.getElementById('appointmentForm');
    if(appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('appointmentName').value;
            const email = document.getElementById('appointmentEmail').value;
            const phone = document.getElementById('appointmentPhone').value;
            const type = document.getElementById('appointmentType').value;
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            const notes = document.getElementById('appointmentMessage').value;
            
            // Ici, vous enverriez normalement ces données à votre serveur
            console.log('Rendez-vous pris:', { name, email, phone, type, date, time, notes });
            
            // Afficher un message de succès
            showSuccessModal(`Votre rendez-vous pour un ${getAppointmentType(type)} est confirmé pour le ${date} à ${time}.`);
            appointmentForm.reset();
        });
    }
    
    // Gestion du formulaire de demande spéciale
    const requestForm = document.getElementById('specialRequestForm');
    if(requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('requestName').value;
            const email = document.getElementById('requestEmail').value;
            const phone = document.getElementById('requestPhone').value;
            const type = document.getElementById('requestType').value;
            const details = document.getElementById('requestDetails').value;
            const deadline = document.getElementById('requestDeadline').value;
            const budget = document.getElementById('requestBudget').value;
            
            // Ici, vous enverriez normalement ces données à votre serveur
            console.log('Demande spéciale:', { name, email, phone, type, details, deadline, budget });
            
            // Afficher un message de succès
            showSuccessModal('Merci pour votre demande spéciale! Notre équipe vous contactera pour discuter des détails.');
            requestForm.reset();
        });
    }
    
    // Obtenir le texte du type de rendez-vous
    function getAppointmentType(type) {
        const types = {
            'showroom': 'visite du showroom',
            'test-drive': 'essai routier',
            'consultation': 'consultation véhicule',
            'piece': 'consultation pièces'
        };
        
        return types[type] || 'rendez-vous';
    }
    
    // Initialiser le sélecteur de date et heure
    if(document.getElementById('appointmentDate')) {
        flatpickr('#appointmentDate', {
            dateFormat: "d/m/Y",
            minDate: "today",
            locale: "fr",
            disable: [
                function(date) {
                    // Désactiver les dimanches
                    return (date.getDay() === 0);
                }
            ]
        });
    }
    
    // Gestion de la carte interactive
    if(document.querySelector('.map-container iframe')) {
        // Vous pourriez ajouter ici des interactions avec la carte si nécessaire
        console.log('Carte Google Maps chargée');
    }
});