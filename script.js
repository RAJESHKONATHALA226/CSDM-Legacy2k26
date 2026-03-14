document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       ELEMENTS
    =============================== */

    const leftGate = document.querySelector(".gate-door.left");
    const rightGate = document.querySelector(".gate-door.right");
    const cameraContainer = document.getElementById("camera-container");
    const heroContent = document.getElementById("hero-content");
    const audio = document.getElementById("gate-audio");

    /* ===============================
       1️⃣ 3D GATE OPEN
    =============================== */

    setTimeout(() => {

        leftGate.classList.add("open");
        rightGate.classList.add("open");

        if (audio) {
            audio.volume = 0.5;
            audio.play().catch(() => { });
        }

        setTimeout(() => {

            cameraContainer.classList.add("zoomed");

            setTimeout(() => {

                heroContent.classList.remove("hidden");
                void heroContent.offsetWidth;
                heroContent.classList.add("visible");

                startConfetti();

            }, 1000);

        }, 1500);

    }, 2000);


    /* ===============================
       2️⃣ COUNTDOWN
    =============================== */

    const targetDate = new Date("2026-03-17T09:00:00").getTime();
    const countdownContainer = document.getElementById("countdown");

    function updateCountdown() {

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {

            countdownContainer.innerHTML =
                `<h2 class="title" style="font-size:3rem;">Enjoy The Farewell Party 🎉</h2>`;
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownContainer.innerHTML = `
        <div class="time-box">
            <div class="time-val">${String(days).padStart(2, "0")}</div>
            <div class="time-label">Days</div>
        </div>

        <div class="time-box">
            <div class="time-val">${String(hours).padStart(2, "0")}</div>
            <div class="time-label">Hours</div>
        </div>

        <div class="time-box">
            <div class="time-val">${String(minutes).padStart(2, "0")}</div>
            <div class="time-label">Minutes</div>
        </div>

        <div class="time-box">
            <div class="time-val">${String(seconds).padStart(2, "0")}</div>
            <div class="time-label">Seconds</div>
        </div>
        `;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ===============================
       3️⃣ CONFETTI
    =============================== */

    function startConfetti() {

        const canvas = document.getElementById("celebration-canvas");
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();

        const particles = [];

        const colors = [
            "#ffd700",
            "#ffaa00",
            "#ffffff",
            "#8e44ad",
            "#9b59b6"
        ];

        for (let i = 0; i < 150; i++) {

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 2,
                dx: Math.random() * 2 - 1,
                dy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10
            });

        }

        function draw() {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {

                p.tilt += 0.1;
                p.y += p.dy;
                p.x += p.dx;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;

                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);

                ctx.stroke();

                if (p.y > canvas.height) {

                    particles[i] = {
                        ...p,
                        y: -10,
                        x: Math.random() * canvas.width
                    };

                }

            });

            requestAnimationFrame(draw);

        }

        draw();

        window.addEventListener("resize", resizeCanvas);

    }

});


/* ===============================
4️⃣ RANDOM PHOTO SLIDER
=============================== */

const TOTAL_IMAGES = 13;

let images = [];
let currentIndex = 0;
let sliderInterval = null;

/* load numbered images */
for (let i = 1; i <= TOTAL_IMAGES; i++) {
    images.push(`assets/${i}.jpg`);
}

/* shuffle images */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/* OPEN SLIDER */
window.openSlider = function () {
    const slider = document.getElementById("photo-slider");
    const img = document.getElementById("slider-image");

    shuffle(images);
    slider.classList.remove("hidden");
    currentIndex = 0;
    img.src = images[currentIndex];

    // Clear any existing interval before starting a new one
    if (sliderInterval) clearInterval(sliderInterval);

    sliderInterval = setInterval(() => {
        nextPhoto();
    }, 3000); // 3 seconds per slide for better "wow" effect
}

/* CLOSE SLIDER */
window.closeSlider = function () {
    const slider = document.getElementById("photo-slider");
    slider.classList.add("hidden");
    if (sliderInterval) clearInterval(sliderInterval);
}

/* NEXT PHOTO */
window.nextPhoto = function () {
    const img = document.getElementById("slider-image");
    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex];
}

/* PREVIOUS PHOTO */
window.prevPhoto = function () {
    const img = document.getElementById("slider-image");
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    img.src = images[currentIndex];
}

/* ===============================
5️⃣ EVENT DETAILS MODAL
=============================== */

window.openEventDetails = function () {
    const modal = document.getElementById("event-details-modal");
    modal.classList.remove("hidden");
}

window.closeEventDetails = function () {
    const modal = document.getElementById("event-details-modal");
    modal.classList.add("hidden");
}