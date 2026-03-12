/* ============================================
   CRYPTO RESEARCH LAB — JavaScript
   ============================================ */

// ---- Loading Screen ----
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2200);
});

// ---- Particle Background ----
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let mouseX = -1000, mouseY = -1000;
    let animFrameId;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.pickColor();
        }
        pickColor() {
            const colors = [
                '240, 165, 0',    // amber/gold
                '232, 131, 26',   // warm orange
                '212, 175, 55',   // gold
                '46, 196, 134',   // emerald
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x += dx / dist * 0.8;
                this.y += dy / dist * 0.8;
            }

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((width * height) / 12000), 150);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const maxDist = 140;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.10;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(240, 165, 0, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animFrameId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
})();

// ---- Sticky Navbar ----
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar || !navToggle || !navMenu) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
})();

// ---- Counter Animation ----
(function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            if (!target) return;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    num.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    num.textContent = target;
                }
            };
            update();
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
})();

// ---- Chart Filter ----
(function initChartFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const chartCards = document.querySelectorAll('.chart-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            chartCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
})();

// ---- Lightbox ----
function openLightbox(btn) {
    const imgSrc = btn.closest('.chart-img-wrapper').querySelector('img').src;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox on escape or backdrop click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeLightbox();
    });
}

// ---- Toggle Files List ----
function toggleFilesList() {
    const filesGrid = document.querySelector('.files-grid');
    const toggleBtn = document.getElementById('toggle-files-btn');
    if (!filesGrid || !toggleBtn) return;

    filesGrid.classList.toggle('expanded');

    const isExpanded = filesGrid.classList.contains('expanded');
    const icon = toggleBtn.querySelector('i');
    const text = toggleBtn.querySelector('span');

    if (isExpanded) {
        icon.className = 'fas fa-chevron-up';
        text.textContent = 'Hide Files';
    } else {
        icon.className = 'fas fa-chevron-down';
        text.textContent = 'Show All Files';
    }
}

// ---- Scroll Reveal ----
(function initReveal() {
    const revealElements = document.querySelectorAll(
        '.glass-card, .section-header, .viz-filter, .hero-stats, .methodology-highlights, .download-all-bundle'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
})();

// ---- Metric Bar Animation ----
(function initMetricBars() {
    const metricBars = document.querySelectorAll('.metric-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    metricBars.forEach(bar => observer.observe(bar));
})();

// ---- Parallax on scroll ----
(function initParallax() {
    const floatingCharts = document.querySelectorAll('.floating-chart');
    const nodes = document.querySelectorAll('.node');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const factor = 0.15;

        floatingCharts.forEach((chart, i) => {
            const speed = (i + 1) * factor;
            chart.style.transform = `translateY(${scrollY * speed}px)`;
        });

        nodes.forEach((node, i) => {
            const speed = (i + 1) * 0.08;
            node.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
})();

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Card Glow follow mouse ----
(function initCardGlow() {
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(240, 165, 0, 0.05), transparent 50%)`;
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
})();

// ---- 3D Tilt Effect on Glass Cards ----
(function initTilt() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.classList.add('tilt-active');
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('tilt-active');
            card.style.transform = '';
        });
    });
})();

// ---- Button Ripple Effect ----
(function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            circle.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = size + 'px';
            circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
            circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(circle);
            circle.addEventListener('animationend', () => circle.remove());
        });
    });
})();

// ---- Scroll Progress Bar ----
(function initScrollProgress() {
    const bar = document.createElement('div');
    bar.classList.add('scroll-progress');
    bar.style.width = '0%';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        bar.style.width = scrollPercent + '%';
    });
})();

// ---- Hero Subtitle Typing Effect ----
(function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const fullText = subtitle.textContent.trim();
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    // Create cursor
    const cursor = document.createElement('span');
    cursor.classList.add('typing-cursor');
    subtitle.appendChild(cursor);

    let charIndex = 0;
    const speed = 25; // ms per character

    function type() {
        if (charIndex < fullText.length) {
            subtitle.insertBefore(
                document.createTextNode(fullText[charIndex]),
                cursor
            );
            charIndex++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after 3s
            setTimeout(() => {
                cursor.style.animation = 'none';
                cursor.style.opacity = '0';
                cursor.style.transition = 'opacity 0.5s ease';
            }, 3000);
        }
    }

    // Start typing after hero animations finish
    setTimeout(type, 1800);
})();

// ---- Magnetic Hover Effect on Primary Buttons ----
(function initMagneticButtons() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s ease';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });
})();

// ---- Text Scramble on Section Tags Hover ----
(function initTextScramble() {
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    document.querySelectorAll('.section-tag span, .section-tag').forEach(tag => {
        const originalText = tag.childNodes.length > 0 ?
            Array.from(tag.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('') :
            '';
        if (!originalText.trim()) return;

        tag.addEventListener('mouseenter', () => {
            let iterations = 0;
            const text = originalText.trim();

            const interval = setInterval(() => {
                const scrambled = text.split('').map((char, i) => {
                    if (i < iterations) return char;
                    if (char === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');

                // Find the text node and update it
                tag.childNodes.forEach(node => {
                    if (node.nodeType === 3 && node.textContent.trim()) {
                        node.textContent = scrambled;
                    }
                });

                iterations += 1 / 2;
                if (iterations >= text.length) {
                    clearInterval(interval);
                    tag.childNodes.forEach(node => {
                        if (node.nodeType === 3 && node.textContent.trim()) {
                            node.textContent = originalText;
                        }
                    });
                }
            }, 30);
        });
    });
})();

// ---- Smooth Number Counter for Metric Values ----
(function initMetricCounters() {
    const metricValues = document.querySelectorAll('.metric-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();

                // Parse number from text like "0.89", "2,847", "1,523", "0.94"
                const cleanNum = text.replace(/,/g, '');
                const target = parseFloat(cleanNum);
                if (isNaN(target)) return;

                const isDecimal = text.includes('.');
                const hasComma = text.includes(',');
                const duration = 2000;
                const startTime = performance.now();

                function easeOutQuart(t) {
                    return 1 - Math.pow(1 - t, 4);
                }

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutQuart(progress);
                    const currentVal = target * easedProgress;

                    if (isDecimal) {
                        el.textContent = currentVal.toFixed(2);
                    } else if (hasComma) {
                        el.textContent = Math.floor(currentVal).toLocaleString();
                    } else {
                        el.textContent = Math.floor(currentVal).toString();
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = text; // Restore exact original text
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    metricValues.forEach(el => observer.observe(el));
})();

// ---- Parallax Depth Layers on Scroll ----
(function initDepthParallax() {
    const heroTitle = document.querySelector('.hero-title');
    const heroBadge = document.querySelector('.hero-badge');
    const heroStats = document.querySelector('.hero-stats');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > window.innerHeight) return; // Only in hero

        if (heroTitle) heroTitle.style.transform = `translateY(${scrollY * 0.2}px)`;
        if (heroBadge) heroBadge.style.transform = `translateY(${scrollY * 0.1}px)`;
        if (heroStats) heroStats.style.transform = `translateY(${scrollY * 0.15}px)`;
    });
})();

