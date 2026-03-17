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
            audio.play().catch(() => {});
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
    const targetDate = new Date("2026-03-17T10:20:00").getTime();
    const countdownContainer = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            countdownContainer.innerHTML = `<h2 class="title" style="font-size:3rem;">Enjoy The Farewell Party 🎉</h2>`;
            return;
        }

        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
        const seconds = Math.floor((diff % (1000*60)) / 1000);

        countdownContainer.innerHTML = `
            <div class="time-box"><div class="time-val">${String(days).padStart(2,"0")}</div><div class="time-label">Days</div></div>
            <div class="time-box"><div class="time-val">${String(hours).padStart(2,"0")}</div><div class="time-label">Hours</div></div>
            <div class="time-box"><div class="time-val">${String(minutes).padStart(2,"0")}</div><div class="time-label">Minutes</div></div>
            <div class="time-box"><div class="time-val">${String(seconds).padStart(2,"0")}</div><div class="time-label">Seconds</div></div>
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
        const colors = ["#ffd700","#ffaa00","#ffffff","#8e44ad","#9b59b6"];

        for(let i=0;i<150;i++){
            particles.push({
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height - canvas.height,
                r: Math.random()*6+2,
                dx: Math.random()*2-1,
                dy: Math.random()*3+2,
                color: colors[Math.floor(Math.random()*colors.length)],
                tilt: Math.random()*10
            });
        }

        function draw(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            particles.forEach((p,i)=>{
                p.tilt+=0.1;
                p.y+=p.dy;
                p.x+=p.dx;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();

                if(p.y>canvas.height){
                    particles[i] = {...p, y:-10, x:Math.random()*canvas.width};
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

for(let i=1;i<=TOTAL_IMAGES;i++){ images.push(`assets/${i}.jpeg`); }

function shuffle(array){ 
    for(let i=array.length-1;i>0;i--){ 
        const j=Math.floor(Math.random()*(i+1)); 
        [array[i],array[j]]=[array[j],array[i]]; 
    } 
}

window.openSlider = function(){
    const slider = document.getElementById("photo-slider");
    const img = document.getElementById("slider-image");
    shuffle(images);
    slider.classList.remove("hidden");
    currentIndex=0;
    img.src = images[currentIndex];
    img.style.cursor="pointer";
    img.onclick = ()=>window.open(img.src,'_blank');

    if(sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(()=>{ nextPhoto(); },3000);
}

window.closeSlider = function(){
    const slider = document.getElementById("photo-slider");
    slider.classList.add("hidden");
    if(sliderInterval) clearInterval(sliderInterval);
}

window.nextPhoto = function(){
    const img = document.getElementById("slider-image");
    currentIndex=(currentIndex+1)%images.length;
    img.src=images[currentIndex];
}

window.prevPhoto = function(){
    const img = document.getElementById("slider-image");
    currentIndex=(currentIndex-1+images.length)%images.length;
    img.src=images[currentIndex];
}

/* ===============================
5️⃣ EVENT DETAILS MODAL
=============================== */
window.openEventDetails = function(){
    const modal = document.getElementById("event-details-modal");
    modal.classList.remove("hidden");
    document.body.style.overflow="hidden";
    document.documentElement.style.overflow="hidden";
}
window.closeEventDetails = function(){
    const modal = document.getElementById("event-details-modal");
    modal.classList.add("hidden");
    document.body.style.overflow="";
    document.documentElement.style.overflow="";
}
window.onclick = function(event){
    const modal = document.getElementById("event-details-modal");
    if(event.target == modal) closeEventDetails();
}

/* ===============================
6️⃣ API GALLERY (GRID VIEW) FIXED
=============================== */
window.openApiGallery = async function(){
    const modal = document.getElementById("api-gallery-modal");
    const grid = document.getElementById("api-gallery-grid");

    modal.classList.remove("hidden");
    document.body.style.overflow="hidden";
    document.documentElement.style.overflow="hidden";
    grid.innerHTML='<div class="loader">Loading Gallery...</div>';

    try{
        const response = await fetch("https://happy.strlearners.site/api/images");
        const result = await response.json();
        const images = result.data;

        if(!images || images.length===0){
            grid.innerHTML='<div class="loader">No images found.</div>';
            return;
        }

        grid.innerHTML="";

        images.forEach(imgData=>{
            const item = document.createElement("div");
            item.className="grid-item";

            // ✅ Correctly build full URL
            let fullUrl = imgData.path;
            if(!fullUrl.startsWith("http")){
                fullUrl = `https://happy.strlearners.site/${fullUrl}`;
            }

            const img = document.createElement("img");
            img.src = fullUrl;
            img.alt = imgData.filename || "gallery image";
            img.onload=()=>img.classList.add("loaded");
            img.onerror = ()=>img.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";

            item.style.cursor="pointer";
            item.onclick=()=>window.open(fullUrl,'_blank');

            const actionsContainer=document.createElement("div");
            actionsContainer.className="image-actions";

            const waBtn=document.createElement("button");
            waBtn.className="action-btn wa-btn";
            waBtn.innerHTML="💬";
            waBtn.title="Share to WhatsApp";
            waBtn.onclick=(e)=>{ 
                e.stopPropagation(); 
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`CSDM Legacy 2K26 Farewell 🎉\n\n${fullUrl}`)}`,'_blank'); 
            };

            const shareBtn=document.createElement("button");
            shareBtn.className="action-btn share-btn";
            shareBtn.innerHTML="🔗";
            shareBtn.title="Share";
            shareBtn.onclick=(e)=>{ e.stopPropagation(); shareImage(fullUrl,imgData.filename); };

            const downloadBtn=document.createElement("button");
            downloadBtn.className="action-btn download-btn";
            downloadBtn.innerHTML="⬇";
            downloadBtn.title="Download";
            downloadBtn.onclick=(e)=>{ e.stopPropagation(); downloadImage(fullUrl,imgData.filename); };

            actionsContainer.appendChild(waBtn);
            actionsContainer.appendChild(shareBtn);
            actionsContainer.appendChild(downloadBtn);

            item.appendChild(img);
            item.appendChild(actionsContainer);
            grid.appendChild(item);
        });

    }catch(error){
        console.error("Gallery fetch failed:",error);
        grid.innerHTML='<div class="loader" style="color:red;">Failed to load images. Please try again.</div>';
    }
}

async function downloadImage(url, filename){
    try{
        const response=await fetch(url);
        const blob=await response.blob();
        const blobUrl=window.URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.style.display='none';
        a.href=blobUrl;
        a.download=filename||'farewell-photo.jpeg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    }catch(err){
        console.error("Failed to download image:",err);
        alert("Could not download the image.");
    }
}

async function shareImage(url, filename){
    const shareText=`CSDM Legacy 2K26 Farewell party\n\nCheck this photo: ${url}`;

    if(navigator.share){
        try{
            const response=await fetch(url);
            const blob=await response.blob();
            const ext=blob.type.split("/")[1]||'jpeg';
            const file=new File([blob], filename||`farewell-photo.${ext}`,{type:blob.type});
            if(navigator.canShare && navigator.canShare({files:[file]})){
                await navigator.share({title:'CSDM Legacy 2K26', text:'Farewell party', files:[file]});
            }else{
                await navigator.share({title:'CSDM Legacy 2K26', text:shareText});
            }
        }catch(err){
            console.error('Share failed:',err);
            try{ await navigator.share({title:'CSDM Legacy 2K26', text:shareText}); }catch(e){ console.error('Fallback failed:',e); }
        }
    }else{
        navigator.clipboard.writeText(shareText).then(()=>alert('Image link copied to clipboard!')).catch(err=>{ console.error(err); prompt("Copy this:",shareText); });
    }
}

window.closeApiGallery=function(){
    const modal=document.getElementById("api-gallery-modal");
    modal.classList.add("hidden");
    document.body.style.overflow="";
    document.documentElement.style.overflow="";
}

window.addEventListener("click",(event)=>{
    const apiModal=document.getElementById("api-gallery-modal");
    if(event.target===apiModal) closeApiGallery();
});
