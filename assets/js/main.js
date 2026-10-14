/**
 * ===================================================================
 * SHREYA FAKIRAPUR - INTERACTIVE PORTFOLIO ENGINE
 * Particles Canvas • 3D Tilt • Dev Console • Sound FX • Typing FX
 * Project Modals • Certificate Lightbox • Resume Viewer • Confetti
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
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
   1. PARTICLES CONSTELLATION CANVAS
   =================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 12000), 90);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.4 ? 'rgba(167, 107, 246, ' : 'rgba(6, 182, 212, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width) this.x = 0;
      else if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      else if (this.y < 0) this.y = height;

      // Mouse attraction / deflection
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167, 107, 246, ${0.16 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. CUSTOM CURSOR
   =================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function followLoop() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(followLoop);
  }
  followLoop();

  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .term-chip, .filter-btn, .project-card, .stat-card, .cert-thumb-preview, .achieve-thumb-preview, .intern-doc-thumb-wrap');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
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
    demo: null
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

  const detailButtons = document.querySelectorAll('.proj-btn-details');

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectsData[projKey];
      if (!data) return;

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
• <span style="color:#a78bfa">projects</span>     - StudyClub, Food Wastage, Transit, CodeVision & more
• <span style="color:#a78bfa">education</span>    - B.E. (CGPA 8.95), PUC (90.16%), SSLC (93.44%)
• <span style="color:#a78bfa">internship</span>   - Web Development Intern @ YBI Foundation
• <span style="color:#a78bfa">achievements</span> - WAVE 3.0, Inventra 2K25, EKAIVA & IEEE Volunteering
• <span style="color:#a78bfa">certifications</span> - ZSkillUp, NPTEL IIT Hyderabad, NPTEL IIT Madras, Infosys
• <span style="color:#a78bfa">contact</span>      - Direct email, phone, location & socials
• <span style="color:#a78bfa">resume</span>       - View & inspect full academic resume
• <span style="color:#a78bfa">socials</span>      - GitHub, LinkedIn, Instagram
• <span style="color:#a78bfa">date</span>         - Display current system time
• <span style="color:#a78bfa">sudo hire</span>    - Unlock secret celebration! 🚀
• <span style="color:#a78bfa">clear</span>        - Clear terminal screen`,

    about: `👩‍💻 <b>Shreya Suresh Fakirapur</b>
🎓 Information Science & Engineering graduate (B.E.) from Basaveshwar Engineering College, Bagalkot (<b>CGPA: 8.95 / 10</b>).
🚀 Passionate full-stack developer dedicated to building clean, user-centric web applications, robust backends, and AI-powered solutions that solve real-world problems.`,

    skills: `⚡ <b>Technical Capabilities:</b>
• <b>Frontend:</b> HTML5, CSS3, JavaScript (ES6+), React.js, Responsive UI
• <b>Backend & DB:</b> MySQL, MongoDB, PHP, Supabase, Apache (XAMPP)
• <b>Tools:</b> Git, GitHub, VS Code, Leaflet.js
• <b>Core Concepts:</b> Data Structures, Algorithms, Object-Oriented Programming (OOP), DBMS, OS
• <b>Soft Skills:</b> Adaptability, Problem Solving, Time Management, Team Collaboration, Communication
• <b>Languages:</b> Kannada, English, Hindi`,

    projects: `🌟 <b>Featured Real-World Projects:</b>
1. <b>StudyClub</b> — AI-powered collaborative study web platform (React, Supabase, Gemini AI)
2. <b>Food Wastage Management</b> — Surplus food donation matching system (PHP, MySQL, Apache)
3. <b>Smart Public Transport Tracker</b> — Real-time transit simulation across 8 cities (Leaflet.js)
4. <b>CodeVision.ai</b> — AI Code Review Assistant (Project 22UIS717P, BEC Bagalkot ISE)
5. <b>UPI Scam Alert</b> — Payment fraud detection & security sentinel (Live on Vercel)
6. <b>JAN-SETU</b> — Smart Civic Issue Reporting & Verification Platform
7. <b>Rise Association Portal</b> — Departmental student activity & communication hub`,

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
• <b>WAVE 3.0:</b> 24-Hour National-Level Hackathon @ BEC Bagalkot (March 2026)
• <b>Inventra 2K25:</b> Selected for National-Level Hackathon @ KLE Society's College, Chikodi
• <b>EKAIVA 2025:</b> 8-Hour Hackathon & Agamya Tech Summit @ SDMCET Dharwad
• <b>Volunteer:</b> BEC-IEEE Technical Events Organizer (April - Dec 2025)`,

    certifications: `📜 <b>Verified Certifications:</b>
• <b>ZSkillUp:</b> Quantitative Aptitude and Professional Skills (Feb 2026)
• <b>NPTEL (IIT Hyderabad):</b> Privacy and Security in Online Social Media (Oct 2025)
• <b>NPTEL (IIT Madras):</b> Smart Cities (April 2026)
• <b>Infosys Springboard:</b> Programming Fundamentals using Python (July 2025)
• <b>Udemy:</b> Web Development Mastery`,

    contact: `📬 <b>Get In Touch:</b>
• Email: <a href="mailto:shreyf14@gmail.com" style="color:#38bdf8">shreyf14@gmail.com</a>
• Phone: <a href="tel:+919743994384" style="color:#34d399">+91 9743994384</a>
• WhatsApp: <a href="https://wa.me/919743994384" target="_blank" style="color:#22c55e">Chat on WhatsApp</a>
• Location: Bagalkot, Karnataka, India`,

    socials: `🌐 <b>Social Channels:</b>
• GitHub: <a href="https://github.com/shreya-s-f" target="_blank" style="color:#a78bfa">github.com/shreya-s-f</a>
• LinkedIn: <a href="https://www.linkedin.com/in/shreya-fakirapur-557388324" target="_blank" style="color:#38bdf8">linkedin.com/in/shreya-fakirapur-557388324</a>
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
   12. WEB AUDIO API SYNTHESIZER SOUND FX
   =================================================================== */
let soundEnabled = true;
let audioCtx = null;

function initSoundFX() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  const saved = localStorage.getItem('shreya_portfolio_sound');
  if (saved !== null) {
    soundEnabled = saved === 'true';
    updateSoundIcon(toggleBtn);
  }

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('shreya_portfolio_sound', soundEnabled);
    updateSoundIcon(toggleBtn);
    if (soundEnabled) playSound('click');
  });

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('click', () => playSound('click'));
  });
}

function updateSoundIcon(btn) {
  const icon = btn.querySelector('i');
  if (!icon) return;
  if (soundEnabled) {
    icon.className = 'fas fa-volume-up';
    btn.setAttribute('title', 'Mute Sound FX');
  } else {
    icon.className = 'fas fa-volume-mute';
    btn.setAttribute('title', 'Enable Sound FX');
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtPoint(750, now);
      osc.frequency.exponentialRampToValueAtPoint(350, now + 0.05);
      gain.gain.setValueAtPoint(0.06, now);
      gain.gain.exponentialRampToValueAtPoint(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'type') {
      osc.type = 'triangle';
      osc.frequency.setValueAtPoint(520, now);
      osc.frequency.exponentialRampToValueAtPoint(220, now + 0.04);
      gain.gain.setValueAtPoint(0.05, now);
      gain.gain.exponentialRampToValueAtPoint(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtPoint(440, now);
      osc.frequency.setValueAtPoint(554.37, now + 0.1);
      osc.frequency.setValueAtPoint(659.25, now + 0.2);
      osc.frequency.setValueAtPoint(880, now + 0.3);
      gain.gain.setValueAtPoint(0.09, now);
      gain.gain.exponentialRampToValueAtPoint(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    }
  } catch (err) {
    // Audio context gracefully handled if browser blocks autoplay
  }
}

/* ===================================================================
   13. THEME SWITCHER
   =================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const themes = ['default', 'cyan', 'emerald', 'amber'];
  let currentThemeIdx = 0;

  const saved = localStorage.getItem('shreya_portfolio_theme');
  if (saved && themes.includes(saved)) {
    currentThemeIdx = themes.indexOf(saved);
    applyTheme(saved);
  }

  themeBtn.addEventListener('click', () => {
    playSound('click');
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    const nextTheme = themes[currentThemeIdx];
    applyTheme(nextTheme);
    localStorage.setItem('shreya_portfolio_theme', nextTheme);
  });

  function applyTheme(t) {
    if (t === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
  }
}

/* ===================================================================
   14. CONTACT FORM & CONFETTI
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
    const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    const isUrgent = document.getElementById('urgent-check') && document.getElementById('urgent-check').checked;
    const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
    const subject = isUrgent ? `URGENT: Portfolio Message from ${name}` : `Portfolio Inquiry from ${name}`;

    if (!name || !email || !message) {
      if (alertBox) {
        alertBox.innerHTML = '<span style="color:#ef4444;"><i class="fas fa-exclamation-circle"></i> Please fill in all required fields.</span>';
        alertBox.style.display = 'block';
      }
      return;
    }

    triggerConfetti();
    playSound('success');

    if (alertBox) {
      const urgentBadge = isUrgent ? '<b style="color:#ef4444;"> [PRIORITIZED AS URGENT]</b>' : '';
      alertBox.innerHTML = `<span style="color:#10b981;"><i class="fas fa-check-circle"></i> Thank you, <b>${name}</b>! Your message has been prepared.${urgentBadge} Shreya will connect with you shortly.</span>`;
      alertBox.style.display = 'block';
    }

    form.reset();

    // Mailto fallback
    setTimeout(() => {
      window.location.href = `mailto:shreyf14@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Shreya,\n\n${message}\n\nPriority: ${isUrgent ? 'URGENT' : 'Standard'}\nFrom: ${name} (${email})`)}`;
    }, 1500);
  });
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
