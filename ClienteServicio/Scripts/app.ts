interface Service {
    idservice: number,
    service: string,
    idarea: number
}

let ListServices: Service[] = [];
let colsCloud: number[] = [];
let colsCyber: number[] = [];

// Ejecuta la función saludo() cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {


    obtenerServicios().then(() => {
        //console.log(ListServices);
        ListServices.forEach((service) => {

        });
    });


    obtenerClientesServicios()
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
                    return '<button class="btn btn-primary edit-btn" data-status="none"><i class="fa fa-pencil"></i></button>';
                }
            });

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
           
                if (btn.attr("data-status") === 'none') {

                    btn.attr('data-status', "editing");
    
                    // Asegúrate de que el índice (2) corresponde a la columna correcta
                    checkboxes.removeClass('disabled').addClass('enabled');
                    btn.removeClass('btn-primary').addClass('btn-danger');
                    // Habilitar todos los checkboxes en esa fila
                    checkboxes.prop('disabled', false);
                    return;
                }
                if (btn.attr("data-status") === 'editing') {
                    btn.attr('data-status', "none");
     
                    // Asegúrate de que el índice (2) corresponde a la columna correcta
                    checkboxes.removeClass('enabled').addClass('disabled');
                    btn.removeClass('btn-danger').addClass('btn-primary');
                    // Habilitar todos los checkboxes en esa fila
                    checkboxes.prop('disabled', true);
                    return;
                }
            });

            $('#miTabla_wrapper').on('click', '.colvisGroup', function (e, button, config) {
                var btns = $('.colvisGroup');
            
                btns.removeClass('selected');
                $(this).addClass('selected');

                $("#miTabla").DataTable().draw();
            });

         
        })
        .catch(error => {
            console.error('Error:', error);  // Error manejado
        });



    // Detectar el cambio de visibilidad y actualizar los botones
    
   
;
});

async function obtenerClientesServicios() {
    try {
        const response = await fetch('/Home/GetAllContracts');  // Hacemos la solicitud GET
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
       
        const data = await response.json();  // Convertimos la respuesta a JSON

        return data;  // Devolvemos los datos
    } catch (error) {
        console.error('Error al llamar la API:', error);
    }
}

async function obtenerServicios(): Promise<Service[]> {
    try {
        const response = await fetch('/Home/GetAllServices');  // Hacemos la solicitud GET
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();  // Convertimos la respuesta a JSON

        ListServices = Array.from(data);
        
        return ListServices;  // Devolvemos los datos
    } catch (error) {
        console.error('Error al llamar la API:', error);
        return [];
    }
}