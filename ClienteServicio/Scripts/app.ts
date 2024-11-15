// Scripts/app.ts

//import { extend } from "jquery";


// Ejecuta la función saludo() cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {


    obtenerDatos()
        .then(data => {

            const columnasDinamicas = Object.keys(data[0]).map((key, index) => ({
                title: key, // El nombre de la columna será la clave del objeto
                data: key,   // La propiedad que representa el dato de esa columna
                width: index === 1 ? '350px' : 'auto', // Aplica ancho fijo solo a la segunda columna (índice 1)
                className: index === 1 ? 'colum' : '',
                orderable: false,
                render: function (data: any, type: string, row: any, meta: any) {
                    // Si el valor es un booleano, renderizar un checkbox
                    if (typeof data === 'boolean') {
                      
                        return `<div class="form-check form-switch"><input class="form-check-input"  ${ data? 'checked' : ''} type="checkbox" disabled></div>`;

                        //if (data) {
                        //    return `<input type="checkbox" class="checkbox" disabled>`;
                        //} else {
                        //    return `<input type="checkbox" class="checkbox" disabled>`;
                        //}
                        //return `<input type="checkbox" class="checkbox" ${data ? 'checked disabled' : 'disabled'}>`;
                    }
                    // Para otros valores, retornar el dato tal cual
                    return data;
                }
            }));

            // Insertar la columna de icono de edición al principio del array
            columnasDinamicas.unshift({
                title: '',
                data: '',                     // Sin un campo específico de datos (no mapeado a una propiedad)
                width: 'auto',
                className: 'dt-center editor-edit', // Para centrar el contenido
                orderable: false,                // No ordenable
                render: function (data: any, type: string, row: any, meta: any) {
                    //debugger;
                    //return '<button class="btn btn-primary" onclick="openWindow('+ row.id +', \''+ row.cliente+'\');"><i class="fa fa-pencil"></i></button>';
                    return '<button class="btn btn-primary edit-btn" data-status="none"><i class="fa fa-pencil"></i></button>';
                }
            });

            console.log('Datos recibidos:', data);  // Datos procesados
            var table = $("#miTabla").DataTable({
                data: data,
                columns: columnasDinamicas,

                scrollX: true,    // Permite el desplazamiento horizontal
                /* scrollY: '400px',*/     // Ajusta la altura de la tabla si es necesario
                scrollCollapse: true,

                fixedColumns: {
                    start: 3  // Congela las dos primeras columnas
                },
                responsive: true  // Asegura que la tabla se vea bien en dispositivos móviles
                layout: {
                    topStart: {
                        buttons: [
                            {
                                extend: 'colvisGroup',
                                text: 'Cloud',
                                show: [3,4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16],
                                hide: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                                className: 'colvisGroup'
                            },
                            {
                                extend: 'colvisGroup',
                                text: 'Cyber',
                                show: [17,18, 19, 20, 21, 22, 23, 24, 25, 26],
                                hide: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                                className: 'colvisGroup'
                            },
                            {
                                extend: 'colvisGroup',
                                text: 'Show all',
                                show: ':hidden',
                                className: 'colvisGroup'
                            }
                        ]
                    }
                }
            } as any); 

            $('#miTabla tbody').on('click', '.edit-btn', function () {
                const btn = $(this);
                // Obtener la fila que contiene el botón editado
                const row = $(this).closest('tr');
                // Encontrar todos los checkboxes dentro de la fila
                const checkboxes = row.find('input[type="checkbox"]');
                console.log(btn.attr("data-status"));
                if (btn.attr("data-status") === 'none') {
                    debugger;
                    btn.attr('data-status', "editing");
                    console.log(btn.attr("data-status"));
                    // Asegúrate de que el índice (2) corresponde a la columna correcta
                    checkboxes.removeClass('disabled').addClass('enabled');
                    btn.removeClass('btn-primary').addClass('btn-danger');
                    // Habilitar todos los checkboxes en esa fila
                    checkboxes.prop('disabled', false);
                    return;
                }
                if (btn.attr("data-status") === 'editing') {
                    btn.attr('data-status', "none");
                    console.log(btn.attr("data-status"));
                    // Asegúrate de que el índice (2) corresponde a la columna correcta
                    checkboxes.removeClass('enabled').addClass('disabled');
                    btn.removeClass('btn-danger').addClass('btn-primary');
                    // Habilitar todos los checkboxes en esa fila
                    checkboxes.prop('disabled', true);
                    return;
                }
            });

            $('#miTabla_wrapper').on('click', '.colvisGroup', function () {
                var btns = $('.colvisGroup');
                btns.removeClass('selected');
                $(this).addClass('selected');
            });

            table.on('column-visibility.dt', function (e, settings, column, state) {
                
            });

            function updateColvisButtonState() {
                var btns = $('.colvisGroup');  // Obtener todos los botones de colvisGroup

                // Iteramos sobre cada botón de colvisGroup y verificamos el estado de visibilidad de las columnas correspondientes
                btns.each(function () {
                    var btn = $(this);
                    var btnText = btn.text().trim();

                    var isActive = false;

                    // Revisamos los grupos de columnas y verificamos si todas las columnas de ese grupo están visibles
                    table.settings()[0].oInit.colVis.groups.forEach(function (group) {
                        if (group.text === btnText) {
                            isActive = group.show.every(function (idx) {
                                return table.column(idx).visible();  // Verificar si todas las columnas de este grupo están visibles
                            });
                        }
                    });

                    // Si el grupo está activo, le añadimos la clase 'selected' al botón
                    if (isActive) {
                        btn.addClass('selected');
                    } else {
                        btn.removeClass('selected');
                    }
                });
            }


        })
        .catch(error => {
            console.error('Error:', error);  // Error manejado
        });



    // Detectar el cambio de visibilidad y actualizar los botones
    
   
;
});




function openWindow(id:number, name:string) {
    const button = document.getElementById('openModalButton') as HTMLButtonElement;
    const modalElement = document.getElementById('myModal') as HTMLElement;

    // Asegúrate de que el modal se puede mostrar correctamente
    const modal = new bootstrap.Modal(modalElement);

    const title = document.getElementById('modalCustomer') as HTMLTitleElement;
    title.innerText = name;

    // Evento que abre el modal cuando el botón es presionado
    //button.addEventListener('click', () => {

    cargarDatosCliente();
        modal.show();
    //});
}


async function obtenerDatos() {
    try {
        const response = await fetch('/Home/GetAllContracts');  // Hacemos la solicitud GET
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
       
        const data = await response.json();  // Convertimos la respuesta a JSON

        console.log(data);
        return data;  // Devolvemos los datos
    } catch (error) {
        console.error('Error al llamar la API:', error);
    }
}

function cargarDatosCliente() {

    // Definir la interfaz para los objetos dentro del arreglo
    interface Servicio {
        idCliente: number;
        idServicio: number;
        nombre: string;
    }

    // Declarar la constante y tiparla correctamente
    const data2: { data: Servicio[] } = {
        data: [
            {
                idCliente: 1,
                idServicio: 1,
                nombre: "Azure"
            },
            {
                idCliente: 1,
                idServicio: 9,
                nombre: "OneInbox"
            }
        ]
    };

    if ($.fn.DataTable.isDataTable('#miTablaMantenedor')) {
        $('#miTablaMantenedor').DataTable().destroy();
    }

    $('#miTablaMantenedor tbody').empty();

    $("#miTablaMantenedor").DataTable({
        data: data2.data,
        columns: [
            { data: 'idCliente', name: "Id", visible: false },
            { data: 'idServicio', name: "Id Servicio", visible: false },
            { data: 'nombre' , name: "Servicio"}
        ],

        scrollX: true,    // Permite el desplazamiento horizontal
        /* scrollY: '400px',*/     // Ajusta la altura de la tabla si es necesario
        scrollCollapse: true,

        responsive: true  // Asegura que la tabla se vea bien en dispositivos móviles
    }as any);

}