document.addEventListener('DOMContentLoaded', function () {

    // nombre completo del text area
    let textarea = document.querySelector('textarea');
    textarea.innerHTML = 'Víctor Fernández España';

    // url del segundo input
    let url = document.querySelector('input[type="text"]');
    url.value = 'https://randomuser.me/api/';

    // fecha actual
    let fecha = new Date();
    let fechaActual = document.querySelector('p');
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let año = fecha.getFullYear();
    fechaActual.innerHTML += `(${dia}/${mes}/${año})`;



    // cambiar el color
    let select = document.querySelector('select');
    let formulario = document.querySelector('form');
    // uso del evento
    select.addEventListener('change', function () {
        formulario.style.backgroundColor = select.value;
    });
    // ejecutar el evento al cargar la página
    select.dispatchEvent(new Event('change'));


    // obtener url del input y hacer la petición
    let divPaises = document.querySelectorAll('div')[0];
    url.addEventListener('blur', function () {
        $.ajax({
            type: 'get',
            url: this.value,
            success: function (respuesta) {
                let pais = respuesta.results[0].location.country;
                // se muestra por consola
                console.log(pais);
                // añade el país (obtenido por AJAX) al primer div (justo delante de "Envío")
                // aplica la clase pais
                $(divPaises).html(`${pais}`).addClass('pais');
            }

        });
    });

    // al mover el ratón sobre el título se esconde y reaparece con un color de fondo (slow) el nombre completo del alumno
    let $h1 = $('h1');
    $h1.mouseover(function () {
        $h1.text('Víctor Fernández España');
        $h1.fadeOut('slow').css('background-color', 'orange').fadeIn('slow');
    });

    // envio del formulario
    let regexpCrear = /crea (parrafo|párrafo|titulo|título) (.*)/;
    const regexpBorrar = /borra (parrafo|párrafo|titulo|título)/;

    let form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let contenidoTextarea = textarea.value;
        let divError = document.querySelectorAll('div')[1];

        // poner el mensaje de error
        try {
            if (!regexpCrear.test(contenidoTextarea) && !regexpBorrar.test(contenidoTextarea)) {
                throw new Error('El formato no es válido. Debe ser "crea párrafo contenido", "crea título contenido", "borra párrafo" o "borra título"');
            }
            divError.innerHTML = '';
            divError.classList.remove('error');
        } catch (error) {
            divError.innerHTML = error.message;
            divError.classList.add('error');
        }



        // crear parrafo o titulo
        let matchesCrear = contenidoTextarea.match(regexpCrear);
        if (matchesCrear) {
            let tipo = matchesCrear[1];
            let contenido = matchesCrear[2];
            if (contenido === '') {
                contenido = new Date().toLocaleTimeString();
            }

            tipo = tipo === 'titulo' ? 'h1' : 'p';

            let divRegex = document.querySelectorAll('div')[2];
            let element = document.createElement(tipo);
            element.innerHTML = contenido + '<br>';
            divRegex.appendChild(element);
        }

        // borrar parrafos o titulos
        let matchesBorrar = contenidoTextarea.match(regexpBorrar);
        if (matchesBorrar) {
            let tipo = matchesBorrar[1];
            tipo = tipo === 'titulo' ? 'h1' : 'p';
            let divRegex = document.querySelectorAll('div')[2];
            let elementos = divRegex.querySelectorAll(tipo);
            elementos.forEach(function (elemento) {
                elemento.remove();
            });
        }


    });



    // botón de borrar
    let borrar = document.querySelector('input[type="reset"]');
    borrar.addEventListener('click', function (e) {
        e.preventDefault();
        textarea.value = '';
        url.value = '';
    });
});