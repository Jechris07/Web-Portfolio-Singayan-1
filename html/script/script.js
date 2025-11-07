
        // Sticky Navigation
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile Menu Toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Parallax Effect
        const parallaxSection = document.getElementById('parallaxSection');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxBg = parallaxSection.querySelector('.parallax-bg');
            const parallaxContent = parallaxSection.querySelector('.parallax-content');
            
            if (parallaxBg && parallaxContent) {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                parallaxBg.style.transform = `translateY(${yPos}px)`;
                parallaxContent.style.transform = `translateY(${yPos * 0.3}px)`;
            }
        });

        // Fade-in on Scroll Animation
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                
                if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                    element.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', fadeInOnScroll);
        fadeInOnScroll(); // Initial check

        // Smooth Scroll for Navigation Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add hover effect to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.4)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = 'none';
            });
        });

        // Console message for developers
        console.log('%cWelcome to my portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
        console.log('%cFeel free to explore the code 🚀', 'color: #ec4899; font-size: 14px;');