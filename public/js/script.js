// script do funcionamento do menu hamburguer
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menuImg");
    const mobileMenu = document.querySelector(".menu-mobile");

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", function (event) {
        if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            mobileMenu.classList.remove("active");
        }
    });
});

// Script do carrossel 
        let slideIndex = 0;
        showSlides(slideIndex);
    
        function moveSlide(n) {
            showSlides(slideIndex += n);
        }
    
        function currentSlide(n) {
            showSlides(slideIndex = n - 1);
        }
    
        function showSlides(n) {
            let i;
            let slides = document.querySelectorAll('.carousel-images img');
            let dots = document.querySelectorAll('.dot');
    
            if (n >= slides.length) {
                slideIndex = 0;
            }
            if (n < 0) {
                slideIndex = slides.length - 1;
            }
    
            slides.forEach((slide) => {
                slide.style.display = 'none';
            });
    
            dots.forEach((dot) => {
                dot.classList.remove('active');
            });
    
            slides[slideIndex].style.display = 'block';
            dots[slideIndex].classList.add('active');
        }
    
        setInterval(() => {
            moveSlide(1);
        }, 3000); // Muda a cada 3 segundos

// Carrossel de Marcas
  const track = document.getElementById('logoTrack');
  const trackContent = track.innerHTML;
  track.innerHTML += trackContent; // Duplicar automaticamente