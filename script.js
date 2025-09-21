document.addEventListener('DOMContentLoaded', () => {
    // Show welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.textContent = 'Atrapalos';
    document.body.appendChild(welcomeMessage);
    
    // Handle window resize
    function handleResize() {
        // Update any elements that need to be responsive
        const petals = document.querySelectorAll('.petal');
        petals.forEach(petal => {
            const size = parseFloat(petal.style.width);
            if (!isNaN(size)) {
                const minSize = Math.max(30, window.innerWidth * 0.05);
                const maxSize = Math.min(150, window.innerWidth * 0.15);
                const newSize = Math.min(maxSize, Math.max(minSize, size));
                petal.style.width = `${newSize}px`;
            }
        });
    }
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Remove welcome message and start game after delay
    setTimeout(() => {
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (welcomeMessage.parentNode === document.body) {
                welcomeMessage.style.display = 'none';
                document.body.removeChild(welcomeMessage);
            }
            startGame();
        }, 500);
    }, 2000);
    
    // Initialize game
    function startGame() {
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('petals-count');
    const bouquet = document.getElementById('bouquet');
    let petalsCaught = 0;
    const totalPetalsNeeded = 6;
    let gameActive = true;

    // Create falling petals
    function createPetal() {
        if (!gameActive) return;
        
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.src = 'petalo.webp';
        img.alt = 'Pétalo';
        petal.appendChild(img);
        
        // Random position at the top of the screen
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() * 200 - 100); // Slight horizontal movement
        const rotation = Math.random() * 360;
        
        // Set initial position and style
        petal.style.left = `${startX}px`;
        petal.style.top = '-30px';
        petal.style.transform = `rotate(${rotation}deg)`;
        petal.style.opacity = '0.8';
        
        // Tamaño aleatorio basado en el tamaño de la pantalla
        const minSize = Math.max(30, window.innerWidth * 0.05); // Mínimo 30px o 5% del ancho de la pantalla
        const maxSize = Math.min(150, window.innerWidth * 0.15); // Máximo 150px o 15% del ancho de la pantalla
        const size = minSize + Math.random() * (maxSize - minSize);
        petal.style.width = `${size}px`;
        
        // Random animation duration between 5s and 15s
        const duration = 5 + Math.random() * 10;
        
        // Add falling animation
        petal.style.animation = `fall ${duration}s linear forwards`;
        
        // Add click event
        petal.addEventListener('click', catchPetal);
        
        // Add to game container
        gameContainer.appendChild(petal);
        
        // Remove petal after animation ends
        setTimeout(() => {
            if (petal.parentNode === gameContainer) {
                gameContainer.removeChild(petal);
            }
        }, duration * 1000);
        
        return petal;
    }
    
    // Catch petal animation
    function catchPetal(e) {
        if (!gameActive) return;
        
        // Asegurarse de que estamos trabajando con el elemento .petal
        let petal = e.target;
        if (petal.tagName === 'IMG') {
            petal = petal.parentElement; // Si se hace clic en la imagen, subir al contenedor .petal
        }
        
        // Deshabilitar más clics
        petal.style.pointerEvents = 'none';
        
        // Animación de desaparición más suave
        petal.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
        
        // Aplicar transformaciones para una animación más natural
        petal.style.transform = 'scale(1.2) rotate(90deg) translateY(20px)';
        petal.style.opacity = '0';
        
        // Actualizar contador
        updateScore();
        
        // Eliminar después de la animación
        setTimeout(() => {
            if (petal.parentNode === gameContainer) {
                petal.style.transition = 'none';
                gameContainer.removeChild(petal);
            }
        }, 800);
    }
    
    // Update score
    function updateScore() {
        petalsCaught++;
        scoreElement.textContent = petalsCaught;
        
        // Efecto visual al capturar un pétalo
        scoreElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
        }, 200);
        
        // Check if player won
        if (petalsCaught >= totalPetalsNeeded) {
            endGame();
        }
    }
    
    // Create petals around the bouquet
    function createBouquetPetals() {
        const container = document.getElementById('bouquet-petals');
        const petalCount = 12; // Número de pétalos alrededor del ramo
        // Radio del círculo basado en el tamaño de la pantalla
        const radius = Math.min(300, window.innerWidth * 0.3);
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const petal = document.createElement('img');
            petal.src = 'petalo.webp';
            petal.className = 'bouquet-petal';
            petal.style.left = `calc(50% + ${x}px)`;
            petal.style.top = `calc(50% + ${y}px)`;
            petal.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
            // Tamaño de pétalo basado en el tamaño de la pantalla
            const petalSize = 20 + Math.random() * (window.innerWidth * 0.05);
            petal.style.width = `${Math.min(100, Math.max(30, petalSize))}px`;
            petal.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(petal);
        }
    }
    
    // End game and show bouquet
    function endGame() {
        gameActive = false;
        
        // Remove all remaining petals with animation
        document.querySelectorAll('.petal').forEach((petal, index) => {
            setTimeout(() => {
                petal.style.transition = 'all 0.5s ease-out';
                petal.style.opacity = '0';
                petal.style.transform = 'scale(0.5) rotate(180deg)';
                
                // Remove from DOM after animation
                setTimeout(() => {
                    if (petal.parentNode === gameContainer) {
                        gameContainer.removeChild(petal);
                    }
                }, 500);
            }, index * 100); // Stagger the animations
        });
        
        // Show bouquet and message after a short delay
        setTimeout(() => {
            // Show bouquet container
            bouquet.classList.remove('hidden');
            
            // Create petals around the bouquet
            createBouquetPetals();
            
            // Create some floating petals around the bouquet
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createFloatingPetal(), i * 300);
            }
        }, 1000);
    }
    
    // Create floating petals around the bouquet
    function createFloatingPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal floating';
        
        // Random position around the bouquet
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.min(200, window.innerWidth * 0.2) + Math.random() * Math.min(300, window.innerWidth * 0.3);
        const x = window.innerWidth / 2 + Math.cos(angle) * distance;
        const y = window.innerHeight / 2 + Math.sin(angle) * distance;
        
        // Random size basado en el tamaño de la pantalla
        const baseSize = Math.max(10, window.innerWidth * 0.02);
        const size = baseSize + Math.random() * baseSize * 2;
        
        // Set styles
        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 0.8}px`;
        petal.style.opacity = '0';
        petal.style.animation = `float ${3 + Math.random() * 5}s ease-in-out infinite`;
        
        // Add to game container
        gameContainer.appendChild(petal);
        
        // Fade in
        setTimeout(() => {
            petal.style.transition = 'opacity 1s';
            petal.style.opacity = '0.7';
        }, 100);
        
        // Remove after some time
        setTimeout(() => {
            petal.style.opacity = '0';
            setTimeout(() => {
                if (petal.parentNode === gameContainer) {
                    gameContainer.removeChild(petal);
                }
                if (gameActive === false) {
                    createFloatingPetal();
                }
            }, 1000);
        }, 5000 + Math.random() * 10000);
    }
    
    // Create falling petals periodically
    setInterval(createPetal, 1000);
    
    // Initial petals
    for (let i = 0; i < 5; i++) {
        setTimeout(createPetal, i * 500);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Adjust any elements that need to be responsive
    });
    } // Close startGame function
});

// Add keyframe animation for falling petals
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.8;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, calc(100vh + 30px)) rotate(${360 + Math.random() * 360}deg);
            opacity: 0.5;
        }
    }
    
    @keyframes float {
        0%, 100% { 
            transform: translate(-50%, 0) rotate(${Math.random() * 360}deg);
        }
        50% { 
            transform: translate(-50%, -10px) rotate(${Math.random() * 360}deg);
        }
    }
`;
document.head.appendChild(style);
