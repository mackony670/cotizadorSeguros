// variables del DOM
const DomFormulario = document.getElementById('cotizar-seguro');
const DomMarca = document.getElementById('marca');
const DomResultado = document.getElementById('resultado');
//variables del año del coche que se puede asignar
const maxYear = new Date().getFullYear();
const minYear = maxYear - 20;


const anios = document.getElementById('anio');

// cotizador de seguros
//este es un constructor
function Seguro(marca, anio, tipo) {
    this.marca = marca;
    this.anio = anio;
    this.tipo = tipo;

}
Seguro.prototype.cotizarSeguro = function () {
    /*  
        2 = asiatico = 1.05
        1 = americano = 1.15
        3 = europeo = 1.35
    
    */

    const base = 2000;
    let cantidad;

    switch (this.marca) {
        case '1':

            cantidad = base * 1.15;
            break;
        case '2':

            cantidad = base * 1.05;
            break;
        case '3':

            cantidad = base * 1.35;
            break;

    }
    //difernciad de años

    let diferencia = maxYear - this.anio;
    // cada años de diferencia hay que quitarle la diferencia 
    cantidad -= ((diferencia * 3) * cantidad) / 100;
    /*
        si el seguro es basico +30%
        si es completo +50%
    */
    if (this.tipo == 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    return cantidad
}
//este es otro constructor todo lo que se muestra
function Interfaz() {

}
Interfaz.prototype.mostrarMensaje = function (mensaje, tipo) {
    const div = document.createElement('div');
    if (tipo == 'error') {
        div.classList.add('mensaje', 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }

    div.innerHTML = `${mensaje}`
    DomFormulario.insertBefore(div, document.querySelector('.form-group'))
    setTimeout(function () {
        document.querySelector('.mensaje').remove();
    }, 2000)

}
Interfaz.prototype.mostrarResultado = function (data, cantidad) {
    let marca;
    switch (data.marca) {
        case '1':
            marca = 'Americano'
            break;
        case '2':
            marca = 'Aciatico'
            break;
        case '3':
            marca = 'Europeo'
            break;
    }
    //crear un div
    const div = document.createElement('div');
    div.innerHTML = `
        <header><h2>Tu resumen</h2></header>
        <p>Marca: ${marca}</p>
        <p>Año: ${data.anio}</p>
        <p>TipoSeguro: ${data.tipo}</p>
        <h3>Total: ${cantidad}</h3>
        `;
    const spinner = document.querySelector('#cargando img')
    
    spinner.style.display = 'block';
    
    setTimeout(function(){
        spinner.style.display = 'none'
        DomResultado.appendChild(div);
    },2000)
}
// esta es una clase de js

//event listeners

for (let i = maxYear; i >= minYear; i--) {
    let option = document.createElement('option');
    option.value = i;//le añade un value al option que esta en el doc con id anio
    option.innerHTML = i;//le añade un html al option que esta en el doc con id anio
    anios.appendChild(option);//se le añade todo al doc

}

DomFormulario.addEventListener('submit', function (e) {
    //leer el tipo de carro
    const marcaSelecionada = DomMarca.options[DomMarca.selectedIndex].value;

    //leer el año del carro
    const aniosSeleccionado = anios.options[anios.selectedIndex].value;

    //leyendo el tipo de seguro
    const tipoSeguro = document.querySelector('input[name="tipo"]:checked').value;

    //creando la instancia de la interfaz
    const interfaz = new Interfaz();
    // revisando que los campos no esten vacios
    if (
        marcaSelecionada == '' ||
        aniosSeleccionado == '' ||
        tipoSeguro == ''
    ) {

        interfaz.mostrarMensaje('Faltan datos, ingrese los datos que se le pide y vuelve a intentarlo', 'error')

    } else {
        // limpiar resultados anteriores
        const resultados =document.querySelector('#resultado div')
        // console.log(resultados)
        
        if(resultados != null && resultados != undefined){
            resultados.remove();
        }

        //instanciar seguros
        const seguro = new Seguro(marcaSelecionada, aniosSeleccionado, tipoSeguro);

        //Haciendo la l0ogica del cotizador del coche
        const cantidad = seguro.cotizarSeguro();
        //mostrar el resultado
        interfaz.mostrarResultado(seguro, cantidad);
        interfaz.mostrarMensaje('Cotizando...', 'exito')
    }


    e.preventDefault();
})
