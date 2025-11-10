// Generar partículas de fondo
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tamaño aleatorio
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Delay de animación aleatorio
        particle.style.animationDelay = Math.random() * 15 + 's';
        
        // Duración de animación aleatoria
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Modal "Próximamente"
const modal = document.getElementById('comingSoonModal');
const closeModal = document.querySelector('.close-modal');
const worldCards = document.querySelectorAll('.world-card:not(.active)');

// Abrir modal para mundos inactivos
worldCards.forEach(card => {
    card.addEventListener('click', () => {
        modal.classList.add('show');
    });
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('show');
    }
});

// Efectos de hover en tarjetas
const allCards = document.querySelectorAll('.world-card');
allCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const colors = this.querySelector('.world-colors');
        if (colors) {
            colors.style.transform = 'scaleX(1.1)';
            colors.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const colors = this.querySelector('.world-colors');
        if (colors) {
            colors.style.transform = 'scaleX(1)';
        }
    });
});

// Inicializar partículas al cargar la página
window.addEventListener('load', () => {
    createParticles();
});
