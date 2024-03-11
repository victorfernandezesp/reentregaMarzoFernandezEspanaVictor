document.addEventListener('DOMContentLoaded', function () {
    const imgURL = "https://i2.wp.com/ceklog.kindel.com/wp-content/uploads/2013/02/firefox_2018-07-10_07-50-11.png?fit=641%2C618&ssl=1";
    const baseURL = "https://test-node-server-n86p3o8hk-pffranco.vercel.app";
    const content = document.querySelector(".content");
    const botones = document.querySelectorAll('button')

    // Función para obtener el nombre de usuario desde un objeto
    const getName = obj => obj.name;

    // Evento click para el primer botón (Nombre de Usuario)
    botones[0].addEventListener('click', function () {
        fetch(`${baseURL}/user`)
            .then(response => response.json())
            .then(getName)
            .then(addToContentText)
    });

    const addToContentText = (text) => {
        content.innerHTML = text;
    };


    // Evento click para el segundo botón (Imagen)
    botones[1].addEventListener('click', function () {
        fetch(imgURL)
            .then(response => response.blob())
            .then(createImgFromBlob)
            .then(addToContentImage)
    });

    // Función para crear un elemento de imagen a partir de un objeto Blob
    const createImgFromBlob = blob => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        return img;
    };

    const addToContentImage = element => {
        content.appendChild(element);
    };



    // Evento click para el tercer botón (HTML Funcionando)
    botones[2].addEventListener('click', function () {
        fetch(`${baseURL}/hello`)
            .then(response => response.text())
            .then(parseHtml)
            .then(console.log)
    });
    // Función para analizar el texto HTML y devolver un documento HTML
    const parseHtml = text => {
        // Fallaba ayer porque tenia puesto const en vez de let
        let parser = new DOMParser();
        return parser.parseFromString(text, "text/html");
    };

});
