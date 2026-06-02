document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. CONTRAST THEME SWITCHER
  // ==========================================
  const contrastToggle = document.getElementById('contrast-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from localStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'contrast') {
    htmlElement.classList.add('theme-contrast');
    updateContrastIcon(true);
  }

  contrastToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('theme-contrast');
    const isContrast = htmlElement.classList.contains('theme-contrast');
    localStorage.setItem('theme', isContrast ? 'contrast' : 'default');
    updateContrastIcon(isContrast);
  });

  function updateContrastIcon(isContrast) {
    if (isContrast) {
      // Show Moon icon for switching back to dark mode
      contrastToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
        </svg>
      `;
    } else {
      // Show Sun icon for high contrast light mode
      contrastToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  // ==========================================
  // 2. MOUSE TRACKING & COORDINATES
  // ==========================================
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // Soft interpolation for smooth cursor follow in canvas
  function updateMousePhysics() {
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;
    requestAnimationFrame(updateMousePhysics);
  }
  updateMousePhysics();


  // ==========================================
  // 3. TYPEWRITER TERMINAL SIMULATION
  // ==========================================
  const consoleWidget = document.getElementById('status-console');
  const consoleLines = [
    "SYS_STATUS: RUNNING",
    "USER: AVINASH_Y",
    "DEG: B.TECH CSE",
    "CGPA: 8.95 / 10",
    "AWS_AI: CERTIFIED",
    "GCP_INFRA: CERTIFIED",
    "LOC: HYDERABAD, IN",
    "SYS_SECTOR: ONLINE"
  ];
  
  let currentWordIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeConsole() {
    const currentLine = consoleLines[currentWordIndex];
    let displayText = "";

    if (isDeleting) {
      displayText = currentLine.substring(0, currentCharIndex - 1);
      currentCharIndex--;
      typingSpeed = 50;
    } else {
      displayText = currentLine.substring(0, currentCharIndex + 1);
      currentCharIndex++;
      typingSpeed = 100;
    }

    consoleWidget.innerHTML = `
      <span class="console-line">SYS_STATUS: ACTIVE</span>
      <span class="console-line">${displayText}<span class="caret"></span></span>
    `;

    if (!isDeleting && currentCharIndex === currentLine.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full string
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % consoleLines.length;
      typingSpeed = 500; // Pause before typing next
    }

    setTimeout(typeConsole, typingSpeed);
  }
  setTimeout(typeConsole, 1000);


  // ==========================================
  // 4. FLOATING CONNECTING PARTICLE BACKGROUND
  // ==========================================
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');

  let points = [];
  const maxPoints = 55;
  const connectionDistance = 110;

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    initPoints();
  }

  class Point {
    constructor() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;
    }

    draw() {
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      bgCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
      bgCtx.fill();
    }
  }

  function initPoints() {
    points = [];
    for (let i = 0; i < maxPoints; i++) {
      points.push(new Point());
    }
  }

  function animateBgCanvas() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();

    // Update and draw points
    points.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connecting lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          bgCtx.strokeStyle = accentColor;
          bgCtx.globalAlpha = alpha;
          bgCtx.lineWidth = 0.5;
          bgCtx.beginPath();
          bgCtx.moveTo(points[i].x, points[i].y);
          bgCtx.lineTo(points[j].x, points[j].y);
          bgCtx.stroke();
          bgCtx.globalAlpha = 1.0;
        }
      }

      // Connect with mouse cursor
      const mDx = points[i].x - mouse.x;
      const mDy = points[i].y - mouse.y;
      const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
      if (mDist < connectionDistance * 1.5) {
        const mAlpha = (1 - mDist / (connectionDistance * 1.5)) * 0.3;
        bgCtx.strokeStyle = accentColor;
        bgCtx.globalAlpha = mAlpha;
        bgCtx.lineWidth = 0.8;
        bgCtx.beginPath();
        bgCtx.moveTo(points[i].x, points[i].y);
        bgCtx.lineTo(mouse.x, mouse.y);
        bgCtx.stroke();
        bgCtx.globalAlpha = 1.0;
      }
    }

    requestAnimationFrame(animateBgCanvas);
  }

  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();
  animateBgCanvas();


  // ==========================================
  // 5. HERO SINE WAVES CANVAS ANIMATION
  // ==========================================
  const waveCanvas = document.getElementById('hero-waves');
  const waveCtx = waveCanvas.getContext('2d');
  let waveAnimationId;

  function resizeWaveCanvas() {
    waveCanvas.width = waveCanvas.parentElement.clientWidth;
    waveCanvas.height = waveCanvas.parentElement.clientHeight;
  }

  let waveOffset = 0;

  function animateWaves() {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    
    const textStyle = getComputedStyle(document.documentElement);
    const accentColor = textStyle.getPropertyValue('--color-accent').trim();
    const borderCol = textStyle.getPropertyValue('--color-border').trim();

    // Multi-layered waves
    const layers = [
      { amplitude: 35, frequency: 0.005, speed: 0.02, color: accentColor, thickness: 1.5 },
      { amplitude: 20, frequency: 0.01, speed: 0.03, color: borderCol, thickness: 1 },
      { amplitude: 10, frequency: 0.02, speed: 0.01, color: borderCol, thickness: 0.8 }
    ];

    layers.forEach(layer => {
      waveCtx.strokeStyle = layer.color;
      waveCtx.lineWidth = layer.thickness;
      waveCtx.beginPath();

      for (let x = 0; x < waveCanvas.width; x++) {
        // Base sine wave calculation
        let y = waveCanvas.height / 2 + Math.sin(x * layer.frequency + waveOffset * layer.speed) * layer.amplitude;

        // Distort coordinates near cursor location
        const distanceToMouse = Math.abs(x - mouse.x);
        if (distanceToMouse < 250) {
          const distortionFactor = (1 - distanceToMouse / 250);
          // Attract/repel waves based on y cursor coordinate
          const diffY = mouse.y - y;
          y += diffY * distortionFactor * 0.4;
        }

        if (x === 0) {
          waveCtx.moveTo(x, y);
        } else {
          waveCtx.lineTo(x, y);
        }
      }
      waveCtx.stroke();
    });

    waveOffset += 0.5;
    waveAnimationId = requestAnimationFrame(animateWaves);
  }

  window.addEventListener('resize', resizeWaveCanvas);
  resizeWaveCanvas();
  animateWaves();


  // ==========================================
  // 6. BINARY DIVIDERS SCRAMBLING & GLITCH MATRIX
  // ==========================================
  const binaryElements = document.querySelectorAll('.a__code');

  binaryElements.forEach(el => {
    const originalText = el.textContent;
    let isGlitching = false;

    el.addEventListener('mouseenter', () => {
      if (isGlitching) return;
      isGlitching = true;
      let iterations = 0;

      const interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) return originalText[index];
            
            // Glitch with random binary bits
            return Math.random() > 0.5 ? '1' : '0';
          })
          .join('');

        if (iterations >= originalText.length) {
          clearInterval(interval);
          isGlitching = false;
        }
        iterations += 2;
      }, 35);
    });
  });


  // ==========================================
  // 7. 3D PERSPECTIVE SCROLL GALLERY ANIMATIONS
  // ==========================================
  const projectArticles = document.querySelectorAll('.a-project');

  function update3DScroll() {
    const triggerBottom = (window.innerHeight / 5) * 4.5;
    const triggerTop = window.innerHeight / 5;

    projectArticles.forEach(art => {
      const artRect = art.getBoundingClientRect();
      const visualWrapper = art.querySelector('.a-project__visual-wrapper');

      if (artRect.top < triggerBottom && artRect.bottom > triggerTop) {
        // Calculate scroll progress (0 when enters screen, 1 when exits screen)
        const totalTravel = triggerBottom - triggerTop + artRect.height;
        const currentProgress = (triggerBottom - artRect.top) / totalTravel;
        
        // Target scroll state centered around progress = 0.5
        const angle = (currentProgress - 0.5) * 30; // max +/-15 degrees rotation
        const translateZVal = Math.sin(Math.PI * currentProgress) * 60 - 60; // moves back in depth
        const scaleVal = 0.95 + Math.sin(Math.PI * currentProgress) * 0.05;

        // Apply 3D perspective transformations
        if (visualWrapper) {
          visualWrapper.style.transform = `perspective(1000px) rotateY(${angle}deg) translateZ(${translateZVal}px) scale(${scaleVal})`;
        }
      } else {
        // Rest state outside viewport
        if (visualWrapper) {
          visualWrapper.style.transform = 'perspective(1000px) rotateY(0deg) translateZ(-60px) scale(0.95)';
        }
      }
    });
  }

  window.addEventListener('scroll', update3DScroll);
  update3DScroll(); // Initial check on load

});
