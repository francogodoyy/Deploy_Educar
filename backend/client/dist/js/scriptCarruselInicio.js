// //Script de carrusel principal/Inicio. Hecho por Paniagua Pablo, Niss Evelin y Marcos Pescarolo
// document.addEventListener('DOMContentLoaded', () => {
//     // Fetch datos de comunidad (alumnos)
//     fetch('http://localhost:3000/api/alumnos')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Error en la red al obtener comunidad');
//             }
//             return response.json();
//         })
//         .then(async dataComunidad => {
//             // Fetch datos de docente
//             const response = await fetch('http://localhost:3000/api/docentes');
//             if (!response.ok) {
//                 throw new Error('Error en la red al obtener docente');
//             }
//             const dataDocente = await response.json();
//             return dataComunidad.concat(dataDocente);
//         })
//         .then(data => {
//             const carousel = document.getElementById('carousel');
//             const carouselContainer = document.createElement('div');
//             carouselContainer.classList.add('carousel-container');
//             carousel.appendChild(carouselContainer); // Agregar contenedor de slides

//             data.forEach((entrada, index) => {
//                 const slide = document.createElement('div');
//                 slide.classList.add('carousel-slide');

//                 // Formatea la fecha antes de mostrarla
//                 const fechaFormateada = formatDate(entrada.fecha);

//                 // Usa la URL directa de Google Drive si está disponible
//                 const imagenSrc = entrada.imagen ? entrada.imagen : '/path/to/default/image.jpg';

//                 slide.innerHTML = `
//                 <div class="container">
//                     <div class="text-section">
//                         <h3>CENTRO EDUCATIVO TECNOLOGICO</h3>
//                         <h4>${entrada.titulo}</h4>
//                         <p><strong>Fecha de Agregado:</strong> ${fechaFormateada}</p>
//                         <p>${entrada.descripcion}</p>
//                         <button onclick="location.href='/frontend/dist/turnos.html'">MAS INFORMACION</button>
//                     </div>
//                     <div class="image-section">
//                         <img src="${imagenSrc}" alt="${entrada.titulo}">
//                     </div>
//                 </div>
//                 `;
//                 carouselContainer.appendChild(slide); // Agregar el slide al contenedor
//             });

//             // Inicializa la primera diapositiva
//             showSlide(currentSlide);
//         })
//         .catch(error => console.error('Error al cargar las entradas:', error));
// });

// // Variable para el índice de la diapositiva actual
// let currentSlide = 0;

// /**
//  * Muestra la diapositiva en el índice especificado.
//  * @param {number} index - Índice de la diapositiva a mostrar.
//  */
// function showSlide(index) {
//     const slides = document.querySelectorAll('.carousel-slide');
//     const totalSlides = slides.length;
//     if (index >= totalSlides) {
//         currentSlide = 0;
//     } else if (index < 0) {
//         currentSlide = totalSlides - 1;
//     } else {
//         currentSlide = index;
//     }

//     // Calcular el nuevo valor de transformación
//     const newTransformValue = -currentSlide * 100;
//     document.querySelector('.carousel-container').style.transform = `translateX(${newTransformValue}%)`;

//     // Actualizar las clases de los slides para manejar 'active'
//     slides.forEach((slide, i) => {
//         slide.classList.toggle('active', i === currentSlide);
//     });
// }

// /**
//  * Muestra la siguiente diapositiva.
//  */
// function nextSlide() {
//     showSlide(currentSlide + 1);
// }

// /**
//  * Muestra la diapositiva anterior.
//  */
// function prevSlide() {
//     showSlide(currentSlide - 1);
// }

// // Cambio automático de diapositiva cada 3 segundos
// setInterval(() => {
//     nextSlide();
// }, 3000);

// // Función para formatear la fecha en formato 'DD-MM-YYYY'
// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses del 1 al 12
//     const day = String(date.getDate()).padStart(2, '0'); // Día del mes
//     return `${day}-${month}-${year}`;
// }
//Script de carrusel principal/Inicio. Hecho por Paniagua Pablo, Niss Evelin y Marcos Pescarolo
// Script de carrusel principal/Inicio. Hecho por Paniagua Pablo, Niss Evelin y Marcos Pescarolo
document.addEventListener('DOMContentLoaded', () => {
    loadTalleres();
});

// Variable para el índice de la diapositiva actual
let currentSlide = 0;

/**
 * Función para cargar los talleres y crear el carrusel.
 */
function loadTalleres() {
    // Fetch datos de comunidad (alumnos)
    fetch('/api/alumnos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red al obtener comunidad');
            }
            return response.json();
        })
        .then(async dataComunidad => {
            // Fetch datos de docente
            const response = await fetch('/api/docentes');
            if (!response.ok) {
                throw new Error('Error en la red al obtener docente');
            }
            const dataDocente = await response.json();
            return dataComunidad.concat(dataDocente);
        })
        .then(data => {
            const carousel = document.getElementById('carousel');

            // Asegúrate de que el contenedor ya existe antes de agregar contenido
            const carouselContainer = document.createElement('div');
            carouselContainer.classList.add('carousel-container');
            carousel.appendChild(carouselContainer); // Agregar contenedor de slides

            // Crear el primer slide con la información de la página de inicio
                const firstSlide = document.createElement('div');
                firstSlide.classList.add('carousel-slide');
                firstSlide.innerHTML = `
                <div class="container">
                     <div class="text-section">
                         <h3>CENTRO EDUCATIVO TECNOLOGICO</h3>
                         <h4>EDUC.AR LAB CHACO</h4>
                        <p>Sistema de turnos, recorrido virtual<br />e información institucional</p>
                        <button onclick="location.href='nosotros.html'">MAS INFORMACION</button>
                </div>
                    <div class="image-section">
                        <img src="../img/Hero_Section_img1.png" alt="Image 1" />
                    </div>
                </div>
                `;
                carouselContainer.appendChild(firstSlide); // Agregar primer slide


            // Crear los slides con la información de los talleres
            data.forEach((entrada, index) => {
                const slide = document.createElement('div');
                slide.classList.add('carousel-slide');

                // Formatea la fecha antes de mostrarla
                const fechaFormateada = formatDate(entrada.fecha);

                // Usa la URL directa de Google Drive si está disponible
                const imagenSrc = entrada.imagen ? entrada.imagen : '/path/to/default/image.jpg';

                slide.innerHTML = `
                    <div class="container">
                        <div class="text-section">
                            <h3>CENTRO EDUCATIVO TECNOLOGICO</h3>
                            <h4>${entrada.titulo}</h4>
                            <p><strong>Fecha :</strong> ${fechaFormateada}</p>
                            <p>${entrada.descripcion}</p>
                            <button onclick="location.href='/frontend/dist/turnos.html'">Reservar Turnos</button>
                        </div>
                        <div class="image-section">
                            <img src="${imagenSrc}" alt="${entrada.titulo}">
                        </div>
                    </div>
                `;
                carouselContainer.appendChild(slide); // Agregar el slide al contenedor
            });

            // Inicializa la primera diapositiva después de cargar los slides
            if (carouselContainer.children.length > 0) {
                showSlide(currentSlide);  // Aseguramos que haya slides para mostrar
            }
        })
        .catch(error => console.error('Error al cargar las entradas:', error));
}

/**
 * Muestra la diapositiva en el índice especificado.
 * @param {number} index - Índice de la diapositiva a mostrar.
 */
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Calcular el nuevo valor de transformación
    const newTransformValue = -currentSlide * 100;
    document.querySelector('.carousel-container').style.transform = `translateX(${newTransformValue}%)`;

    // Actualizar las clases de los slides para manejar 'active'
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
}

/**
 * Muestra la siguiente diapositiva.
 */
function nextSlide() {
    showSlide(currentSlide + 1);
}

/**
 * Muestra la diapositiva anterior.
 */
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Cambio automático de diapositiva cada 3 segundos
setInterval(() => {
    nextSlide();
}, 3000);

/**
 * Función para formatear la fecha en formato 'DD-MM-YYYY'
 * @param {string} dateString - La fecha a formatear.
 * @returns {string} La fecha formateada.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses del 1 al 12
    const day = String(date.getDate()).padStart(2, '0'); // Día del mes
    return `${day}-${month}-${year}`;
}
