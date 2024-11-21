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
const cachedRowValues = {};
var enumArea;
(function (enumArea) {
    enumArea[enumArea["Cloud"] = 1] = "Cloud";
    enumArea[enumArea["Cyber"] = 2] = "Cyber";
})(enumArea || (enumArea = {}));
const INITIAL_COLUMN_INDEX = 3;
let ListServices = [];
let colsCloud = [];
let colsCyber = [];
function getIndexColumns() {
    const a = ListServices.filter(srv => srv.idarea === enumArea.Cloud);
    const b = ListServices.filter(srv => srv.idarea === enumArea.Cyber);
    for (let i = INITIAL_COLUMN_INDEX; i < (a.length + INITIAL_COLUMN_INDEX); i++) {
        colsCloud.push(i);
    }
    for (let i = (colsCloud.length + INITIAL_COLUMN_INDEX); i < (b.length + colsCloud.length + INITIAL_COLUMN_INDEX); i++) {
        colsCyber.push(i);
    }
}
// Ejecuta la función saludo() cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    obtenerServicios().then(data => {
        ListServices = data;
        getIndexColumns();
    });
    obtenerClientesServicios()
        .then(data => {
        const columnasDinamicas = Object.keys(data[0]).map((key, index) => ({
            title: key, // El nombre de la columna será la clave del objeto
            data: key, // La propiedad que representa el dato de esa columna
            width: index === 1 ? '350px' : 'auto', // Aplica ancho fijo solo a la segunda columna (índice 1)
            className: index === 1 ? 'colum' : '',
            orderable: false,
            render: (data) => (typeof data === 'boolean' ? renderCheckbox(data, key) : data),
        }));
        // Insertar la columna de icono de edición al principio del array
        columnasDinamicas.unshift({
            title: '',
            data: '', // Sin un campo específico de datos (no mapeado a una propiedad)
            width: 'auto',
            className: 'dt-center editor-edit', // Para centrar el contenido
            orderable: false, // No ordenable
            render: () => '<button class="btn btn-primary edit-btn" data-status="none" ><i class="fa fa-pencil"></i></button>'
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
            responsive: true, // Asegura que la tabla se vea bien en dispositivos móviles
            layout: {
                topStart: {
                    buttons: [
                        {
                            extend: 'colvisGroup',
                            text: '<i class="fa fa-cloud"></i> Cloud',
                            show: colsCloud,
                            hide: colsCyber,
                            className: 'colvisGroup btn btn-primary'
                        },
                        {
                            extend: 'colvisGroup',
                            text: '<i class="fa fa-shield"></i> Cyber',
                            show: colsCyber,
                            hide: colsCloud,
                            className: 'colvisGroup  btn btn-secondary'
                        },
                        {
                            extend: 'colvisGroup',
                            text: '<i class="fa fa-bars"></i> Show all',
                            show: ':hidden',
                            className: 'colvisGroup btn btn-info'
                        },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i> Export to Excel', // Texto e ícono
                            className: 'btn btn-success', // Clase de Bootstrap para el botón
                            exportOptions: {
                                /* columns: ':visible', // Exporta solo las columnas visibles*/
                                columns: ':not(:first-child)', // Excluir la primera columna
                                format: {
                                    body: (data, row, column, node) => {
                                        // Si la columna contiene un checkbox
                                        if ($(node).find('input[type="checkbox"]').length) {
                                            // Retorna 1 si está marcado, 0 si no lo está
                                            return $(node).find('input[type="checkbox"]').is(':checked') ? '1' : '0';
                                        }
                                        // Si los datos son una estructura HTML en otras filas no visibles
                                        if (typeof data === 'string' && data.includes('form-check-input')) {
                                            const isChecked = $(data).find('input[type="checkbox"]').is(':checked');
                                            return isChecked ? '1' : '0';
                                        }
                                        // Retorna el contenido original para otras columnas
                                        return data;
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        });
        $('#miTabla tbody').on('click', '.edit-btn', function () {
            ConfigCheckboxes(this);
        });
        $('#miTabla').on('change', '.cbService', function () {
            $(this).attr('data-status', "edited");
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
                enable: 0
            })); // Devolvemos los datos
        }
        catch (error) {
            console.error('Error al llamar la API:', error);
            return [];
        }
    });
}
function renderCheckbox(data, key) {
    return `
        <div class="form-check form-switch">
            <input 
                class="form-check-input cbService" 
                type="checkbox" 
                data-status="none"
                data-key="${key}"
                ${data ? 'checked' : ''} 
                disabled>
        </div>
    `;
}
function ConfigCheckboxes(button) {
    const btn = $(button);
    // Obtener la fila que contiene el botón editado
    const row = btn.closest('tr');
    const clientId = row.find('td').eq(1).text(); // Obtener el ID que está en la segunda celda (índice 1)
    // Encontrar todos los checkboxes dentro de la fila
    const checkboxes = row.find('input[type="checkbox"]');
    if (btn.attr("data-status") === 'none') {
        btn.attr('data-status', "editing");
        // Almacenar los valores actuales de los checkboxes en cache
        const rowValues = {};
        checkboxes.each((index, element) => {
            const key = $(element).attr('data-key') || '';
            const isChecked = $(element).is(':checked');
            // Guardar el valor original
            rowValues[key] = isChecked;
        });
        cachedRowValues[clientId] = rowValues;
        // Asegúrate de que el índice (2) corresponde a la columna correcta
        checkboxes.removeClass('disabled').addClass('enabled');
        btn.removeClass('btn-primary').addClass('btn-danger');
        btn.find('i').removeClass("fa-pencil").addClass('fa-save');
        // Habilitar todos los checkboxes en esa fila
        checkboxes.prop('disabled', false);
    }
    else if (btn.attr("data-status") === 'editing') {
        // Mostrar modal de confirmación antes de guardar
        showConfirmModal(() => {
            saveChanges(checkboxes, clientId);
            btn.attr('data-status', "none");
            checkboxes.removeClass('enabled').addClass('disabled');
            btn.removeClass('btn-danger').addClass('btn-primary');
            checkboxes.prop('disabled', true);
            btn.find('i').removeClass("fa-save").addClass('fa-pencil');
        }, () => {
            btn.attr('data-status', "none");
            checkboxes.removeClass('enabled').addClass('disabled');
            btn.removeClass('btn-danger').addClass('btn-primary');
            checkboxes.prop('disabled', true);
            btn.find('i').removeClass("fa-save").addClass('fa-pencil');
            if (cachedRowValues[clientId]) {
                const originalValues = cachedRowValues[clientId];
                checkboxes.each((index, element) => {
                    const key = $(element).attr('data-key') || '';
                    $(element).prop('checked', originalValues[key]);
                    $(element).attr('data-status', "none");
                });
            }
        });
    }
}
function saveContracts(elems) {
    return new Promise((resolve, reject) => {
        // Enviar datos al controlador usando fetch
        fetch('/Home/SaveContracts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(elems) // Convierte el array de objetos a JSON
        })
            .then((response) => {
            if (!response.ok) {
                // Si la respuesta no es exitosa, rechazamos la promesa
                return reject('Error: ' + response.statusText);
            }
            return response.json(); // Convertir la respuesta a JSON
        })
            .then((data) => {
            console.log('Success:', data);
            resolve(data); // Resolvemos la promesa con los datos
        })
            .catch((error) => {
            console.error('Error:', error);
            reject(error); // Rechazamos la promesa en caso de error
        });
    });
}
function saveChanges(checkboxes, clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        let elems = [];
        checkboxes.each(function () {
            const _status = $(this).attr("data-status");
            if (_status === "edited") {
                const isChecked = $(this).is(':checked');
                const service = $(this).attr("data-key");
                const srvSelected = ListServices.find(srv => srv.service === service);
                if (srvSelected) {
                    elems.push({ idservice: srvSelected.idservice, idcustomer: Number(clientId), active: (isChecked ? 1 : 0) });
                }
            }
        });
        try {
            const data = yield saveContracts(elems); // Esperar la promesa
            console.log('Data saved successfully:', data);
            // Puedes mostrar un mensaje de éxito aquí
        }
        catch (error) {
            console.error('Error saving contracts:', error);
            // Maneja el error aquí
        }
    });
}
function showConfirmModal(onConfirm, onCancel) {
    const modal = new bootstrap.Modal(document.getElementById('confirmSaveModal'));
    modal.show();
    // Configurar el botón "Confirmar"
    $('#confirmSaveBtn').off('click').on('click', function () {
        onConfirm(); // Ejecuta la acción pasada como argumento
        modal.hide(); // Cierra el modal
    });
    if (onCancel) {
        $('#confirmSaveModal .btn-secondary').off('click').on('click', function () {
            onCancel(); // Ejecuta la acción pasada como argumento
        });
    }
}
