const wordle = (function () {
    const listaPalabras = [
        "sabor", "luzca", "bravo", "moral", "cruce", "grano", "plaza", "fluir", "traje", "creer",
        "jugar", "miedo", "noble", "ocaso", "pudor", "quema", "roble", "sutil", "trote", "unido",
        "volar", "yacer", "zorro", "abrir", "broma", "chico", "dulce", "etapa", "fuego", "golpe",
        "hacer", "ideal", "joven", "kilos", "letra", "mundo", "nacer", "oasis", "poder", "queso",
        "risa", "saber", "tango", "unir", "vivir", "xenon", "yogur", "zarza", "actos", "brisa",
        "campo", "datos", "exito", "flora", "grito", "horno", "icono", "jamon", "karma", "llama",
        "mesa", "nubes", "opera", "piano", "quien", "radio", "salsa", "tarta", "union", "video",
        "winds", "yemas", "zinc", "amigo", "bosco", "celda", "drama", "extra", "fresa", "gusto"
    ];
    let palabraAleatoria = "";
    let intentosRestantes = 5;

    const inicializar = function () {
        // Generar palabra aleatoria del array
        do {
            palabraAleatoria = listaPalabras[Math.floor(Math.random() * listaPalabras.length)].toUpperCase();
        } while (!palabraAleatoria);
        mostrarPalabra();
    };

    // Devuelve la palabra aleatoria y muestra por consola
    const mostrarPalabra = function () {
        console.log(palabraAleatoria);
        return palabraAleatoria;
    };

    // Comprueba si la palabra introducida es correcta
    const comprobarPalabra = function (letrasCorrectas) {
        const letras = [...palabraAleatoria];

        const resultado = ["", "", "", "", ""];

        // Va comprobando letra a letra si es correcta
        letrasCorrectas.forEach((letra, posicion) => {
            if (letra === palabraAleatoria[posicion]) {
                resultado[posicion] = "verde";
                // Elimina la letra de la lista de letras
                letras.splice(letras.indexOf(letra), 1);
            }
        });

        // Comprueba si la letra no está en la lista de letras
        letrasCorrectas.forEach((letra, posicion) => {
            if (letra !== palabraAleatoria[posicion]) {
                // Comprueba si la letra está en la lista de letras
                let index = letras.indexOf(letra);
                // Si está en la lista de letras, la pone en amarillo y la elimina de la lista de letras
                if (index !== -1) {
                    resultado[posicion] = "amarillo";
                    letras.splice(index, 1);
                } else {
                    resultado[posicion] = "gris";
                }
            }
        });

        // Comprueba si se ha ganado
        if (resultado.every(color => color === "verde")) {
            resultado.push("Has ganado");
        }

        return resultado;
    };

    return {
        inicializar: inicializar,
        comprobarPalabra: comprobarPalabra,
        mostrarPalabra: mostrarPalabra,
        intentosRestantes: intentosRestantes
    };
})();

$(function () {
    const interfazJuego = (function () {
        let filaActual = 0;
        let palabraUsuario = [];
        let puntuacionAcumulada = 0;
        const palabraSeleccionada = wordle.mostrarPalabra();
        let juegoTerminado = false;

        // Deshabilita el teclado (Solo si se ha acabado)
        function deshabilitarTeclado() {
            $(".tecla").prop("disabled", true);
        }

        function crearYAgregarElemento(tipoElemento, texto, padre) {
            const elemento = $(`<${tipoElemento}>`).html(texto);
            padre.append(elemento);
            return elemento;
        }

        function crearInterfaz() {
            crearYAgregarElemento("h2", "LA PALABRA", $("body"));
            crearYAgregarElemento("h3", "DEL DÍA", $("body"));

            const divListaJuego = crearYAgregarElemento("div", "", $("body"));
            divListaJuego.addClass("juego");

            for (let j = 0; j < 6; j++) {
                const ulElemento = crearYAgregarElemento("ul", "", divListaJuego);
                for (let i = 0; i < 5; i++) {
                    const nuevoElemento = $(`<input type="text" maxlength="1" class="displayjuego">`);
                    ulElemento.append(nuevoElemento);
                }
            }
        }

        function crearTeclado() {
            const divTeclado = $("<div>").addClass('teclado');

            const teclado = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ", "↲", "Z", "X", "C", "V", "B", "N", "M", "⌫"];

            teclado.forEach((tecla, index) => {
                const unaTecla = $("<button>").html(tecla).addClass('tecla');

                if ((index + 1) % 10 === 0) {
                    divTeclado.append($("<br>"));
                }

                divTeclado.append(unaTecla);
            });

            $("body").append(divTeclado);
        }

        // Agrega el borrar al pulsar la tecla de borrar del teclado fisico
        function agregarFuncionalidad() {
            $(document.body).on("keydown", function (evento) {
                if (evento.key === "Backspace") {
                    palabraUsuario.pop();
                    const uls = $("ul");
                    uls.eq(filaActual).children().eq(palabraUsuario.length).val("");
                }
            });


            $(document.body).on("click", function (evento) {
                if (juegoTerminado || $(evento.target).prop("tagName") !== "BUTTON") return;

                const textoObjetivo = $(evento.target).html();
                const uls = $("ul");

                if (textoObjetivo === "⌫") {
                    palabraUsuario.pop();
                    uls.eq(filaActual).children().eq(palabraUsuario.length).val("");
                } else if (textoObjetivo === "↲" && palabraUsuario.length === 5) {

                    // Comprueba si la palabra es correcta
                    let letrasCorrectas = [];
                    palabraUsuario.forEach((letra, index) => {
                        letrasCorrectas.push(letra);
                    });

                    let intentosGuardados = wordle.comprobarPalabra(letrasCorrectas);
                    let cont = 0;

                    // Muestra las letras en el tablero con su color correspondiente habiendolo comprobado antes mandandole 
                    // las letras a la capa de negocio para que lo compruebe
                    intentosGuardados.forEach((letra, index) => {
                        const inputElemento = uls.eq(filaActual).children().eq(index);
                        if (letra === 'verde') {
                            inputElemento.val(letrasCorrectas[cont]).css({
                                "background-color": "lightgreen",
                                "transition": "background-color 0.5s ease"
                            });
                            cont++;
                        } else if (letra === 'amarillo') {
                            inputElemento.val(letrasCorrectas[cont]).css({
                                "background-color": "#e4a81d",
                                "transition": "background-color 0.5s ease"
                            });
                            cont++;
                        } else if (letra === 'gris') {
                            inputElemento.val(letrasCorrectas[cont]).css({
                                "background-color": "gray",
                                "transition": "background-color 0.5s ease"
                            });
                            cont++;
                        }
                    });
                    filaActual++;

                    // Limpia el array de letras y pasa a la siguiente fila
                    palabraUsuario = [];
                    cont = 0;
                    puntuacionAcumulada += 5;

                    // Comprueba si se ha ganado
                    if (intentosGuardados.includes("Has ganado")) {
                        deshabilitarTeclado();
                        juegoTerminado = true;
                    }

                    // Escribe la letras en el tablero
                } else if (textoObjetivo !== "↲" && palabraUsuario.length !== 5) {
                    uls.eq(filaActual).children().eq(palabraUsuario.length).val(textoObjetivo.toUpperCase());
                    palabraUsuario.push(textoObjetivo);
                }
            });
        }

        return {
            iniciar: function () {
                crearInterfaz();
                crearTeclado();
                agregarFuncionalidad();
            }
        };
    })();

    wordle.inicializar();
    interfazJuego.iniciar();
});
