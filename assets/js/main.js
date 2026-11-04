/**
 * ===================================================================
 * SHREYA FAKIRAPUR - INTERACTIVE PORTFOLIO ENGINE
 * Particles Canvas • 3D Tilt • Dev Console • Sound FX • Typing FX
 * Project Modals • Certificate Lightbox • Resume Viewer • Confetti
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DBackground();
  initCustomCursor();
  initTypingEffect();
  initNavbar();
  initTiltEffect();
  initStatsCounter();
  initProjectFilters();
  initProjectModals();
  initLightbox();
  initResumeModal();
  initDevTerminal();
  initSoundFX();
  initThemeSwitcher();
  initContactForm();
});

/* ===================================================================
   1. PROFESSIONAL 3D INTERACTIVE BACKGROUND ENGINE (THREE.JS WEBGL)
   - Deep 3D Quantum Particle Field with dynamic glowing sprite
   - Floating 3D Sacred Geometry Core (Icosahedron & Gyro Rings)
   - Undulating 3D Cyber Horizon Wave Topography
   - Smooth mouse parallax with inertial damping (lerp)
   - Cinematic scroll depth parallax
   - Real-time theme synchronization
   - High-performance: battery/tab visibility pause & 60+ FPS
   =================================================================== */
function init3DBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // Graceful fallback to 2D canvas if WebGL or Three.js is unavailable
  if (typeof THREE === 'undefined') {
    init2DFallback(canvas);
    return;
  }

  let renderer, scene, camera;
  let starField, geoCore, outerIcosa, innerOcta, ring1, ring2, horizonGrid;
  let starGeo, gridGeo, originalGridZ = [];
  let isTabVisible = true;
  let targetMouseX = 0, targetMouseY = 0;
  let currentMouseX = 0, currentMouseY = 0;
  let currentScrollY = 0;

  // Theme palettes in hex
  const THEME_3D_COLORS = {
    default: { primary: 0xa78bfa, secondary: 0x06b6d4, wave: 0x8b5cf6, fog: 0x080b18 },
    cyan:    { primary: 0x06b6d4, secondary: 0x3b82f6, wave: 0x0ea5e9, fog: 0x05131f },
    emerald: { primary: 0x10b981, secondary: 0x06b6d4, wave: 0x059669, fog: 0x061913 },
    amber:   { primary: 0xf59e0b, secondary: 0xef4444, wave: 0xd97706, fog: 0x1a1205 }
  };

  const activeTheme = localStorage.getItem('shreya_portfolio_theme') || 'default';
  let activePalette = THEME_3D_COLORS[activeTheme] || THEME_3D_COLORS.default;

  try {
    // 1. Scene & Camera Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(activePalette.fog, 0.0011);

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(55, width / height, 1, 2500);
    camera.position.set(0, 0, 750);

    // 2. High-Performance WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Helper: Generate procedural high-res circular glow sprite (no external image load needed)
    function createGlowPointTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');

      const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
      gradient.addColorStop(0.5, 'rgba(167, 139, 250, 0.45)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      pCtx.fillStyle = gradient;
      pCtx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(pCanvas);
    }

    const pointTexture = createGlowPointTexture();

    // 4. Deep 3D Starfield & Particle Cloud
    const particleCount = 1400;
    starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cPrimary = new THREE.Color(activePalette.primary);
    const cSecondary = new THREE.Color(activePalette.secondary);

    for (let i = 0; i < particleCount; i++) {
      // Wide 3D spatial field
      positions[i * 3] = (Math.random() - 0.5) * 1900;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1400 - 150;

      const mixRatio = Math.random();
      const mixedColor = cPrimary.clone().lerp(cSecondary, mixRatio);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 16,
      map: pointTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    // 5. Floating 3D Sacred Geometry Core
    geoCore = new THREE.Group();

    // Outer wireframe Icosahedron
    const icosaGeo = new THREE.IcosahedronGeometry(110, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: activePalette.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    outerIcosa = new THREE.Mesh(icosaGeo, icosaMat);
    geoCore.add(outerIcosa);

    // Inner wireframe Octahedron
    const octaGeo = new THREE.OctahedronGeometry(65, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: activePalette.secondary,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    innerOcta = new THREE.Mesh(octaGeo, octaMat);
    geoCore.add(innerOcta);

    // Concentric Gyroscopic Rings
    const ring1Geo = new THREE.TorusGeometry(150, 1.2, 16, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: activePalette.primary,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    geoCore.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(185, 1.2, 16, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: activePalette.secondary,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    geoCore.add(ring2);

    // Position the 3D core in the ambient hero space
    if (window.innerWidth < 768) {
      geoCore.position.set(0, 120, -150);
      geoCore.scale.set(0.68, 0.68, 0.68);
    } else {
      geoCore.position.set(280, 60, -100);
      geoCore.scale.set(1, 1, 1);
    }
    scene.add(geoCore);

    // 6. Undulating 3D Cyber Horizon Wave Topography
    const gridCols = 46;
    const gridRows = 46;
    gridGeo = new THREE.PlaneGeometry(2400, 2000, gridCols, gridRows);
    gridGeo.rotateX(-Math.PI / 2.25);

    const gridPositions = gridGeo.attributes.position;
    for (let i = 0; i < gridPositions.count; i++) {
      originalGridZ.push(gridPositions.getY(i));
    }

    const gridMat = new THREE.MeshBasicMaterial({
      color: activePalette.wave,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    horizonGrid = new THREE.Mesh(gridGeo, gridMat);
    horizonGrid.position.set(0, -320, -250);
    scene.add(horizonGrid);

    // 7. Interactive Mouse Tracking
    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    // Touch support for mobile parallax
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    }, { passive: true });

    // Scroll parallax tracking
    window.addEventListener('scroll', () => {
      currentScrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    // Window Resize Handler
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Adjust 3D core position on mobile vs desktop
      if (w < 768) {
        geoCore.position.set(0, 120, -150);
        geoCore.scale.set(0.68, 0.68, 0.68);
      } else {
        geoCore.position.set(280, 60, -100);
        geoCore.scale.set(1, 1, 1);
      }
    });

    // 8. Tab Visibility Pause (GPU/Battery Saving)
    const clock = new THREE.Clock();

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.start();
        animate();
      }
    });

    // 9. Real-Time Theme Synchronization
    window.update3DTheme = function (themeKey) {
      const pal = THEME_3D_COLORS[themeKey] || THEME_3D_COLORS.default;
      activePalette = pal;

      if (scene && scene.fog) {
        scene.fog.color.setHex(pal.fog);
      }
      if (icosaMat) icosaMat.color.setHex(pal.primary);
      if (octaMat) octaMat.color.setHex(pal.secondary);
      if (ringMat1) ringMat1.color.setHex(pal.primary);
      if (ringMat2) ringMat2.color.setHex(pal.secondary);
      if (gridMat) gridMat.color.setHex(pal.wave);

      if (starGeo) {
        const cP = new THREE.Color(pal.primary);
        const cS = new THREE.Color(pal.secondary);
        const colAttr = starGeo.attributes.color;
        for (let i = 0; i < particleCount; i++) {
          const ratio = (i % 10) / 10;
          const mix = cP.clone().lerp(cS, ratio);
          colAttr.setXYZ(i, mix.r, mix.g, mix.b);
        }
        colAttr.needsUpdate = true;
      }
    };

    // 10. Main 60FPS 3D Animation Loop
    function animate() {
      if (!isTabVisible) return;
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation (Damped Lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      const scrollOffset = currentScrollY * 0.35;
      camera.position.x = currentMouseX * 120;
      camera.position.y = -currentMouseY * 85 - (currentScrollY * 0.08);
      camera.position.z = 750 + (currentMouseY * 60);
      camera.lookAt(0, -currentScrollY * 0.08, 0);

      // Rotate and animate 3D Sacred Geometry Core
      if (geoCore) {
        geoCore.rotation.y = elapsedTime * 0.22;
        geoCore.rotation.x = elapsedTime * 0.14 + currentMouseY * 0.4;
        geoCore.rotation.z = Math.sin(elapsedTime * 0.3) * 0.2 + currentMouseX * 0.4;

        // Floating hover sine movement
        geoCore.position.y = (window.innerWidth < 768 ? 120 : 60) + Math.sin(elapsedTime * 1.5) * 14 - (scrollOffset * 0.2);

        if (outerIcosa) outerIcosa.rotation.y = -elapsedTime * 0.35;
        if (innerOcta) innerOcta.rotation.x = elapsedTime * 0.45;
        if (ring1) ring1.rotation.z = elapsedTime * 0.3;
        if (ring2) ring2.rotation.y = -elapsedTime * 0.25;
      }

      // Animate 3D Starfield drift
      if (starField) {
        starField.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.08;
        starField.rotation.x = -currentMouseY * 0.06;
      }

      // Animate 3D Cyber Horizon Wave Plane
      if (gridGeo) {
        const pos = gridGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = (i % (gridCols + 1));
          const v = Math.floor(i / (gridCols + 1));
          const waveZ = Math.sin(elapsedTime * 1.8 + u * 0.35) * 18 +
                        Math.cos(elapsedTime * 1.4 + v * 0.35) * 18;
          pos.setY(i, originalGridZ[i] + waveZ);
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    animate();
  } catch (err) {
    console.warn('Three.js 3D Background initialization error, switching to fallback canvas:', err);
    init2DFallback(canvas);
  }
}

// 2D Fallback in case of WebGL failure
function init2DFallback(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 70;
  const pts = [];
  for (let i = 0; i < particleCount; i++) {
    pts.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(167, 139, 250, 0.5)';
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ===================================================================
   2. CUSTOM CURSOR
   =================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  // Disable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function followLoop() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(followLoop);
  }
  followLoop();

  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .term-chip, .filter-btn, .project-card, .stat-card, .cert-thumb-preview, .achieve-thumb-preview, .intern-doc-thumb-wrap, .floating-control-btn, .floating-whatsapp-btn');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  window.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));
}

/* ===================================================================
   3. DYNAMIC TYPING EFFECT
   =================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    'Information Science & Engg Graduate (B.E.)',
    'Full-Stack Web Developer',
    'AI & Modern Systems Enthusiast',
    'React.js & JavaScript Developer',
    'Python & Java Programmer',
    'Creative Problem Solver & Tech Innovator'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 450; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   4. NAVBAR & SCROLL SPY
   =================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    const scrollPos = window.scrollY + 220;
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach((l) => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          }
        });
      }
    });
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    links.forEach((l) => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* ===================================================================
   5. 3D TILT EFFECT
   =================================================================== */
function initTiltEffect() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* ===================================================================
   6. STATS COUNTER ANIMATION
   =================================================================== */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        stats.forEach((stat) => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = stat.getAttribute('data-decimal') === 'true';
          let count = 0;
          const duration = 1800;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = (isDecimal ? target.toFixed(2) : Math.round(target)) + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = (isDecimal ? count.toFixed(2) : Math.floor(count)) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('.stats-strip');
  if (section) observer.observe(section);
}

/* ===================================================================
   7. PROJECT FILTERS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playSound('click');
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   8. PROJECT MODALS SYSTEM
   =================================================================== */
const projectsData = {
  hotstar: {
    title: 'Hotstar Application Deployment | CI/CD Pipeline',
    badge: 'DevOps & CI/CD Pipeline',
    banner: 'project-images/Hotstar Streaming App Cinematic Showcase.png',
    desc: 'Built an end-to-end automated Continuous Integration and Continuous Deployment (CI/CD) pipeline for a Hotstar streaming application, integrating GitHub, Maven, Apache Tomcat, and Jenkins using webhooks.',
    features: [
      'Built end-to-end CI/CD pipeline integrating GitHub, Maven, Apache Tomcat, and Jenkins using webhooks.',
      'Automated build and deployment process reducing manual effort and deployment errors.',
      'Implemented build throttling to control concurrent executions and improve pipeline stability.',
      'Ensured continuous integration, reliable zero-downtime rollouts, and faster delivery cycles.'
    ],
    tags: ['Jenkins', 'CI/CD Pipeline', 'Maven', 'Apache Tomcat', 'GitHub Webhooks', 'AWS Cloud', 'DevOps'],
    github: 'https://github.com/shreya-s-f/Hotstar-App',
    demo: null
  },
  studyclub: {
    title: 'StudyClub — Collaborative Study Web Platform',
    badge: 'AI & Collaborative Workspace',
    banner: 'project-images/StudyClub_ Your All-in-One Study Companion.png',
    desc: 'An AI-powered learning and productivity platform built with React, Supabase, and Google Gemini AI. It empowers students with distraction-free shared study rooms, peer accountability, and intelligent study aids to learn smarter and stay organized.',
    features: [
      'Collaborative shared study rooms with live student presence & peer accountability.',
      'AI-generated flashcards and interactive quizzes powered by Google Gemini AI API.',
      'Customizable Pomodoro focus timer with ambient sound and work-break intervals.',
      'Structured task management, daily study planner calendar, and searchable digital notes.',
      'Real-time database sync, user authentication, and profile tracking with Supabase.'
    ],
    tags: ['React.js', 'JavaScript', 'Supabase', 'Google Gemini AI', 'HTML5', 'CSS3'],
    github: 'https://github.com/shreya-s-f/StudyClub',
    demo: null
  },
  foodwaste: {
    title: 'Food Wastage Management System',
    badge: 'Full-Stack Social Impact Platform',
    banner: 'project-images/Food Waste Management System in Action.png',
    desc: 'A full-stack web application designed to eliminate food waste by bridging excess food donors (event halls, restaurants, households) with verified local shelter homes, food banks, and volunteer organizations in need.',
    features: [
      'Secure multi-role authentication for Donors, Volunteers, and Receiving NGOs.',
      'Real-time surplus food listing with pickup location, food quantity, and shelf-life tracking.',
      'Normalized MySQL schema architecture ensuring zero redundancy and swift transaction tracking.',
      'Interactive dashboard for monitoring meals distributed and cumulative community impact.',
      'Deployed on Apache (XAMPP) stack following robust REST design conventions.'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Apache (XAMPP)', 'Git'],
    github: 'https://github.com/shreya-s-f/Food-Wastage-Management-System',
    demo: null
  },
  transit: {
    title: 'Smart Public Transport Tracker',
    badge: 'Interactive Transit & Geolocation System',
    banner: 'project-images/Smart Transit Tracker at Sunrise.png',
    desc: 'A responsive geolocation web application simulating real-time public transit tracking across 8 major Indian cities. Designed to solve commuter frustration through accurate route schedules, live delay alerts, and paperless e-ticketing.',
    features: [
      'Interactive vector maps rendering vehicle routes and active bus locations using Leaflet.js.',
      'Simulated live GPS tracking feeds with automated delay calculation and station ETA estimates.',
      'Seamless digital e-ticketing checkout flow with commuter pass generator.',
      'Multi-city support spanning Bangalore, Mumbai, Delhi, Hyderabad, and more.',
      '100% mobile-responsive interface optimized for fast on-the-go commuter access.'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Leaflet.js', 'GeoJSON', 'Responsive UI'],
    github: 'https://github.com/shreya-s-f/smart-public-transport-tracker',
    demo: 'https://smart-public-transport-tracker.vercel.app'
  },
  codevision: {
    title: 'CodeVision.ai — Intelligent AI Code Review Assistant',
    badge: 'Academic Project • Basaveshwar Engg College',
    banner: 'project-images/CodeVision.ai AI Review Workspace.png',
    desc: 'An AI-powered static code analysis and review platform developed at Basaveshwar Engineering College Bagalkot, Dept. of ISE (Project 22UIS717P). It automatically inspects codebases, identifies subtle security flaws, and suggests idiomatic refactorings.',
    features: [
      'Automated syntax error detection and Abstract Syntax Tree (AST) code linting.',
      'Intelligent code optimization recommendations powered by advanced AI models.',
      'Security audit scanning for vulnerability patterns, insecure inputs, and memory leaks.',
      'Split-pane interactive code editor with inline suggestions and diff highlight review.',
      'Engineered with modern TypeScript for type safety and modular extensibility.'
    ],
    tags: ['TypeScript', 'React.js', 'AI API Integration', 'Tailwind CSS', 'AST Analysis'],
    github: 'https://github.com/shreya-s-f/codevision-ai',
    demo: null
  },
  upiscam: {
    title: 'UPI Scam Alert — Digital Fraud Detection Sentinel',
    badge: 'Cybersecurity & Fintech Protection',
    banner: 'project-images/UPI Scam Alert_ Stay Safe Online.png',
    desc: 'A live web-based cybersecurity sentinel built to protect digital payment users from deceptive UPI payment requests, fraudulent QR codes, and social engineering scams. It equips consumers with instant verification tools before completing transactions.',
    features: [
      'Real-time suspicious handle analyzer scanning against documented phishing patterns.',
      'Deceptive QR code payload inspection preventing unauthorized money pull requests.',
      'Interactive scam awareness simulator teaching safe digital banking practices.',
      'Live publicly accessible deployment on Vercel with instant performance and zero latency.',
      'Community reporting module allowing citizens to flag newly discovered fraud vectors.'
    ],
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Web Security', 'Vercel Deployment'],
    github: 'https://github.com/shreya-s-f/upi-scam-alert',
    demo: 'https://upi-scam-alert.vercel.app'
  },
  jansetu: {
    title: 'JAN-SETU — Smart Civic Issue Reporting & Verification Platform',
    badge: 'Civic Tech & Smart Governance',
    banner: 'project-images/Jan-Setu_ Building Better Cities Together.png',
    desc: '"Your Voice. Your City. Your JanSetu." A smart civic engagement platform allowing urban residents to report local infrastructure issues (potholes, garbage, streetlight failures, water leaks) with geotagging and transparent verification.',
    features: [
      'Geotagged civic issue reporting with photo upload and location pinning.',
      'Interactive map dashboard for municipal authorities to prioritize urgent community repairs.',
      'Citizen verification voting to confirm when a public works repair is genuinely resolved.',
      'Status tracking pipeline: Reported → Verified → In Progress → Resolved.',
      'Clean accessibility-focused layout tailored for diverse demographic groups.'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Leaflet.js', 'Smart City', 'Civic Tech'],
    github: 'https://github.com/shreya-s-f/JAN-SETU',
    demo: null
  },
  riseportal: {
    title: 'Rise Association Portal — Departmental Activity Hub',
    badge: 'Association Management Portal',
    banner: 'project-images/Rise Together Student Portal.png',
    desc: 'A centralized association management portal engineered to streamline communication, notices, event schedules, and activity management among engineering students and faculty committee members.',
    features: [
      'Centralized notification board broadcasting department circulars and event announcements.',
      'Member and committee directory with structured role hierarchies and responsibilities.',
      'Event registration and attendance tracking module for collegiate workshops and tech fests.',
      'Modern, highly responsive UI built with TypeScript and modular React components.',
      'Clean state management architecture ensuring frictionless navigation across devices.'
    ],
    tags: ['TypeScript', 'React.js', 'Modern CSS', 'State Management', 'Vite'],
    github: 'https://github.com/shreya-s-f/Rise-association-portal',
    demo: null
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');
  if (!modalBackdrop) return;

  const detailButtons = document.querySelectorAll('[data-project]');

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const projKey = btn.getAttribute('data-project');
      if (!projKey || !projectsData[projKey]) return;
      e.preventDefault();

      const data = projectsData[projKey];

      playSound('click');

      // Populate modal
      document.getElementById('modal-img').src = data.banner;
      document.getElementById('modal-img').alt = data.title;
      document.getElementById('modal-badge').innerHTML = `<i class="fas fa-sparkles"></i> ${data.badge}`;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;

      // Features
      const featuresUl = document.getElementById('modal-features');
      featuresUl.innerHTML = data.features.map(f => `<li><i class="fas fa-circle-check"></i> <span>${f}</span></li>`).join('');

      // Tags
      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = data.tags.map(t => `<span class="project-tag">${t}</span>`).join('');

      // Links
      const githubBtn = document.getElementById('modal-github');
      githubBtn.href = data.github;

      const demoBtn = document.getElementById('modal-demo');
      if (data.demo) {
        demoBtn.href = data.demo;
        demoBtn.style.display = 'inline-flex';
      } else {
        demoBtn.style.display = 'none';
      }

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) closeModal();
  });
}

/* ===================================================================
   9. CERTIFICATE & ACHIEVEMENT LIGHTBOX SYSTEM
   =================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  const zoomTriggers = document.querySelectorAll('[data-lightbox-src]');

  zoomTriggers.forEach((el) => {
    el.addEventListener('click', () => {
      playSound('click');
      const src = el.getAttribute('data-lightbox-src');
      const caption = el.getAttribute('data-lightbox-caption') || 'Verified Credential Preview';
      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

/* ===================================================================
   10. RESUME MODAL VIEWER
   =================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');
  const openButtons = document.querySelectorAll('.open-resume-btn');
  if (!resumeModal) return;

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('click');
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeResume = () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) closeResume();
  });

  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   11. INTERACTIVE DEV TERMINAL
   =================================================================== */
function initDevTerminal() {
  const body = document.getElementById('terminal-body');
  const input = document.getElementById('terminal-input');
  const chips = document.querySelectorAll('.term-chip');
  if (!body || !input) return;

  const commands = {
    help: `Available commands:
• <span style="color:#a78bfa">about</span>        - Summary of Shreya Fakirapur
• <span style="color:#a78bfa">skills</span>       - Core tech stack & programming languages
• <span style="color:#a78bfa">projects</span>     - Hotstar CI/CD, StudyClub, Food Wastage, Transit & more
• <span style="color:#a78bfa">education</span>    - B.E. (CGPA 8.95), PUC (90.16%), SSLC (93.44%)
• <span style="color:#a78bfa">internship</span>   - Web Development Intern @ YBI Foundation
• <span style="color:#a78bfa">achievements</span> - IEEE Volunteering, Inventra 2K25, EKAIVA Tech Summit
• <span style="color:#a78bfa">certifications</span> - ZSkillUp, NPTEL IIT Hyderabad, NPTEL IIT Madras, Infosys
• <span style="color:#a78bfa">contact</span>      - Direct email, phone, location & socials
• <span style="color:#a78bfa">socials</span>      - GitHub, LinkedIn, Instagram, WhatsApp
• <span style="color:#a78bfa">date</span>         - Display current system time
• <span style="color:#a78bfa">sudo hire</span>    - Unlock secret celebration! 🚀
• <span style="color:#a78bfa">clear</span>        - Clear terminal screen`,

    about: `👩‍💻 <b>Shreya Suresh Fakirapur</b>
🎓 Information Science & Engineering graduate (B.E.) from Basaveshwar Engineering College, Bagalkot (<b>CGPA: 8.95 / 10</b>).
🚀 Passionate full-stack developer dedicated to building clean, user-centric web applications, robust backends, and AI-powered solutions that solve real-world problems.`,

    skills: `⚡ <b>Programming Languages & Skills Matrix:</b>
• <b>Programming Languages:</b> Java (75%), Python (50%)
• <b>Frontend Development:</b> HTML5 & CSS3 (85%), JavaScript (75%), React.js (60%)
• <b>Databases & Tools:</b> MySQL (75%), MongoDB (60%), Git & GitHub (80%), VS Code (80%), XAMPP (40%)
• <b>Core CS & Systems:</b> Linux (80%), Windows (85%), DSA (50%), OOPs (70%), DBMS (70%), Operating Systems (70%)
• <b>Cloud (AWS) & DevOps:</b> AWS (EC2, S3, VPC, IAM, ELB, Auto Scaling, RDS, CloudFront), DevOps (GitHub, Maven, Apache Tomcat, Jenkins)
• <b>Soft Skills:</b> Adaptability, Problem Solving, Time Management, Team Collaboration, Communication`,

    projects: `🌟 <b>Featured Real-World Projects:</b>
1. <b>Hotstar Application Deployment</b> — End-to-end CI/CD Pipeline (Jenkins, Maven, Tomcat, Webhooks)
2. <b>StudyClub</b> — AI-powered collaborative study web platform (React, Supabase, Gemini AI)
3. <b>Food Wastage Management</b> — Surplus food donation matching system (PHP, MySQL, Apache)
4. <b>Smart Public Transport Tracker</b> — Real-time transit simulation across 8 cities (Leaflet.js)
5. <b>CodeVision.ai</b> — AI Code Review Assistant (Project 22UIS717P, BEC Bagalkot ISE)
6. <b>UPI Scam Alert</b> — Payment fraud detection & security sentinel (Live on Vercel)
7. <b>JAN-SETU</b> — Smart Civic Issue Reporting & Verification Platform
8. <b>Rise Association Portal</b> — Departmental student activity & communication hub`,

    education: `🎓 <b>Academic Milestones:</b>
• <b>B.E. in Information Science & Engineering:</b> Basaveshwar Engineering College, Bagalkot — <b>CGPA: 8.95 / 10</b>
• <b>Pre-University (PCMB):</b> SRA Composite PU College, Banahatti — <b>90.16%</b>
• <b>SSLC:</b> SRA Composite Junior College, Banahatti — <b>93.44%</b>`,

    internship: `💼 <b>Web Development Internship:</b>
• <b>Organization:</b> YBI Foundation
• <b>Role:</b> Web Development Intern
• <b>Tasks:</b> Simple Calculator, eCommerce Website, ToDo List Manager, Connect Four Game
• <b>Credentials:</b> Verified Offer Letter and Completion Certificate available in Experience section!`,

    achievements: `🏆 <b>Hackathons & Activities:</b>
• <b>IEEE Volunteer:</b> BEC-IEEE Technical Events Organizer (April - Dec 2025)
• <b>Inventra 2K25:</b> Selected for National-Level Hackathon @ KLE Society's College, Chikodi
• <b>EKAIVA 2025:</b> 8-Hour Hackathon & Agamya Tech Summit @ SDMCET Dharwad`,

    certifications: `📜 <b>Verified Certifications:</b>
• <b>ZSkillUp:</b> Quantitative Aptitude and Professional Skills (Feb 2026)
• <b>NPTEL (IIT Hyderabad):</b> Privacy and Security in Online Social Media (Oct 2025)
• <b>NPTEL (IIT Madras):</b> Smart Cities (April 2026)
• <b>Infosys Springboard:</b> Programming Fundamentals using Python (July 2025)
• <b>Udemy:</b> Web Development Mastery`,

    contact: `📬 <b>Get In Touch:</b>
• Email: <a href="mailto:shreyasureshfakirapur06@gmail.com" style="color:#38bdf8">shreyasureshfakirapur06@gmail.com</a>
• Phone: <a href="tel:+919449243953" style="color:#34d399">+91 9449243953</a> / <a href="tel:+916360430056" style="color:#38bdf8">+91 6360430056</a>
• WhatsApp: <a href="https://wa.me/919449243953" target="_blank" style="color:#22c55e">Chat on WhatsApp (9449243953)</a>
• Location: Bagalkot, Karnataka, India`,

    socials: `🌐 <b>Social Channels:</b>
• GitHub: <a href="https://github.com/shreya-s-f" target="_blank" style="color:#a78bfa">github.com/shreya-s-f</a>
• LinkedIn: <a href="https://www.linkedin.com/in/shreya-fakirapur-557388324" target="_blank" style="color:#38bdf8">linkedin.com/in/shreya-fakirapur-557388324</a>
• WhatsApp: <a href="https://wa.me/919449243953" target="_blank" style="color:#22c55e">wa.me/919449243953</a>
• Instagram: <a href="https://www.instagram.com/shre_154/?hl=en" target="_blank" style="color:#ec4899">@shre_154</a>`,

    resume: () => {
      const resumeModal = document.getElementById('resume-modal');
      if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      return `📄 Opening Shreya's interactive resume modal...`;
    },

    date: () => `🕒 Current system time: ${new Date().toLocaleString()}`,

    'sudo hire': () => {
      triggerConfetti();
      playSound('success');
      return `🎉 <span style="color:#10b981; font-weight:bold;">ACCESS GRANTED!</span>
Thank you for considering Shreya Fakirapur! Let's build something phenomenal together.
Drop an email to <a href="mailto:shreyf14@gmail.com" style="color:#38bdf8">shreyf14@gmail.com</a> or WhatsApp <a href="https://wa.me/919743994384" target="_blank" style="color:#22c55e">+91 9743994384</a>! 🚀`;
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    playSound('type');

    // Echo user command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line';
    cmdLine.innerHTML = `<span class="term-prompt">shreya@terminal:~$</span> <span class="term-command">${escapeHtml(rawCmd)}</span>`;
    body.appendChild(cmdLine);

    if (cmd === 'clear') {
      body.innerHTML = '';
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'term-output';

    if (commands[cmd]) {
      const resp = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
      outputLine.innerHTML = resp.replace(/\n/g, '<br>');
    } else {
      outputLine.innerHTML = `command not found: "${escapeHtml(rawCmd)}". Type <span style="color:#a78bfa">help</span> for available commands.`;
    }

    body.appendChild(outputLine);
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* ===================================================================
   12. WEB AUDIO API SYNTHESIZER SOUND FX (TAP SOUND ONLY)
   =================================================================== */
let soundEnabled = true;
let audioCtx = null;
let lastSoundPlayTime = 0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function initSoundFX() {
  const toggleBtn = document.getElementById('sound-toggle');

  // Load saved preference or default to ON
  const saved = localStorage.getItem('shreya_portfolio_sound');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  } else {
    soundEnabled = true;
  }

  function updateSoundIcon() {
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    if (!icon) return;
    if (soundEnabled) {
      icon.className = 'fas fa-volume-up';
      toggleBtn.setAttribute('title', 'Tap Sound: ON (Click to Mute)');
      toggleBtn.setAttribute('aria-label', 'Mute Tap Sound');
      toggleBtn.classList.add('sound-active');
    } else {
      icon.className = 'fas fa-volume-mute';
      toggleBtn.setAttribute('title', 'Tap Sound: OFF (Click to Turn On)');
      toggleBtn.setAttribute('aria-label', 'Turn On Tap Sound');
      toggleBtn.classList.remove('sound-active');
    }
  }

  if (toggleBtn) {
    updateSoundIcon();
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      localStorage.setItem('shreya_portfolio_sound', soundEnabled);
      updateSoundIcon();
      if (soundEnabled) {
        playSound('click');
      }
    });
  }

  // Resume AudioContext on initial user gesture (compliant with modern browser autoplay policies)
  const unlockAudio = () => {
    getAudioContext();
  };
  ['click', 'touchstart', 'keydown'].forEach((evt) => {
    document.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });

  // Attach tap sound to all clickable elements across the portfolio
  document.addEventListener('click', (e) => {
    const target = e.target.closest(
      'a, button, input[type="button"], input[type="submit"], .term-chip, .filter-btn, .proj-btn, .social-circle, .tab-btn, .intern-doc-card, .timeline-card, [role="button"]'
    );
    if (target && target.id !== 'sound-toggle') {
      playSound('click');
    }
  }, { passive: true });
}

function playSound(type = 'click') {
  if (!soundEnabled) return;
  const nowMs = performance.now();
  // Prevent duplicate trigger within 40ms from multiple event dispatches
  if (type === 'click' && nowMs - lastSoundPlayTime < 40) return;
  lastSoundPlayTime = nowMs;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click' || type === 'tap') {
      // Crisp, tactile UI tap sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (type === 'type') {
      // Subtle terminal key click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.035);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'success') {
      // Clean success chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.08);
      osc.frequency.setValueAtTime(659.25, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    // Audio context gracefully handled if browser policy restricts audio
  }
}

/* ===================================================================
   13. THEME SWITCHER
   =================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle');

  const themes = ['default', 'cyan', 'emerald', 'amber'];
  let currentThemeIdx = 0;

  function applyTheme(t) {
    if (t === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
    if (typeof window.update3DTheme === 'function') {
      window.update3DTheme(t);
    }
  }

  function cycleTheme() {
    playSound('click');
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    const nextTheme = themes[currentThemeIdx];
    applyTheme(nextTheme);
    localStorage.setItem('shreya_portfolio_theme', nextTheme);
  }

  const saved = localStorage.getItem('shreya_portfolio_theme');
  if (saved && themes.includes(saved)) {
    currentThemeIdx = themes.indexOf(saved);
    applyTheme(saved);
  } else {
    applyTheme('default');
  }

  if (themeBtn) themeBtn.addEventListener('click', cycleTheme);
}

/* ===================================================================
/* ===================================================================
   14. REAL-TIME CONTACT FORM & CONFETTI
   Supports Real-Time WhatsApp Direct Transmission & Email API
   =================================================================== */
const EMAILJS_CONFIG = {
  publicKey: '',    // Add your EmailJS Public Key from https://dashboard.emailjs.com/admin/account
  serviceId: '',    // Add your EmailJS Service ID (e.g. service_gmail)
  templateId: '',   // Add your EmailJS Template ID
  recipientEmail: 'shreyf14@gmail.com',
  whatsappNumber: '919449243953'
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');
  if (!form) return;

  // Initialize EmailJS if public key is present and SDK loaded
  if (window.emailjs && EMAILJS_CONFIG.publicKey) {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    } catch (err) {
      console.warn('EmailJS initialization error:', err);
    }
  }

  function buildMessageData() {
    const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
    const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    const isUrgent = document.getElementById('urgent-check') && document.getElementById('urgent-check').checked;
    const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
    return { name, email, isUrgent, message };
  }

  function getWhatsAppUrl(name, email, message, isUrgent) {
    const priorityText = isUrgent ? '🚨 PRIORITY: High Priority (Urgent)\n' : '⚡ Priority: Standard Inquiry\n';
    const text = `*New Contact Message from Portfolio*\n----------------------------------\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n${priorityText}📝 *Message:*\n${message}\n----------------------------------\nSent via shreya-s-f.github.io/portfolio`;
    return `https://api.whatsapp.com/send?phone=${EMAILJS_CONFIG.whatsappNumber}&text=${encodeURIComponent(text)}`;
  }

  function showSuccessAlert(name, email, message, isUrgent, extraNote = '') {
    if (!alertBox) return;
    const waUrl = getWhatsAppUrl(name, email, message, isUrgent);
    const subject = isUrgent ? `URGENT: Portfolio Message from ${name}` : `Portfolio Inquiry from ${name}`;
    const mailtoUrl = `mailto:${EMAILJS_CONFIG.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Shreya,\n\n${message}\n\nPriority: ${isUrgent ? 'URGENT' : 'Standard'}\nFrom: ${name} (${email})`)}`;

    alertBox.innerHTML = `
      <div class="form-success-box">
        <div class="form-success-header">
          <i class="fas fa-circle-check"></i>
          <span>Message Dispatched in Real Time!</span>
        </div>
        <p class="form-success-desc">
          Thank you, <b>${escapeHtml(name)}</b>! Your message has been prepared for real-time delivery to Shreya.${extraNote ? ` ${extraNote}` : ''}
        </p>
        <div class="form-success-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="success-action-btn btn-whatsapp-action">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp (Real Time)
          </a>
          <a href="${mailtoUrl}" class="success-action-btn btn-email-action">
            <i class="fas fa-envelope"></i> Open in Email
          </a>
        </div>
      </div>
    `;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 1. Direct WhatsApp Button Click
  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const { name, email, isUrgent, message } = buildMessageData();
      if (!name || !email || !message) {
        if (alertBox) {
          alertBox.innerHTML = '<div style="color:#ef4444; padding:12px; border-radius:10px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3);"><i class="fas fa-exclamation-circle"></i> Please fill in your Name, Email, and Message first.</div>';
          alertBox.style.display = 'block';
        }
        return;
      }

      playSound('click');
      triggerConfetti();
      const waUrl = getWhatsAppUrl(name, email, message, isUrgent);
      window.open(waUrl, '_blank');
      showSuccessAlert(name, email, message, isUrgent, 'A direct real-time chat with Shreya has been opened on WhatsApp.');
      form.reset();
    });
  }

  // 2. Submit Form (Real-Time API + Immediate Dispatch)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { name, email, isUrgent, message } = buildMessageData();

    if (!name || !email || !message) {
      if (alertBox) {
        alertBox.innerHTML = '<div style="color:#ef4444; padding:12px; border-radius:10px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3);"><i class="fas fa-exclamation-circle"></i> Please fill in all required fields.</div>';
        alertBox.style.display = 'block';
      }
      return;
    }

    // Set loading state on submit button
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending in real time...</span>';
    }

    try {
      let apiSent = false;

      // If EmailJS keys configured, send via EmailJS API
      if (window.emailjs && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId) {
        try {
          await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            from_name: name,
            reply_to: email,
            message: message,
            priority: isUrgent ? 'URGENT (High Priority)' : 'Standard',
            to_email: EMAILJS_CONFIG.recipientEmail
          });
          apiSent = true;
        } catch (apiErr) {
          console.warn('EmailJS transmission note:', apiErr);
        }
      }

      triggerConfetti();
      playSound('success');

      // Trigger instant WhatsApp real-time dispatch in new tab
      const waUrl = getWhatsAppUrl(name, email, message, isUrgent);
      window.open(waUrl, '_blank');

      showSuccessAlert(name, email, message, isUrgent, apiSent ? 'Your message was delivered via email API and opened in WhatsApp in real time.' : 'Real-time transmission opened directly to Shreya\'s WhatsApp.');
      form.reset();
    } catch (err) {
      console.error('Contact form submission error:', err);
      const waUrl = getWhatsAppUrl(name, email, message, isUrgent);
      window.open(waUrl, '_blank');
      showSuccessAlert(name, email, message, isUrgent);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
      }
    }
  });

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#a78bfa', '#06b6d4', '#ec4899', '#10b981', '#f59e0b']
    });
  }
}
