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
var Area;
(function (Area) {
    Area[Area["Cloud"] = 1] = "Cloud";
    Area[Area["Cyber"] = 2] = "Cyber";
})(Area || (Area = {}));
const INITIAL_COLUMN_INDEX = 3;
let ListServices = [];
let colsCloud = [];
let colsCyber = [];
function getIndexColumns() {
    const a = ListServices.filter(srv => srv.idarea === Area.Cloud);
    const b = ListServices.filter(srv => srv.idarea === Area.Cyber);
    for (let i = INITIAL_COLUMN_INDEX; i < (a.length + INITIAL_COLUMN_INDEX); i++) {
        colsCloud.push(i);
    }
    for (let i = (colsCloud.length + INITIAL_COLUMN_INDEX); i < (b.length + colsCloud.length + INITIAL_COLUMN_INDEX); i++) {
        colsCyber.push(i);
    }
}
// Ejecuta la función saludo() cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
    obtenerServicios().then(data => {
        ListServices = data;
        getIndexColumns();
=======
    obtenerServicios().then(() => {
        //console.log(ListServices);
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
        ListServices.forEach((service) => {
        });
    });
    obtenerClientesServicios()
        .then(data => {
        const columnasDinamicas = Object.keys(data[0]).map((key, index) => ({
<<<<<<< HEAD
            title: key,
            data: key,
            width: index === 1 ? '350px' : 'auto',
            className: index === 1 ? 'colum' : '',
            orderable: false,
            render: (data) => (typeof data === 'boolean' ? renderCheckbox(data) : data),
=======
            title: key, // El nombre de la columna será la clave del objeto
            data: key, // La propiedad que representa el dato de esa columna
            width: index === 1 ? '350px' : 'auto', // Aplica ancho fijo solo a la segunda columna (índice 1)
            className: index === 1 ? 'colum' : '',
            orderable: false,
            render: function (data, type, row, meta) {
                // Si el valor es un booleano, renderizar un checkbox
                if (typeof data === 'boolean') {
                    return `<div class="form-check form-switch"><input class="form-check-input"  ${data ? 'checked' : ''} type="checkbox" disabled></div>`;
                }
                // Para otros valores, retornar el dato tal cual
                return data;
            }
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
        }));
        // Insertar la columna de icono de edición al principio del array
        columnasDinamicas.unshift({
            title: '',
<<<<<<< HEAD
            data: '',
            width: 'auto',
            className: 'dt-center editor-edit',
            orderable: false,
            render: () => '<button class="btn btn-primary edit-btn" data-status="none"><i class="fa fa-pencil"></i></button>'
=======
            data: '', // Sin un campo específico de datos (no mapeado a una propiedad)
            width: 'auto',
            className: 'dt-center editor-edit', // Para centrar el contenido
            orderable: false, // No ordenable
            render: function (data, type, row, meta) {
                return '<button class="btn btn-primary edit-btn" data-status="none"><i class="fa fa-pencil"></i></button>';
            }
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
        });
        var table = $("#miTabla").DataTable({
            data: data,
            columns: columnasDinamicas,
<<<<<<< HEAD
            scrollX: true,
=======
            scrollX: true, // Permite el desplazamiento horizontal
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
            /* scrollY: '400px',*/ // Ajusta la altura de la tabla si es necesario
            scrollCollapse: true,
            fixedColumns: {
                start: 3 // Congela las dos primeras columnas
            },
<<<<<<< HEAD
            responsive: true,
=======
            responsive: true // Asegura que la tabla se vea bien en dispositivos móviles
            , // Asegura que la tabla se vea bien en dispositivos móviles
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
            layout: {
                topStart: {
                    buttons: [
                        {
                            extend: 'colvisGroup',
                            text: 'Cloud',
<<<<<<< HEAD
                            show: colsCloud,
                            hide: colsCyber,
=======
                            show: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                            hide: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
                            className: 'colvisGroup'
                        },
                        {
                            extend: 'colvisGroup',
                            text: 'Cyber',
<<<<<<< HEAD
                            show: colsCyber,
                            hide: colsCloud,
=======
                            show: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                            hide: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
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
<<<<<<< HEAD
        $('#miTabla').on('change', '#cbService', function () {
            const isChecked = $(this).is(':checked');
            console.log(`Checkbox cambiado: ${isChecked ? 'Activado' : 'Desactivado'}`);
            $(this).attr('data-status', "edited");
            // Aquí puedes realizar acciones según el estado del checkbox
            if (isChecked) {
                console.log('Activado');
            }
            else {
                console.log('Desactivado');
            }
        });
=======
>>>>>>> b0ea3d1873a98826b67ea6c985914873db1e3bf7
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
            if (!Array.isArray(data)) {
                throw new Error("Respuesta inesperada de la API");
            }
            return data.map(item => ({
                idservice: item.idservice,
                service: item.service,
                idarea: item.idarea,
            })); // Devolvemos los datos
        }
        catch (error) {
            console.error('Error al llamar la API:', error);
            return [];
        }
    });
}
function renderCheckbox(data) {
    return `
        <div class="form-check form-switch">
            <input 
                class="form-check-input" 
                type="checkbox" 
                id="cbService" 
                data-status="none" 
                ${data ? 'checked' : ''} 
                disabled>
        </div>
    `;
}
