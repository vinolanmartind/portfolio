(function(){
  const canvas = document.getElementById('bg-wallpaper');
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function isDark(){
    return document.body.classList.contains('dark-mode');
  }

  // light-mode particle color follows the selected accent; exposed so the
  // color-dot picker below can update it live
  let accentRGB = '63,69,77';
  window.setSiteAccentRGB = function(rgb){
    accentRGB = rgb;
  };

  let pts = [];
  const N = 70;
  for(let i=0;i<N;i++){
    pts.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      vx: (Math.random()-0.5)*0.35,
      vy: (Math.random()-0.5)*0.35
    });
  }

  // click anywhere on the page adds a small burst
  window.addEventListener('click', function(e){
    for(let i=0;i<8;i++){
      pts.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random()-0.5)*3,
        vy: (Math.random()-0.5)*3,
        burst: true, life: 60
      });
    }
  });

  function step(){
    // background + dot/line colors flip with theme
    const bg = isDark() ? 'rgba(17,17,17,0.28)' : 'rgba(247,247,247,0.35)';
    const line = isDark() ? '180,185,195' : accentRGB;
    const dot  = isDark() ? '200,205,212' : accentRGB;

    ctx.fillStyle = bg;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(const p of pts){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
      if(p.life!==undefined) p.life--;
    }
    pts = pts.filter(p=>p.life===undefined||p.life>0);

    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){
          ctx.strokeStyle = 'rgba('+line+','+(0.18*(1-d/100))+')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }

    for(const p of pts){
      ctx.fillStyle = 'rgba('+dot+','+(p.burst?0.9:0.6)+')';
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.burst?2:1.6,0,Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }
  step();
})();


window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
    }
    else{
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
    }

});


// DARK MODE TOGGLE

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    // Change icon

    if(document.body.classList.contains("dark-mode")){
        themeToggle.innerHTML = "☀️";
    }
    else{
        themeToggle.innerHTML = "🌙";
    }

});


// NAME TYPING EFFECT

const text = " Vinolan Martin D ";

let index = 0;

const typingTarget = document.querySelector(".name-typing");

function typeName(){

    if(index < text.length){

        typingTarget.innerHTML += text.charAt(index);

        index++;

        setTimeout(typeName, 120);
    }

}

window.onload = typeName;





const words = [
    " Full Stack Developer " ,
    " Python Developer " ,
    " " ,
    " ASP.NET Developer "
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.querySelector(".typing");

function typeEffect(){

    const currentWord = words[wordIndex];

    if(isDeleting){
        typingElement.textContent =
        currentWord.substring(0, charIndex--);
    }
    else{
        typingElement.textContent =
        currentWord.substring(0, charIndex++);
    }

    let speed = isDeleting ? 60 : 120;

    if(!isDeleting && charIndex === currentWord.length){
        speed = 1500;
        isDeleting = true;
    }
    else if(isDeleting && charIndex === 0){
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();



// SCROLL REVEAL ANIMATION

// SCROLL ANIMATION

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }
        else{

            entry.target.classList.remove("show");

        }

    });

},
{
    threshold:0.15
});

hiddenElements.forEach((el) => observer.observe(el));


// COLOR THEME PICKER (5 dots: gray, blue, brown, red, gold)
// Always starts on gray each visit - no saved preference.

const accentPalette = {
    gray:  { accent: '#3f454d', soft: '#6b7280', rgb: '63,69,77'   },
    blue:  { accent: '#2563eb', soft: '#60a5fa', rgb: '37,99,235'  },
    brown: { accent: '#8b5e34', soft: '#c98a4b', rgb: '139,94,52'  },
    red:   { accent: '#dc2626', soft: '#f87171', rgb: '220,38,38'  },
    gold:  { accent: '#d4af37', soft: '#e9c46a', rgb: '212,175,55' }
};

function applyAccentColor(name){

    const theme = accentPalette[name];

    if(!theme) return;

    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-soft', theme.soft);

    // keep the background wallpaper particles in sync with the chosen color
    if(window.setSiteAccentRGB){
        window.setSiteAccentRGB(theme.rgb);
    }

    // highlight the matching dot in both the header row and the mobile sidebar row
    document.querySelectorAll('.dot').forEach((dot) => {
        dot.classList.toggle('selected', dot.dataset.color === name);
    });
}

document.querySelectorAll('.dot').forEach((dot) => {
    dot.addEventListener('click', () => {
        applyAccentColor(dot.dataset.color);
    });
});