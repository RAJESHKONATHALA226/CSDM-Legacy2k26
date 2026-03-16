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

const TOTAL_IMAGES = 6;

let images = [];
let currentIndex = 0;
let sliderInterval = null;

/* load numbered images */
for (let i = 1; i <= TOTAL_IMAGES; i++) {
    images.push(`assets/${i}.jpeg`);
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
    img.style.cursor = "pointer";
    img.onclick = () => window.open(img.src, '_blank');

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
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // Robust lock
}

window.closeEventDetails = function () {
    const modal = document.getElementById("event-details-modal");
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto"; // Unlock
}

// Close modal when clicking outside content
window.onclick = function (event) {
    const modal = document.getElementById("event-details-modal");
    if (event.target == modal) {
        closeEventDetails();
    }
}

/* ===============================
6️⃣ API GALLERY (GRID VIEW)
=============================== */

window.openApiGallery = async function () {
    const modal = document.getElementById("api-gallery-modal");
    const grid = document.getElementById("api-gallery-grid");

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Clear previous content and show loader
    grid.innerHTML = '<div class="loader">Loading Gallery...</div>';

    try {
        const response = await fetch("https://happy.strlearners.site/api/images/");
        const images = await response.json();

        if (!images || images.length === 0) {
            grid.innerHTML = '<div class="loader">No images found.</div>';
            return;
        }

        grid.innerHTML = ""; // Clear loader

        images.forEach(imgData => {
            const item = document.createElement("div");
            item.className = "grid-item";

            const img = document.createElement("img");
            const fullUrl = `https://happy.strlearners.site/${imgData.path}`;
            img.src = fullUrl;
            img.alt = imgData.filename;

            img.onload = () => img.classList.add("loaded");

            // Open in New Tab on Click
            item.style.cursor = "pointer";
            item.onclick = () => window.open(fullUrl, '_blank');

            // Create action overlay
            const actionsContainer = document.createElement("div");
            actionsContainer.className = "image-actions";

            // WhatsApp Share Button (Guarantees Text + Link)
            const waBtn = document.createElement("button");
            waBtn.className = "action-btn wa-btn";
            waBtn.innerHTML = "💬"; // WhatsApp symbol or chat bubble
            waBtn.title = "Share to WhatsApp";
            waBtn.style.borderColor = "#25D366"; // WhatsApp Green
            waBtn.onclick = (e) => {
                e.stopPropagation();
                const text = encodeURIComponent(`CSDM Legacy 2K26 Farewell party ,Powered By Strlearners\n\nCheck out this photo: ${fullUrl}`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            };

            // Share Button (Generic OS Share)
            const shareBtn = document.createElement("button");
            shareBtn.className = "action-btn share-btn";
            shareBtn.innerHTML = "🔗"; // Share symbol
            shareBtn.title = "Share via Device";
            shareBtn.onclick = (e) => {
                e.stopPropagation(); // Avoid triggering other clicks
                shareImage(fullUrl, imgData.filename);
            };

            // Download Button
            const downloadBtn = document.createElement("button");
            downloadBtn.className = "action-btn download-btn";
            downloadBtn.innerHTML = "⬇"; // Download symbol
            downloadBtn.title = "Download Image";
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                downloadImage(fullUrl, imgData.filename);
            };

            actionsContainer.appendChild(waBtn);
            actionsContainer.appendChild(shareBtn);
            actionsContainer.appendChild(downloadBtn);

            item.appendChild(img);
            item.appendChild(actionsContainer);
            grid.appendChild(item);
        });

    } catch (error) {
        console.error("Gallery fetch failed:", error);
        grid.innerHTML = '<div class="loader" style="color: #ff4444;">Failed to load images. Please try again.</div>';
    }
}

// Download Helper
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename || 'farewell-photo.jpeg';

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    } catch (err) {
        console.error("Failed to download image:", err);
        alert("Could not download the image.");
    }
}

// Share Helper
async function shareImage(url, filename) {
    const shareText = 'CSDM Legacy 2K26 Farewell party Powered By Strlearners\n\nCheck out this photo: ' + url;

    if (navigator.share) {
        try {
            // Attempt to fetch the image to share as a file (better for WhatsApp)
            const response = await fetch(url);
            const blob = await response.blob();
            // Determine a safe fallback extension if filename doesn't have one
            const ext = blob.type.split('/')[1] || 'jpeg';
            const safeFilename = filename || `farewell-photo.${ext}`;
            const file = new File([blob], safeFilename, { type: blob.type });

            // Check if the browser supports sharing this file
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'CSDM Legacy 2K26 Farewell party',
                    text: 'CSDM Legacy 2K26 Farewell party',
                    files: [file]
                });
            } else {
                // Fallback to simpler share if file sharing isn't supported
                await navigator.share({
                    title: 'CSDM Legacy 2K26 Farewell party',
                    text: shareText
                });
            }
        } catch (err) {
            console.error('Share failed:', err);
            // If the advanced share failed (e.g. user aborted, or file share error), attempt basic text/url share
            try {
                await navigator.share({
                    title: 'CSDM Legacy 2K26 Farewell party',
                    text: shareText
                });
            } catch (fallbackErr) {
                console.error('Fallback Share failed:', fallbackErr);
            }
        }
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Image link and message copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            prompt("Copy this to share:", shareText);
        });
    }
}

window.closeApiGallery = function () {
    const modal = document.getElementById("api-gallery-modal");
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
}

// Close API modal when clicking outside
window.addEventListener("click", (event) => {
    const apiModal = document.getElementById("api-gallery-modal");
    if (event.target === apiModal) {
        closeApiGallery();
    }
});
