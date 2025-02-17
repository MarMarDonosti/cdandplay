        // Boton de subir
        window.addEventListener('scroll', toggleBackToTopVisibility);
        window.addEventListener('load', toggleBackToTopVisibility);

        function toggleBackToTopVisibility() {
            var header = document.querySelector('header');
            var backToTop = document.getElementById('backToTop');

            // Si el scroll pasa la altura del header, mostramos el botón
            if (window.scrollY > header.offsetHeight) {
                backToTop.style.visibility = 'visible';  // Hace visible el botón
                backToTop.style.opacity = 1;             // Asegura que el botón sea completamente opaco
            } else {
                backToTop.style.visibility = 'hidden';   // Lo oculta de nuevo
                backToTop.style.opacity = 0;             // Hace el botón completamente invisible
            }
        }