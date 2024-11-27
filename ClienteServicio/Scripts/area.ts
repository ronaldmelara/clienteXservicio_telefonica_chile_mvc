//import Bloodhound from "typeahead.js";

interface Service {
    idservice: number,
    service: string,
    idarea: number,
    enable: number
}
interface Area {
    Services: Service[],
    area: string,
    idarea: number
}

// Variables para almacenar el área seleccionada y los servicios cargados
let selectedAreaId: number | null = null;
let isSuggestionSelected = false; // Variable para controlar si se seleccionó una sugerencia
let selectedSuggestion: Service = {
    idservice: 0, // Valor predeterminado
    service: "",
    idarea: 0,
    enable: 0,
};

document.addEventListener('DOMContentLoaded', () => {

    obtenerAreas().then(data => {

        initializeAreaDropdown(data);
        
        var table = $("#tblAreaServicios").DataTable({
            data: data,
            columns: [
                {
                    data: 'area',
                    title: '&Aacute;rea',
                    render: function (data: any, type: any, row: any) {
                        return `<b>${data}</b>`; // Resalta el nombre del área
                    }
                },
                {
                    data: 'Services',
                    title: 'Servicios',
                    render: function (data: any, type: any, row: any) {
                        // Renderiza los servicios en formato lista

                        return data.map((Services: Service) => `- ${Services.service} [${(Services.enable === 1 ? 'Activo' : 'Inactivo')}]`).join('<br>');
                    }
                }
            ],
            rowGroup: {
                dataSrc: 'area' // Agrupa por el campo "areaName"
            },

            paging: false,   // Desactiva la paginación
            searching: false, // Desactiva la barra de búsqueda


        } as any);


        
        loadTypeahead();
        loadButtons();
    });
})

async function obtenerAreas(): Promise<Area[]> {
    try {
        const response = await fetch('/Area/GetAllAreas');  // Hacemos la solicitud GET
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();  // Convertimos la respuesta a JSON
        if (!Array.isArray(data)) {
            throw new Error("Respuesta inesperada de la API");
        }

        return data.map(item => ({
            area: item.area,
            Services: item.services,
            idarea: item.idarea,
        }));  // Devolvemos los datos
    } catch (error) {
        console.error('Error al llamar la API:', error);
        return [];
    }
}

// Inicializar el dropdown de áreas
function initializeAreaDropdown(areas: { idarea: number; area: string }[]): void {
    const dropdown = document.getElementById("areaDropdown") as HTMLSelectElement;
    dropdown.innerHTML = '<option value="">Seleccione un &aacute;rea</option>';
    areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area.idarea.toString();
        option.textContent = area.area;
        dropdown.appendChild(option);
    });

    // Manejar el cambio de área seleccionada
    dropdown.addEventListener("change", (event) => {
        const selectedOption = (event.target as HTMLSelectElement).value;
        selectedAreaId = selectedOption ? parseInt(selectedOption) : null;
        loadTypeahead(); // Recargar el autocomplete basado en el área seleccionada
    });
}

function loadTypeahead(): void {
    if (!selectedAreaId) {
        return; // No hay área seleccionada, no cargar servicios
    }

    const serviceSuggestionEngine = new Bloodhound<Service>({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("service"),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: `/api/v1/services/area/%AREAID?query=%QUERY`,
            wildcard: "%QUERY",
            prepare: (query: string, settings: JQueryAjaxSettings) => {
                if (!selectedAreaId) {
                    throw new Error("Area ID is not selected.");
                }
                // Verifica que settings.url esté definido
                if (!settings.url) {
                    throw new Error("La URL no está definida en los settings.");
                }
                // Reemplaza %AREAID con el área seleccionada.
                settings.url = settings.url.replace("%AREAID", selectedAreaId?.toString());
                settings.url = settings.url.replace("%QUERY", encodeURIComponent(query));
                return settings;
            },
            transform: (response: any) => {

                console.log("Datos transformados:", response);
                serviceSuggestionEngine.add(response);
                // Transformar la respuesta en una lista de servicios.
                return response;
            },
        },
    });

    const input = $('#the-basics .typeahead');

    $('#the-basics .typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1,
        },
        {
            name: 'services',
            display: 'service',
            source: serviceSuggestionEngine,
            templates: {
                suggestion: (data: Service) =>

                    `<div class="dropdown-item">
                        <strong>${data.service}</strong>
                        
                    </div>`, // Bootstrap styling for dropdown items
            },
        }
    ).on("typeahead:select", function (e, suggestion: Service) {
        console.log("Servicio seleccionado:", suggestion);
        isSuggestionSelected = true; // Marcar que se seleccionó algo
        selectedSuggestion = suggestion;
        // Habilitar eliminar y deshabilitar guardar
        $("#btnDisable").attr('data-enable', suggestion.enable);
        if (suggestion.enable === 1) {
            
            $("#btnDisable").text("Deshabilitar");
        } else {
            $("#btnDisable").text("Habilitar");
        }


     
        $("#btnDisable").prop("disabled", false);
        $("#btnSave").prop("disabled", true);

        $("#bg-warn").text("Usted ha seleccionado un servicio existente.");
        $("#bg-warn").show();

    }).on("typeahead:autocomplete", function (e, suggestion: Service) {
        console.log("Autocompletado:", suggestion);
    })
    .on("typeahead:close", function (this: any) {
         const inputValue = $(this).val()?.toString().trim();

        if (isSuggestionSelected) {
             // Se seleccionó un elemento: no hacer nada
             $("#bg-warn").hide();
             isSuggestionSelected = false; // Reiniciar para la próxima interacción
         }

        if (inputValue) {
             console.log("Valor ingresado manualmente:", inputValue);
             // Lógica para validar si es un nuevo servicio
             serviceSuggestionEngine.search(inputValue, (matches: Service[]) => {
                    
                    if (matches.length === 0) {
                        console.log("El valor ingresado no coincide con ningún servicio existente.");
                        $("#bg-warn").hide();

                        selectedSuggestion.enable = 1;
                        selectedSuggestion.idarea = Number($("#areaDropdown").val());
                        selectedSuggestion.service = inputValue;

                        // Nuevo servicio detectado
                        $("#btnSave").prop("disabled", false);
                        $("#btnDisable").prop("disabled", true);
                    } else {
                        console.log("Coincidencias encontradas:", matches);
                        $("#bg-warn").text("Usted ha seleccionado un servicio existente.");
                        $("#bg-warn").show();
                        selectedSuggestion = matches[0];
                        // Servicio existente
                        $("#btnDisable").attr('data-enable', matches[0].enable);
                        if (matches[0].enable === 1) {
                            $("#btnDisable").text("Deshabilitar");
                        } else {
                            $("#btnDisable").text("Habilitar");
                        }
                        $("#btnDisable").prop("disabled", false);
                        $("#btnSave").prop("disabled", true);
                    }
            });
        } else
        {
            console.log("Ningún valor ingresado");
            $("#bg-warn").hide();
            // Deshabilitar ambos botones si no hay valor en el input
            $("#btnDisable").prop("disabled", true);
            $("#btnSave").prop("disabled", true);
        }
     });
}


// Función para actualizar el estado de 'enable'
async function updateServiceEnableStatus(serviceId: number, isEnabled: boolean): Promise<void> {
    try {
        const response = await fetch(`/api/v1/services/${serviceId}/enable`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(isEnabled),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error al actualizar el estado:", error.message);
            return;
        }

        const result = await response.json();
        console.log("Estado actualizado:", result.message);
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

async function addService(newService: Service): Promise<number> {
    try {
        const response = await fetch('/api/v1/services/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newService),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error al crear el servicio: ${error}`);
        }

        const result = await response.json();
        console.log('Servicio creado exitosamente:', result);

        return result.id; // Devuelve el ID del nuevo servicio
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propaga el error para manejarlo externamente
    }
}

function loadButtons(): void {
    const myBtnEnable = document.getElementById('btnDisable') as HTMLButtonElement;
    const myBtnNew = document.getElementById('btnSave') as HTMLButtonElement;

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