class ManejadorDientes {
  constructor() {
    this.dientesSeleccionados = [];
    this.arraySeleccionado = [];
    this.arrayEmparejado = [];
    this.haySeleccion = false;
    this.canSelect = true;
    this.mensajeAUsuario = document.getElementById('Alerta');
    this.dienteSeleccionado = document.querySelectorAll('.diente');
    this.estilosOriginales = this.dienteSeleccionado.style;
    this.valorIngresado = 0;
  }

  inicializar() {
    this.cargarNumerosDientes();
    document.addEventListener("DOMContentLoaded", () => {
      this.agregarEventos();
  
    });
  }

  agregarEventos() {
    const botonAtache = document.getElementById('atache');
    const botonRemover = document.getElementById('remover');
    const botonReset = document.getElementById('reset');
    const botonPalatino = document.getElementById('palatino');
    const botonVest = document.getElementById('vestibular');
    const medidasBoton = [30,17];
    

    botonPalatino.addEventListener('click', () => this.añadirAtacheORemover('palatino'));
    botonVest.addEventListener('click', () => this.añadirAtacheORemover('botonvestibular'));
    botonAtache.addEventListener('click', () => this.añadirAtacheORemover('atache'));
    botonRemover.addEventListener('click', () => this.añadirAtacheORemover('remover'));
    botonReset.addEventListener('click', () => this.reloadApp());
    const botonSelector = document.getElementById('seleccionar');
    botonSelector.addEventListener('click', () => this.confirmarSeleccion());

    const buttonStrip = document.getElementById('strip');
    buttonStrip.addEventListener('click', () => this.añadirStrip());

    const buttonExport = document.getElementById('export');
    buttonExport.addEventListener('click', () => this.exportToPNG());

    const dienteSeleccionado = document.querySelectorAll('.diente');
    dienteSeleccionado.forEach(diente => {
      diente.addEventListener('click', (event) => this.seleccionarDiente(event));
    });




  }

  cargarNumerosDientes() {
    const canvasContainer = document.getElementById('canvasContainer');
    const dientesNumeros = document.querySelectorAll('.diente');
    dientesNumeros.forEach((diente) => {
      var label = diente.getAttribute('label');
      label = parseInt(label);
      if (label >= 1 && label < 17) {
        var nuevaImagen = document.createElement('div');
        nuevaImagen.classList.add('numeracion');
        var selector = '.diente[label="' + label + '"]';
        var diente = document.querySelector(selector);

        var rectangulos = diente.getClientRects();
        var dimensiones = diente.getBoundingClientRect();
        var puntoCentralX = rectangulos[0].left;
        var puntoCentralY = rectangulos[0].top;

        nuevaImagen.innerText = `${label}`;
        nuevaImagen.style.position = 'absolute';
        nuevaImagen.style.marginLeft = puntoCentralX + dimensiones.width / 2 + 'px';
        nuevaImagen.style.marginTop = puntoCentralY - dimensiones.height * 121 + 'px';
        nuevaImagen.style.cursor = 'pointer'; nuevaImagen.style.height = '20px';


        canvasContainer.appendChild(nuevaImagen);
      } else  {
        // Restar la etiqueta del máximo valor en el rango y sumarla a un número base
        var nuevaImagen = document.createElement('div');
        nuevaImagen.classList.add('numeracion');

        // Cálculos para invertir y desplazar la numeración
        var nuevoLabel = 33 - label + 16;

        var selector = '.diente[label="' + label + '"]';
        var diente = document.querySelector(selector);

        var rectangulos = diente.getClientRects();
        var dimensiones = diente.getBoundingClientRect();
        var puntoCentralX = rectangulos[0].left;
        var puntoCentralY = rectangulos[0].top;

        nuevaImagen.innerText = `${nuevoLabel}`;
        nuevaImagen.style.position = 'absolute';
        nuevaImagen.style.marginLeft = puntoCentralX + 27+'px';
        nuevaImagen.style.marginTop = puntoCentralY - dimensiones.height  + 'px';
        nuevaImagen.style.cursor = 'pointer';
        nuevaImagen.style.height = '20px';

        canvasContainer.appendChild(nuevaImagen);
      }
    });



  }

  //MANEJA LA RECARGA DE LA PAGINA
  reloadApp() {

    this.enviarMensajeAUsuario('REINICIANDO');

    setTimeout(() => {


      location.reload();
    }, 3000);


  }

  //MANEJA LA ELIMINACION DE LINEAS Y NUMEROS
  eliminacionLineasYNumeros(event) {
    const lineaOnumero = event.currentTarget;
    lineaOnumero.remove();

  }
  //MANEJA EL APUNTADO A LAS LINEAS Y NUMEROS PARA SU ELIMINACION
  apuntarLineasYNumeros() {
    const lineas = document.querySelectorAll('.linea');
    const numeros = document.querySelectorAll('.numeros');
    const botones = document.querySelectorAll('.vestibular');
    lineas.forEach(linea => {
      linea.addEventListener('click', (event) => this.eliminacionLineasYNumeros(event));
    });
    numeros.forEach(numero => {
      numero.addEventListener('click', (event) => this.eliminacionLineasYNumeros(event));
    });
    botones.forEach(boton => {
      boton.addEventListener('click', (event) => this.eliminacionLineasYNumeros(event));
    });

  }


  //FUNCION QUE MANEJA EL EXPORTADO
  exportToPNG() {
    const canvasContainer = document.getElementById('canvasContainer');
    const dientesContainer = document.getElementById('dientesContainer');


    dientesContainer.style.border = '10px solid transparent';
    const dienteSeleccionado = document.querySelectorAll('.diente');


    dienteSeleccionado.forEach((diente) => {
      diente.style = this.estilosOriginales;
      diente.style.border = '1px solid transparent';


    });
    var logoWonders = document.createElement('img');
    logoWonders.src = '/DIENTES CORTADOS/wonderslogoVERDE.png';

    logoWonders.style.position = 'absolute';
    logoWonders.style.marginLeft = '10%';
    logoWonders.style.marginTop = '25%';
    logoWonders.style.width = '210px'
    logoWonders.style.height = '68px'
    canvasContainer.appendChild(logoWonders);


    html2canvas(canvasContainer).then(canvas => {
      // Crea un enlace temporal
      const link = document.createElement('a');
      // Convierte el lienzo en una URL de datos
      const imageDataURL = canvas.toDataURL('image/png');
      // Establece la URL del enlace al lienzo convertido
      link.href = imageDataURL;
      // Establece el atributo de descarga con un nombre de archivo
      link.download = 'WondersAppExported.png';
      // Añade el enlace al documento
      document.body.appendChild(link);
      // Simula un clic en el enlace para iniciar la descarga
      link.click();

      document.body.removeChild(link);
    });
    this.enviarMensajeAUsuario('EXPORTADO CORRECTAMENTE');
    setTimeout(() => {
      this.mensajeAUsuario.innerHTML = '';

      location.reload();
    }, 5000);


  }

  //FUNCION QUE MANEJA EL SELECCIONADO DE DIENTES
  seleccionarDiente(event) {
    if (this.canSelect) {
      var deselector = false;
      var diente = event.target;
      var dienteLabel = event.target.getAttribute('label');
      dienteLabel = parseInt(dienteLabel);

      if (this.dientesSeleccionados.includes(dienteLabel)) {
        deselector = true;
        this.dientesSeleccionados = this.dientesSeleccionados.filter(c => c !== dienteLabel);
      } else {
        deselector = false;
        this.dientesSeleccionados.push(dienteLabel);
      }

      if (deselector == false) {
        diente.classList.add('selected');
      } else {
        diente.classList.remove('selected');
      }
    } else {
      return;
    }
  }

  confirmarSeleccion() {
    if (typeof (this.dientesSeleccionados[0]) == 'number') {
      //VARIABLE QUE CONTROLA SI SE SELECIONARON 1 O MAS DIENTES
      var pluralidad = 1;
      //TEMPLATES DE MENSAJE DEPENDIENDO DE LA PLURALIDAD
      var mensajeTemplate1 = 'DIENTES: ';
      var mensajeTemplate2 = 'DIENTE: ';
      var mensajeCreado = '';
      //VARIABLE DE LA QUE DEPENDE LA PLURALIDAD
      var contadorDientes = 0;

      if (this.haySeleccion == false) {
        this.haySeleccion = true;
        this.canSelect = false;
        this.arraySeleccionado = this.dientesSeleccionados;

        this.dientesSeleccionados.sort(this.compararNumeros);
        this.dientesSeleccionados.forEach((label) => {
          var selector = '.diente[label="' + label + '"]';
          var diente = document.querySelector(selector);

          if (diente) {
            contadorDientes++;
            diente.style.backgroundColor = '#00c5bb1f';
            diente.style.filter = 'saturate(800%)';
            mensajeCreado += String(label) + ' ';
          } else {
            // ...
          }
        });
        if (contadorDientes > 1) {
          mensajeCreado += 'SELECCIONADOS CON EXITO';
        } else {
          mensajeCreado += 'SELECCIONADO CON EXITO';
          pluralidad = 0;
        }
      } else {
        this.haySeleccion = false;
        this.canSelect = true;
        this.arraySeleccionado.forEach((label) => {
          var selector = '.diente[label="' + label + '"]';
          var diente = document.querySelector(selector);

          if (diente) {
            contadorDientes++;
            diente.style.backgroundColor = 'transparent';
            diente.style.filter = 'saturate(100%);';
            mensajeCreado += String(label) + ' ';
          } else {
            // ...
          }
        });

        this.arraySeleccionado = new Array();
        console.log(this.dientesSeleccionados);
        if (contadorDientes > 1) {
          mensajeCreado += 'DESELECCIONADOS CON EXITO';
        } else {
          mensajeCreado += 'DESELECCIONADO CON EXITO';
          pluralidad = 0;
        }
      }

      if (pluralidad == 1) {
        mensajeTemplate1 += mensajeCreado;
        this.enviarMensajeAUsuario(mensajeTemplate1);
      } else {
        mensajeTemplate2 += mensajeCreado;
        this.enviarMensajeAUsuario(mensajeTemplate2);
      }
    } else {
      var mensajeCreado = 'NINGUN DIENTE SELECCIONADO';
      this.enviarMensajeAUsuario(mensajeCreado);
    }
  }
  //Funcion que encuentra las parejas a un llamado de añadir strips
  creadorParejas(array) {
    array.sort(this.compararNumeros);

    //ARRAY DONDE SE GUARDARA EL PRIMER LABEL DE CADA PAREJA PARA LA AÑADICION DE UNA IMAGEN
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i + 1] == array[i] + 1) {
        this.arrayEmparejado.push(array[i]);

      } else {
        // ...
      }

    }
    console.log(this.arrayEmparejado + 'soy el array emparejado AL FINAL');

    return;
  }

  añadirAtacheORemover(accion) {
    const medidasDientes = [0,31,29,32,38.5,32,27,32,15,15,32,27,32,38.5,32,29,31];
    const canvasContainer = document.getElementById('canvasContainer');

    console.log(this.arraySeleccionado + "para ataches");

    if (accion == 'atache') {
      this.arraySeleccionado.forEach((label) => {
        var nuevaImagen = document.createElement('img');
        nuevaImagen.classList.add('linea');
        var selector = '.diente[label="' + label + '"]';
        var diente = document.querySelector(selector);

        var rectangulos = diente.getClientRects();
        var dimensiones = diente.getBoundingClientRect();
        var puntoCentralX = rectangulos[0].left;
        var puntoCentralY = rectangulos[0].top;
        nuevaImagen.src = '/DIENTES CORTADOS/atache.png';
        nuevaImagen.style.position = 'absolute';
        nuevaImagen.style.left = puntoCentralX + dimensiones.width / 2.5 +'px';
        nuevaImagen.style.top = puntoCentralY + dimensiones.height / 2.5 +10+ 'px';
        nuevaImagen.style.cursor = 'pointer';
        nuevaImagen.style.width = '15px';
        nuevaImagen.style.height = '15px';
        canvasContainer.appendChild(nuevaImagen);
        this.enviarMensajeAUsuario('ATACHES AÑADIDOS CON EXITO');
      });
    } else if(accion == "remover") {
      this.arraySeleccionado.forEach((label) => {
        var nuevaImagen = document.createElement('img');
        nuevaImagen.classList.add('linea');
        var selector = '.diente[label="' + label + '"]';
        var diente = document.querySelector(selector);

        var rectangulos = diente.getClientRects();
        var dimensiones = diente.getBoundingClientRect();
        var puntoCentralX = rectangulos[0].left;
        var puntoCentralY = rectangulos[0].top;
        nuevaImagen.src = '/DIENTES CORTADOS/remover.png';
        nuevaImagen.style.position = 'absolute';
        nuevaImagen.style.left = puntoCentralX + dimensiones.width / 2.5 + 'px';
        nuevaImagen.style.top = puntoCentralY + dimensiones.height / 2.5 + 'px';
        nuevaImagen.style.cursor = 'pointer';
        nuevaImagen.style.width = '15px';
        nuevaImagen.style.height = '15px';
        canvasContainer.appendChild(nuevaImagen);
        this.enviarMensajeAUsuario('DIENTES REMOVIDOS CON EXITO');
      });

    }else if(accion == "botonvestibular"){
      this.arraySeleccionado.forEach((label) => {
        var nuevaImagen = document.createElement('img');
        nuevaImagen.classList.add('vestibular');
        var selector = '.diente[label="' + label + '"]';
        var diente = document.querySelector(selector);
        

        var rectangulos = diente.getClientRects();
        var dimensiones = diente.getBoundingClientRect();
        var puntoCentralX = rectangulos[0].left;
        var puntoCentralY = rectangulos[0].top;


        if (label <= 16 ){
          nuevaImagen.style.position = 'absolute';
            if(label == 4 || label == 5 || label == 6 || label == 7){
              nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-12) + 'px';
                if(label==4 ){

                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA5.png';
                }
                if(label == 7){
                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA47.png';
                  nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-14) + 'px';
                }else if (label == 5){
                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA5.png';

                }else {
                  nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-14) + 'px';
                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA4567.png';
                }

              }else if(label <= 8 || label == 9|| label >=14){
              nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-10) + 'px';
              nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA.png';
              }else if (label == 13 || label == 12 || label == 11 || label == 10){
                nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-12) + 'px';
                if(label==13 ){

                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA5.png';
                  nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-2) + 'px';
                }
                if(label == 10){
                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA47.png';
                  nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-11) + 'px';
                }else if (label == 12){
                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA5.png';
                  nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-2) + 'px';
                }else {
                  nuevaImagen.style.left = puntoCentralX + ((dimensiones.width / 2.5)-11) + 'px';
                  nuevaImagen.src = '/DIENTES CORTADOS/BOTONARRIBA4567.png';
                }

              }











              nuevaImagen.style.width = '40px';

              if ( label == 7||label== 10){
                nuevaImagen.style.height = '10px';

              }else if (label == 4 ||label == 5 || label == 13 || label == 12){

                nuevaImagen.style.height = '12px';
              }else{
                nuevaImagen.style.height = '20px';

              }












            nuevaImagen.style.top = puntoCentralY  + medidasDientes[label] +'px';

            nuevaImagen.style.cursor = 'pointer';

          
        
            this.enviarMensajeAUsuario('BOTON AÑADIDO CON EXITO');


}


        
        else {
          nuevaImagen.src = '/DIENTES CORTADOS/BOTONVESTABAJO.png';


        }
        canvasContainer.appendChild(nuevaImagen);




      });






    }else if (accion == "botonpalatino"){




    }


    this.apuntarLineasYNumeros();
  }

  //FUNCION PARA AÑADIR STRIPS A PARTIR DE UN ARRAY EMPAREJADO
  añadirStrip() {

    const canvasContainer = document.getElementById('canvasContainer');
    this.creadorParejas(this.arraySeleccionado);

    if (typeof (this.arrayEmparejado[0]) == 'number') {




      this.arrayEmparejado.forEach((label) => {
        var selector = '.diente[label="' + label + '"]';
        var dienteStrip = document.querySelector(selector);


        var rectangulos = dienteStrip.getClientRects();
        var dimensiones = dienteStrip.getBoundingClientRect();
        // OBTIENE EL PUNTO CENTRAL DE LA IMAGEN MAS UNA VARIABLE


        const valorStrip = document.getElementById('valorStrip');
        const valorIngresado = valorStrip.value;
        var nuevaImagen = document.createElement('img');
        var nuevaImagen2 = document.createElement('div');

        nuevaImagen.classList.add('linea');
        nuevaImagen2.classList.add('numeros');

        nuevaImagen2.innerText = valorIngresado;


        if (label >= 1 && label < 8) {

          var puntoCentralX = rectangulos[0].left - 25 + dimensiones.width;
          var puntoCentralY = rectangulos[0].top + rectangulos[0].height / 2;
          nuevaImagen.src = '/DIENTES CORTADOS/PALO2.png';


          nuevaImagen.width = 50;
          nuevaImagen.height = 200;

          // POSICIONAMIENTO DE LA IMAGEN
          nuevaImagen.style.position = 'absolute';
          nuevaImagen.style.left = puntoCentralX + 'px';
          nuevaImagen.style.top = puntoCentralY - 180 + 'px';
          nuevaImagen.style.cursor = 'pointer';
          //POSICIONAMIENTO DEL NUMERO
          nuevaImagen2.style.position = 'absolute';
          nuevaImagen2.style.left = puntoCentralX - 2 + 'px';
          nuevaImagen2.style.top = puntoCentralY - 200 + 'px';
          nuevaImagen2.style.cursor = 'pointer';

          canvasContainer.appendChild(nuevaImagen);
          canvasContainer.appendChild(nuevaImagen2);



        } else if (label == 8) {
          var puntoCentralX = rectangulos[0].left - 20 + dimensiones.width;
          var puntoCentralY = rectangulos[0].top + rectangulos[0].height / 2;
          nuevaImagen.src = '/DIENTES CORTADOS/PALO5.png';


          nuevaImagen.width = 50;
          nuevaImagen.height = 200;

          // POSICIONAMIENTO DE LA IMAGEN
          nuevaImagen.style.position = 'absolute';
          nuevaImagen.style.left = puntoCentralX + 'px';
          nuevaImagen.style.top = puntoCentralY - 180 + 'px';
          nuevaImagen.style.cursor = 'pointer';
          //POSICIONAMIENTO DEL NUMERO
          nuevaImagen2.style.position = 'absolute';
          nuevaImagen2.style.left = puntoCentralX + 7 + 'px';
          nuevaImagen2.style.top = puntoCentralY - 200 + 'px';
          nuevaImagen2.style.cursor = 'pointer';

          canvasContainer.appendChild(nuevaImagen);
          canvasContainer.appendChild(nuevaImagen2);


        } else if (label >= 9 && label < 16) {
          var puntoCentralX = rectangulos[0].left - 16 + dimensiones.width;
          var puntoCentralY = rectangulos[0].top + rectangulos[0].height / 2;
          nuevaImagen.src = '/DIENTES CORTADOS/PALO1.png';


          nuevaImagen.width = 50;
          nuevaImagen.height = 200;

          // POSICIONAMIENTO DE LA IMAGEN
          nuevaImagen.style.position = 'absolute';
          nuevaImagen.style.left = puntoCentralX + 'px';
          nuevaImagen.style.top = puntoCentralY - 180 + 'px';
          nuevaImagen.style.cursor = 'pointer';

          //POSICIONAMIENTO DEL NUMERO
          nuevaImagen2.style.position = 'absolute';
          nuevaImagen2.style.left = puntoCentralX + 15 + 'px';
          nuevaImagen2.style.top = puntoCentralY - 200 + 'px';
          nuevaImagen2.style.cursor = 'pointer';

          canvasContainer.appendChild(nuevaImagen);
          canvasContainer.appendChild(nuevaImagen2);




        } else if (label == 16) {
          //...

        } else if (label >= 17 && label < 24) {
          var puntoCentralX = rectangulos[0].left - 25 + dimensiones.width;
          var puntoCentralY = rectangulos[0].top + rectangulos[0].height / 2;
          nuevaImagen.src = '/DIENTES CORTADOS/PALO3.png';


          nuevaImagen.width = 50;
          nuevaImagen.height = 200;

          // POSICIONAMIENTO DE LA IMAGEN
          nuevaImagen.style.position = 'absolute';
          nuevaImagen.style.left = puntoCentralX + 'px';
          nuevaImagen.style.top = puntoCentralY - 15 + 'px';
          nuevaImagen.style.cursor = 'pointer';

          //POSICIONAMIENTO DEL NUMERO
          nuevaImagen2.style.position = 'absolute';
          nuevaImagen2.style.left = puntoCentralX - 2 + 'px';
          nuevaImagen2.style.top = puntoCentralY + 175 + 'px';
          nuevaImagen2.style.cursor = 'pointer';

          canvasContainer.appendChild(nuevaImagen);
          canvasContainer.appendChild(nuevaImagen2);






        } else if (label == 24) {

          var puntoCentralX = rectangulos[0].left - 20 + dimensiones.width;
          var puntoCentralY = rectangulos[0].top + rectangulos[0].height / 2;
          nuevaImagen.src = '/DIENTES CORTADOS/PALO7.png';


          nuevaImagen.width = 50;
          nuevaImagen.height = 200;

          // POSICIONAMIENTO DE LA IMAGEN
          nuevaImagen.style.position = 'absolute';
          nuevaImagen.style.left = puntoCentralX + 'px';
          nuevaImagen.style.top = puntoCentralY - 15 + 'px';
          nuevaImagen.style.cursor = 'pointer';

          //POSICIONAMIENTO DEL NUMERO
          nuevaImagen2.style.position = 'absolute';
          nuevaImagen2.style.left = puntoCentralX + 8 + 'px';
          nuevaImagen2.style.top = puntoCentralY + 175 + 'px';
          nuevaImagen2.style.cursor = 'pointer';

          canvasContainer.appendChild(nuevaImagen);
          canvasContainer.appendChild(nuevaImagen2);


        }

        else {
          var puntoCentralX = rectangulos[0].left - 15 + dimensiones.width;
          var puntoCentralY = rectangulos[0].top + rectangulos[0].height / 2;
          nuevaImagen.src = '/DIENTES CORTADOS/PALO4.png';


          nuevaImagen.width = 50;
          nuevaImagen.height = 200;

          // POSICIONAMIENTO DE LA IMAGEN
          nuevaImagen.style.position = 'absolute';
          nuevaImagen.style.left = puntoCentralX + 'px';
          nuevaImagen.style.top = puntoCentralY - 15 + 'px';
          nuevaImagen.style.cursor = 'pointer';

          //POSICIONAMIENTO DEL NUMERO
          nuevaImagen2.style.position = 'absolute';
          nuevaImagen2.style.left = puntoCentralX + 15 + 'px';
          nuevaImagen2.style.top = puntoCentralY + 175 + 'px';
          nuevaImagen2.style.cursor = 'pointer';

          canvasContainer.appendChild(nuevaImagen);
          canvasContainer.appendChild(nuevaImagen2);







        }

        this.enviarMensajeAUsuario('Stripping realizado correctamente');

      });
    } else {
      this.enviarMensajeAUsuario('Por favor seleccione los dientes de a parejas para stripping');


    }



    this.apuntarLineasYNumeros();


    this.arrayEmparejado = [];
  }


  //FUNCION PARA ENVIAR MENSAJES DEL ESTADO DEL PROGRAMA AL USUARIO
  enviarMensajeAUsuario(mensaje) {
    this.mensajeAUsuario.innerHTML = mensaje;
    this.mensajeAUsuario.classList.add('activated');
    setTimeout(() => {
      this.mensajeAUsuario.classList.remove('activated');
      setTimeout(() => {
        this.mensajeAUsuario.innerHTML = '';
      }, 1000);
    }, 2500);
  }
  //FUNCION PARA ORGANIZAR DE MAYOR A MENOR
  compararNumeros(a, b) {
    return a - b;
  }





}


const manejadorDientes = new ManejadorDientes();
manejadorDientes.inicializar();
