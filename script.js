/* --- FIRE CANVAS LOGIC --- */
const canvas = document.getElementById('fire-canvas');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
let mouse = { x: -1000, y: -1000, vx: 0 };
let lastX = 0;

function initCanvases() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = 200; // MUST match CSS height
}
window.addEventListener('resize', initCanvases);
initCanvases();

// Interaction restricted to fire zone
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (localY >= 0 && localY <= h) {
        mouse.x = localX;
        mouse.y = localY;
        mouse.vx = mouse.x - lastX;
    } else {
        mouse.x = -1000;
        mouse.y = -1000;
        mouse.vx = 0;
    }
    lastX = localX;
});

class FireParticle {
    constructor() {
        this.x = Math.random() * w;
        this.y = h;
        this.maxSize = Math.random() * 20 + 10;
        this.size = this.maxSize;
        this.speedY = Math.random() * 1.5 + 1;
        this.velX = (Math.random() - 0.5) * 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.015 + 0.01;
    }
    update() {
        if (mouse.y >= 0) {
            let dx = mouse.x - this.x;
            let dist = Math.abs(dx);
            if (dist < 150) {
                this.velX += (dx > 0 ? -1 : 1) * 0.4;
                this.velX += mouse.vx * 0.05;
            }
        }
        this.y -= this.speedY;
        this.x += this.velX;
        this.velX *= 0.95;
        this.life -= this.decay;
        this.size = Math.max(0, this.maxSize * this.life);
    }
    draw() {
        ctx.beginPath();
        let g = Math.floor(this.life * 200);
        let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(255, ${g}, 0, ${this.life})`);
        grad.addColorStop(1, `rgba(50, 0, 0, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    if (particles.length < 400) {
        for (let i = 0; i < 10; i++) particles.push(new FireParticle());
    }
    particles.forEach((p, i) => {
        p.update();
        if (p.life <= 0) particles.splice(i, 1);
        else p.draw();
    });
    requestAnimationFrame(animate);
}
animate();


/* --- INFERNO SPEED LOGIC --- */

function pullLever() {
    const lever = document.querySelector('.lever-wrapper');
    const status = document.getElementById('status');
    const note = document.getElementById('demon-note');

    // Prevent double pulls
    if (lever.classList.contains('pulled')) return;
    

    note.classList.remove('show');
    

    lever.classList.add('pulled');
    document.body.classList.add('is-climbing');
    status.innerText = "ASCENDING...";

    simulateTest();
}

let speedInterval; 

function simulateTest() {
    // 1. DEFINE THE TARGETS
    // We determine the "Final Result" immediately, but we simulate the journey there.
    const finalSpeed = Math.floor(Math.random() * 1400) + 300; 
    
    // "Burst" Speed: Real networks often burst 10-20% higher at the start
    const burstSpeed = finalSpeed * 1.15; 

    let currentDisplaySpeed = 0;
    const duration = 5000; 
    const tickRate = 20;   
    let elapsedTime = 0;

    // Clear any existing test
    if (speedInterval) clearInterval(speedInterval);

    speedInterval = setInterval(() => {
        elapsedTime += tickRate;
        const progress = elapsedTime / duration; // 0.0 to 1.0

        if (progress >= 1) {
            clearInterval(speedInterval);
            // Ensure we finish exactly on the final determined speed for consistency
            finishTest(finalSpeed); 
            return;
        }

        // 2. CALCULATE "INSTANT" TARGET SPEED
        // Instead of a static number, the "Network" changes over time.
        let instantTarget = 0;

        if (progress < 0.2) {
            // PHASE 1: EXPONENTIAL RAMP 
            // Steep power curve to simulate connection establishing
            instantTarget = burstSpeed * Math.pow(progress / 0.2, 2.5);
        } 
        else if (progress < 0.6) {
            // PHASE 2: BURST & CORRECTION
            // Hover around the burst speed, then slowly decay towards final speed
            const subProgress = (progress - 0.2) / 0.4;
            // Linear interpolation from Burst -> Final
            instantTarget = burstSpeed - ((burstSpeed - finalSpeed) * subProgress);
        } 
        else {
            // PHASE 3: STABILIZATION (The "Wobble")
            // We are near the final speed, but we add a Sine wave drift
            const wave = Math.sin(elapsedTime * 0.008) * (finalSpeed * 0.05); // 5% wobble
            instantTarget = finalSpeed + wave;
        }
        // 3. ADD MICRO-JITTER (Noise)
        const noise = (Math.random() - 0.5) * (finalSpeed * 0.02);
        instantTarget += noise;
        // 4. PHYSICS (The "Needle Lag")
        // We don't snap to the target. We move towards it.
        // 0.15 = The "friction" (Lower = smoother/slower, Higher = snappier)
        currentDisplaySpeed += (instantTarget - currentDisplaySpeed) * 0.15;
        // Safety clamp
        if (currentDisplaySpeed < 0) currentDisplaySpeed = 0;

        updateInfernoUI(currentDisplaySpeed);

    }, tickRate);
}

function updateInfernoUI(speed) {
    const liquid = document.getElementById('liquid-level');
    const gobletNum = document.getElementById('goblet-speed-val');
    
    // 1. UPDATE SVG LIQUID
    // Map speed (0-2000) to SVG coordinate space
    const maxSpeed = 2000;
    const emptyPos = 150; // Y position when empty
    const fullPos = 10;   // Y position when full
    const travelRange = emptyPos - fullPos;

    const percentage = Math.min(speed / maxSpeed, 1);
    const targetY = emptyPos - (percentage * travelRange);
    
    liquid.style.transform = `translateY(${targetY}px)`;

    gobletNum.innerText = speed.toFixed(0);
}

function finishTest(finalSpeed) {
    const note = document.getElementById('demon-note');
    const lever = document.querySelector('.lever-wrapper');
    const status = document.getElementById('status');
    const finalValueEl = document.getElementById('speed-value');
    const verdictEl = document.getElementById('final-verdict-text');
    const rustle = document.getElementById('rustle-sound');


    document.body.classList.remove('is-climbing');
    updateInfernoUI(finalSpeed);
    

    finalValueEl.innerText = finalSpeed.toFixed(2);
    

    if(finalSpeed < 500) verdictEl.innerText = "A torture for the soul.";
    else if(finalSpeed < 1000) verdictEl.innerText = "Acceptable suffering.";
    else verdictEl.innerText = "UNHOLY VELOCITY!";


    rustle.play();
    note.classList.add('show');


    setTimeout(() => {
        lever.classList.remove('pulled');
        status.innerText = "Ready to Climb";
    }, 2000);
}

function resetInferno() {
    if (speedInterval) clearInterval(speedInterval);

    const lever = document.querySelector('.lever-wrapper');
    lever.classList.remove('pulled');
    
    const liquid = document.getElementById('liquid-level');
    liquid.style.transform = "translateY(150px)";

    document.getElementById('goblet-speed-val').innerText = "0";
    document.getElementById('status').innerText = "Ready to Climb";
    document.getElementById('speed-value').innerText = "0.00"; // Reset the parchment text too
 
    document.getElementById('demon-note').classList.remove('show');

    document.body.classList.remove('is-climbing');
}