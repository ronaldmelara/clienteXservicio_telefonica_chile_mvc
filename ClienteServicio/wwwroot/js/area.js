"use strict";
//import Bloodhound from "typeahead.js";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Variables para almacenar el �rea seleccionada y los servicios cargados
let selectedAreaId = null;
let isSuggestionSelected = false; // Variable para controlar si se seleccion� una sugerencia
let selectedSuggestion = {
    idservice: 0, // Valor predeterminado
    service: "",
    idarea: 0,
    enable: 0,
};
document.addEventListener('DOMContentLoaded', () => {
    obtenerAreas().then(data => {
        initializeAreaDropdown(data);
        console.log(data);
        var table = $("#tblAreaServicios").DataTable({
            data: data,
            columns: [
                {
                    data: 'area',
                    title: '&Aacute;rea',
                    render: function (data, type, row) {
                        return `<b>${data}</b>`; // Resalta el nombre del �rea
                    }
                },
                {
                    data: 'Services',
                    title: 'Servicios',
                    render: function (data, type, row) {
                        // Renderiza los servicios en formato lista
                        return data.map((Services) => `- ${Services.service} [${(Services.enable === 1 ? 'Activo' : 'Inactivo')}]`).join('<br>');
                    }
                }
            ],
            rowGroup: {
                dataSrc: 'area' // Agrupa por el campo "areaName"
            },
            scrollX: true, // Permite el desplazamiento horizontal
            /* scrollY: '400px',*/ // Ajusta la altura de la tabla si es necesario
            scrollCollapse: true,
            responsive: true, // Asegura que la tabla se vea bien en dispositivos m�viles
        });
        loadTypeahead();
        loadButtons();
    });
});
function obtenerAreas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/Area/GetAllAreas'); // Hacemos la solicitud GET
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = yield response.json(); // Convertimos la respuesta a JSON
            if (!Array.isArray(data)) {
                throw new Error("Respuesta inesperada de la API");
            }
            return data.map(item => ({
                area: item.area,
                Services: item.services,
                idarea: item.idarea,
            })); // Devolvemos los datos
        }
        catch (error) {
            console.error('Error al llamar la API:', error);
            return [];
        }
    });
}
// Inicializar el dropdown de �reas
function initializeAreaDropdown(areas) {
    const dropdown = document.getElementById("areaDropdown");
    dropdown.innerHTML = '<option value="">Seleccione un &aacute;rea</option>';
    areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area.idarea.toString();
        option.textContent = area.area;
        dropdown.appendChild(option);
    });
    // Manejar el cambio de �rea seleccionada
    dropdown.addEventListener("change", (event) => {
        const selectedOption = event.target.value;
        selectedAreaId = selectedOption ? parseInt(selectedOption) : null;
        loadTypeahead(); // Recargar el autocomplete basado en el �rea seleccionada
    });
}
function loadTypeahead() {
    if (!selectedAreaId) {
        return; // No hay �rea seleccionada, no cargar servicios
    }
    const serviceSuggestionEngine = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("service"),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: `/api/v1/services/area/%AREAID?query=%QUERY`,
            wildcard: "%QUERY",
            prepare: (query, settings) => {
                if (!selectedAreaId) {
                    throw new Error("Area ID is not selected.");
                }
                // Verifica que settings.url est� definido
                if (!settings.url) {
                    throw new Error("La URL no est� definida en los settings.");
                }
                // Reemplaza %AREAID con el �rea seleccionada.
                settings.url = settings.url.replace("%AREAID", selectedAreaId === null || selectedAreaId === void 0 ? void 0 : selectedAreaId.toString());
                settings.url = settings.url.replace("%QUERY", encodeURIComponent(query));
                return settings;
            },
            transform: (response) => {
                console.log("Datos transformados:", response);
                serviceSuggestionEngine.add(response);
                // Transformar la respuesta en una lista de servicios.
                return response;
            },
        },
    });
    const input = $('#the-basics .typeahead');
    $('#the-basics .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
    }, {
        name: 'services',
        display: 'service',
        source: serviceSuggestionEngine,
        templates: {
            suggestion: (data) => `<div class="dropdown-item">
                        <strong>${data.service}</strong>
                        
                    </div>`, // Bootstrap styling for dropdown items
        },
    }).on("typeahead:select", function (e, suggestion) {
        console.log("Servicio seleccionado:", suggestion);
        isSuggestionSelected = true; // Marcar que se seleccion� algo
        selectedSuggestion = suggestion;
        // Habilitar eliminar y deshabilitar guardar
        $("#btnDisable").attr('data-enable', suggestion.enable);
        if (suggestion.enable === 1) {
            $("#btnDisable").text("Deshabilitar");
        }
        else {
            $("#btnDisable").text("Habilitar");
        }
        $("#btnDisable").prop("disabled", false);
        $("#btnSave").prop("disabled", true);
        $("#bg-warn").text("Usted ha seleccionado un servicio existente.");
        $("#bg-warn").show();
    }).on("typeahead:autocomplete", function (e, suggestion) {
        console.log("Autocompletado:", suggestion);
    })
        .on("typeahead:close", function () {
        var _a;
        const inputValue = (_a = $(this).val()) === null || _a === void 0 ? void 0 : _a.toString().trim();
        if (isSuggestionSelected) {
            // Se seleccion� un elemento: no hacer nada
            $("#bg-warn").hide();
            isSuggestionSelected = false; // Reiniciar para la pr�xima interacci�n
        }
        if (inputValue) {
            console.log("Valor ingresado manualmente:", inputValue);
            // L�gica para validar si es un nuevo servicio
            serviceSuggestionEngine.search(inputValue, (matches) => {
                if (matches.length === 0) {
                    console.log("El valor ingresado no coincide con ning�n servicio existente.");
                    $("#bg-warn").hide();
                    selectedSuggestion.enable = 1;
                    selectedSuggestion.idarea = Number($("#areaDropdown").val());
                    selectedSuggestion.service = inputValue;
                    // Nuevo servicio detectado
                    $("#btnSave").prop("disabled", false);
                    $("#btnDisable").prop("disabled", true);
                }
                else {
                    console.log("Coincidencias encontradas:", matches);
                    $("#bg-warn").text("Usted ha seleccionado un servicio existente.");
                    $("#bg-warn").show();
                    selectedSuggestion = matches[0];
                    // Servicio existente
                    $("#btnDisable").attr('data-enable', matches[0].enable);
                    if (matches[0].enable === 1) {
                        $("#btnDisable").text("Deshabilitar");
                    }
                    else {
                        $("#btnDisable").text("Habilitar");
                    }
                    $("#btnDisable").prop("disabled", false);
                    $("#btnSave").prop("disabled", true);
                }
            });
        }
        else {
            console.log("Ning�n valor ingresado");
            $("#bg-warn").hide();
            // Deshabilitar ambos botones si no hay valor en el input
            $("#btnDisable").prop("disabled", true);
            $("#btnSave").prop("disabled", true);
        }
    });
}
// Funci�n para actualizar el estado de 'enable'
function updateServiceEnableStatus(serviceId, isEnabled) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/api/v1/services/${serviceId}/enable`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(isEnabled),
            });
            if (!response.ok) {
                const error = yield response.json();
                console.error("Error al actualizar el estado:", error.message);
                return;
            }
            const result = yield response.json();
            console.log("Estado actualizado:", result.message);
        }
        catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });
}
function addService(newService) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/v1/services/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newService),
            });
            if (!response.ok) {
                const error = yield response.text();
                throw new Error(`Error al crear el servicio: ${error}`);
            }
            const result = yield response.json();
            console.log('Servicio creado exitosamente:', result);
            return result.id; // Devuelve el ID del nuevo servicio
        }
        catch (error) {
            console.error('Error:', error);
            throw error; // Propaga el error para manejarlo externamente
        }
    });
}
function loadButtons() {
    const myBtnEnable = document.getElementById('btnDisable');
    const myBtnNew = document.getElementById('btnSave');
    if (myBtnEnable) {
        myBtnEnable.addEventListener('click', () => {
            const valEnable = $(myBtnEnable).attr('data-enable') || '';
            updateServiceEnableStatus(selectedSuggestion.idservice, (valEnable === '1' ? false : true)).then(() => {
                console.log("actualizado");
            });
        });
    }
    if (myBtnNew) {
        myBtnNew.addEventListener('click', () => {
            addService(selectedSuggestion).then(newId => {
                console.log(`El ID del nuevo servicio es: ${newId}`);
            }).catch(error => {
                console.error('Error al agregar el servicio:', error);
            });
        });
    }
}
