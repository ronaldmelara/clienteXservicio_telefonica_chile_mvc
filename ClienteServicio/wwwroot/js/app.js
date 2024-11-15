"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let ListServices = [];
let colsCloud = [];
let colsCyber = [];
function getIndexColumns() {
    let a = ListServices.filter(srv => srv.idarea === 1);
    let b = ListServices.filter(srv => srv.idarea === 2);
    for (let i = 3; i < (a.length + 3); i++) {
        colsCloud.push(i);
    }
    for (let i = (colsCloud.length + 3); i < (b.length + colsCloud.length + 3); i++) {
        colsCyber.push(i);
    }
}
// Ejecuta la función saludo() cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    obtenerServicios().then(() => {
        getIndexColumns();
        obtenerClientesServicios()
            .then(data => {
            const columnasDinamicas = Object.keys(data[0]).map((key, index) => ({
                title: key, // El nombre de la columna será la clave del objeto
                data: key, // La propiedad que representa el dato de esa columna
                width: index === 1 ? '350px' : 'auto', // Aplica ancho fijo solo a la segunda columna (índice 1)
                className: index === 1 ? 'colum' : '',
                orderable: false,
                render: function (data, type, row, meta) {
                    // Si el valor es un booleano, renderizar un checkbox
                    if (typeof data === 'boolean') {
                        return `<div class="form-check form-switch"><input class="form-check-input service-checkbox"  ${data ? 'checked' : ''} type="checkbox" disabled id="cbService" data-status="none"></div>`;
                    }
                    // Para otros valores, retornar el dato tal cual
                    return data;
                }
            }));
            // Insertar la columna de icono de edición al principio del array
            columnasDinamicas.unshift({
                title: '',
                data: '', // Sin un campo específico de datos (no mapeado a una propiedad)
                width: 'auto',
                className: 'dt-center editor-edit', // Para centrar el contenido
                orderable: false, // No ordenable
                render: function (data, type, row, meta) {
                    return '<button class="btn btn-primary edit-btn" data-status="none"><i class="fa fa-pencil"></i></button>';
                }
            });
            var table = $("#miTabla").DataTable({
                data: data,
                columns: columnasDinamicas,
                scrollX: true, // Permite el desplazamiento horizontal
                /* scrollY: '400px',*/ // Ajusta la altura de la tabla si es necesario
                scrollCollapse: true,
                fixedColumns: {
                    start: 3 // Congela las dos primeras columnas
                },
                responsive: true // Asegura que la tabla se vea bien en dispositivos móviles
                , // Asegura que la tabla se vea bien en dispositivos móviles
                layout: {
                    topStart: {
                        buttons: [
                            {
                                extend: 'colvisGroup',
                                text: 'Cloud',
                                show: colsCloud,
                                hide: colsCyber,
                                className: 'colvisGroup'
                            },
                            {
                                extend: 'colvisGroup',
                                text: 'Cyber',
                                show: colsCyber,
                                hide: colsCloud,
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
            });
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
            $('#miTabla tbody').on('change', '.service-checkbox', function (e) {
                console.log(e);
                const isChecked = $(this).prop('checked');
                $(this).attr('data-status', "modified");
            });
            $('#miTabla_wrapper').on('click', '.colvisGroup', function (e, button, config) {
                var btns = $('.colvisGroup');
                btns.removeClass('selected');
                $(this).addClass('selected');
                $("#miTabla").DataTable().draw();
            });
        })
            .catch(error => {
            console.error('Error:', error); // Error manejado
        });
    });
    ;
});
function obtenerClientesServicios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/Home/GetAllContracts'); // Hacemos la solicitud GET
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = yield response.json(); // Convertimos la respuesta a JSON
            return data; // Devolvemos los datos
        }
        catch (error) {
            console.error('Error al llamar la API:', error);
        }
    });
}
function obtenerServicios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/Home/GetAllServices'); // Hacemos la solicitud GET
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = yield response.json(); // Convertimos la respuesta a JSON
            ListServices = Array.from(data);
            return ListServices; // Devolvemos los datos
        }
        catch (error) {
            console.error('Error al llamar la API:', error);
            return [];
        }
    });
}
