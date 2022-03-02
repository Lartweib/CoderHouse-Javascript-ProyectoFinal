// STORAGE
const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor)};

// ARRAY DE PRODUCTOS
const productos = [];

// CLASES PRODUCTOS
class ProductoJSON {
    constructor (obj) {
        this.nombre = obj.nombre;
        this.costo = parseFloat(obj.costo).toFixed(2);
        this.iva = obj.iva;
        this.rentabilidad = parseFloat(obj.rentabilidad).toFixed(2);
        this.rentabilidadConvertida = parseFloat(obj.rentabilidadConvertida).toFixed(2);
        this.ivaConvertido = parseFloat(obj.ivaConvertido).toFixed(2);
        this.importeNeto = parseFloat(obj.importeNeto).toFixed(2);
        this.importeFinal = parseFloat(obj.importeFinal).toFixed(2).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
        this.costoFormateado = obj.costoFormateado
        this.importeFinalFormateado = obj.importeFinalFormateado
    }
}

class Producto {
    constructor (nombre, costo, rentabilidad, iva) {
        this.nombre = nombre;
        this.costo = costo;
        this.iva = iva;
        this.rentabilidad = parseFloat(rentabilidad);
        this.rentabilidad = this.rentabilidad.toFixed(2);
        this.rentabilidadConvertida = (rentabilidad/100+1).toFixed(2);
    }

    convertirIva() {
        if (this.iva === "10.5%") {
            this.ivaConvertido = 1.105;
        }else {
            this.ivaConvertido = 1.21;
        };
        
    }
    
    calcular() {
        this.importeNeto = this.costo*this.ivaConvertido;
        this.importeFinal = (this.importeNeto*this.rentabilidadConvertida).toFixed(2);
    }

    formatearImportes() {
        var formatoNumero = numeral(this.costo);
        this.costoFormateado = formatoNumero.format('0,0.00');
        formatoNumero = numeral(this.importeFinal);
        this.importeFinalFormateado = formatoNumero.format('0,0.00');
    }
};


// FUNCIONES
// Mensaje al no tener productos guardados
function sinProductos() {
    if ($("tr .productos").length === 0) {
        const mensajeVacio = $(".mensaje-vacio");
        mensajeVacio.append(`
        <div class="tarjetas row m-auto mx-auto px-3 py-3">
            <div class="col-sm-12 mt-3 posteos">
                <div class="card">
                    <div class="card-header">Sin datos</div>
                    <div class="card-body">
                        <h5 class="card-title">Aun no se cargaron productos</h5>
                        <p class="card-text">Para agregar o exportar productos presione dichas opciones en el menu</p>
                        <h1><span class="ion ion-md-funnel"></span></h1>
                    </div>
                </div>
            </div>
        </div>`);
    } else {
        $( "div" ).remove( ".tarjetas" );
    };
}

// visualizar productos
function mostrarProductosEnDom(array = productos) {
    const listadoDeProductos = $("#tabla");
    sinProductos();
    for (const producto of array) {
        listadoDeProductos.append(`<tr class="productos">
        <td>${producto.nombre}</td><td class="pleft">$</td><td class="pright">${producto.costoFormateado}</td><td class="pright">${producto.iva}</td><td class="pright">${producto.rentabilidad}%</td><td class="pright">${producto.importeFinalFormateado}</td><td class="pcenter"><button type="button" class="btnDelete" onclick="borrarProducto('${producto.nombre}')" title="Eliminar"><i class="ion ion-md-trash"></i></button>     <button type="button" class="btnEdit" data-bs-toggle="modal" data-bs-target="#altaProductos" onclick="editarProducto('${producto.nombre}')" title="Editar"><i class="ion ion-md-create"></i></button></td>
    </tr>`);
    }
    $(".productos").fadeIn(800);
    $( "div" ).remove( ".tarjetas" );
}

// levantar localstorage
function traerLocalStorage() {
    if (localStorage.length === 0) {   
        sinProductos();
    }
    else {
        const almacenados = JSON.parse(localStorage.getItem("listaProductos"));
        for (const objeto of almacenados) {
        productos.push(new ProductoJSON(objeto));
        }
        mostrarProductosEnDom()
    }
}

// busqueda de producto
function buscarProducto() {
    var busqueda = $("#busqueda").val().toUpperCase();
    const productosFiltrados = productos.filter( producto => producto.nombre.includes(busqueda))
    borrarListadoProductos()
    mostrarProductosEnDom(productosFiltrados)
    if (productos.length === 0) {
        sinProductos();
    }
}

// editar producto 
function editarProducto(nombre) {
    const productoAEditar= productos.find( producto => producto.nombre === nombre);
    var indice = productos.indexOf(productoAEditar);
    $("#btnAgregar > span").text("Modificar")
    $(".tituloModal").text("Modificacion de producto")

    //------------
    $("#nombre").val(productoAEditar.nombre);
    $("#costo").val(productoAEditar.costo);
    $("#rentabilidad").val(productoAEditar.rentabilidad);
    $("#iva").val(productoAEditar.iva);
    productos.splice(indice,1);
    
}

// borrar producto
function borrarProducto(nombre) {
    var productoAEliminar= productos.find( producto => producto.nombre === nombre);
    var indice = productos.indexOf(productoAEliminar);
    productos.splice(indice,1);
    borrarListadoProductos();
    mostrarProductosEnDom();
    if (productos.length === 0) {
        sinProductos();
    }
}

// borrar productos del dom
function borrarListadoProductos() {
    $( "tr" ).remove( ".productos" );
}

// borrar localstorage y refrescar la pagina
function borrarLocalStorage() {
    localStorage.clear();
    Toastify({
        text: `Se borraron todos los datos almacenados localmente!`,
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
    setTimeout(function(){
        window.location.reload();}, 2000);
}


// validar formulario
function validarFormulario(tipo) {

    // guardamos en variables los datos del formulario 

    var nombre = $("#nombre").val().toUpperCase();
    var costo = $("#costo").val();
    var rentabilidad = $("#rentabilidad").val();
    var iva = $("#iva").val();


    // Validamos los datos del Campo Nombre
    if (nombre == "") {
        Toastify({
            text: "El campo Nombre está vacío!",
            duration: 3000,
            style: {
                background: "linear-gradient(180deg,#ff0000 0%, #760808 80%)",
            }
        }).showToast();
        return false;
    } else { // Validamos que el nombre del producto no exista en el array
        for (const producto of productos) {
            if(productos.find( producto => producto.nombre === nombre)){
                Toastify({
                    text: `El producto ${nombre} ya existe!`,
                    duration: 3000,
                    style: {
                        background: "linear-gradient(180deg,#ff0000 0%, #760808 80%)",
                    }
                }).showToast();
                return false;
            }
        }
    }

    // Validamos los datos del Campo Costo
    if (costo == "") {
        Toastify({
            text: `El campo costo esta vacio!`,
            duration: 3000,
            style: {
                background: "linear-gradient(180deg,#ff0000 0%, #760808 80%)",
            }
        }).showToast();
        return false;
    }

    // Validamos los datos del Campo rentabilidad
    if (rentabilidad == "") {
        Toastify({
            text: `El campo rentabilidad esta vacio!`,
            duration: 3000,
            style: {
                background: "linear-gradient(180deg,#ff0000 0%, #760808 80%)",
            }
        }).showToast();
        return false;
    }

    // Validamos los datos del Campo iva
    if (iva == "-") {
        Toastify({
            text: `Debe seleccionar un porcentaje de iva para el producto!`,
            duration: 3000,
            style: {
                background: "linear-gradient(180deg,#ff0000 0%, #760808 80%)",
            }
        }).showToast();
        return false;
    }
    
    //Agregamos al array productos los datos del Formulario
    
    productos.push(new Producto(nombre, costo, rentabilidad, iva) );
    productos.find( producto => producto.nombre === nombre).convertirIva();
    productos.find( producto => producto.nombre === nombre).calcular();
    productos.find( producto => producto.nombre === nombre).formatearImportes();
    Toastify({
        text: `El producto ${nombre} se ${tipo} correctamente!`,
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
    
    //Limpiamos los productos mostrados y volvemos a mostrar nuevamente el array completo
    borrarListadoProductos()
    mostrarProductosEnDom()

    //Limpiamos el formulario
    $("#formul")[0].reset();

    return true;
}

// ASIGNAMOS FUNCIONES A LOS BOTONES

// asignamos la funcion para traer JSON al boton
$("#btnExportar").click(() => { 
    $.get("./JSON/Productos.json", function (respuesta, estado) {
        console.log(">> estado: ", estado);
        if(estado === "success"){
            const productosExportados = respuesta.productos;
            for (const productoExportado of productosExportados) {
                const nombre = productoExportado.nombre
                if(productos.find( producto => producto.nombre === nombre)){
                    console.log("producto ya existente: " + nombre)
                    continue
                } else {
                    productos.push(new ProductoJSON(productoExportado))
                    borrarListadoProductos()
                    mostrarProductosEnDom()
                }
            }
            Toastify({
                text: `Se importaron los productos correctamente`,
                duration: 3000,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        } 
    });
});

//asignamos la funcion guardar en local al boton
$("#btnGuardar").click(() => {
    (guardarLocal("listaProductos", JSON.stringify(productos)));
    Toastify({
        text: `Los productos se guardaron en el LocalStorage correctamente`,
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
});

// Asignamos al boton agregar producto la ejecucion de la funcion validar formulario y el cambio de texto para poder retilizar el modal tanto para agregar productos como para modificarlos
$("#btnAgregar").click (() => {
    if ($("#btnAgregar > span").text() === "Agregar") {
        if (validarFormulario("creo")) {
            $("#altaProductos").click();}
    } else {
        if (validarFormulario("modifico")) {
            $("#altaProductos").click();
            setTimeout(function(){
                $("#btnAgregar > span").text("Agregar");
                $(".tituloModal").text("Nueva alta de producto");}, 2000);
        }
    }
});

// validacion de botones al precionar la tecla enter
$("#busqueda").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnBuscar").click();
    }
});

$("#nombre").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnAgregar").click();
    }
});

$("#costo").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnAgregar").click();
    }
});

$("#rentabilidad").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnAgregar").click();
    }
});

$("#iva").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnAgregar").click();
    }
});

//Levantamos el local storage almacenado por el usuario.
traerLocalStorage()


