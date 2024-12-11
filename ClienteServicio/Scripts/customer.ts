


import "./bootstrap/dist/js/bootstrap.bundle.js";
import { Custormer, Service } from "./interfaces.js";
import { validateRUN, IRun } from "./validadorRut.js";

document.addEventListener('DOMContentLoaded', () => {
    obtenerClientes().then(data => {
        console.log(data);
        var table = $("#tblClientes").DataTable({
            data: data,
            columns: [
                {
                    data: null,
                    title: "",
                    orderable: false,
                    width: '69px',
                    render: function () {
                        // Botón para activar edición
                        return `<button class="btn btn-primary btn-sm edit-button"><i class="fa fa-pencil"></i></button>
                        <button class="btn btn-danger btn-sm del-button"><i class="fa fa-trash"></i></button>`;
                    },
                },
                {
                    data: 'rut',
                    title: 'rut',
                    visible: false,
                   
                },
                {
                    data: 'dv',
                    title: 'dv',
                    visible: false,

                },
                {
                    data: 'rutdv',
                    title: 'RUT',
                    width: '100px',
                    className: "text-center-datatable"
                },
                {
                    data: 'customer',
                    title: 'Cliente',
                    className: "text-center-datatable",
                    render: function (data:string) {
                        // Renderiza el texto del cliente como texto editable
                        return `<span class="editable-cell">${data}</span>`;
                    },
                }
            ],


            scrollX: true,    // Permite el desplazamiento horizontal
            /* scrollY: '400px',*/     // Ajusta la altura de la tabla si es necesario
            scrollCollapse: true,


            responsive: true,  // Asegura que la tabla se vea bien en dispositivos móviles

        } as any);

        loadTableEvents(table);
    });
})

function loadTableEvents(table: any): void {
    // Manejar evento de clic en el botón de edición
    $("#tblClientes").on("click", ".edit-button", function () {
        const row = $(this).closest("tr");
        const data = table.row(row).data() as Custormer;

        // Cambiar la celda de texto a un input
        const editableCell = row.find(".editable-cell");
        editableCell.html(`<input type="text" class="form-control edit-input" value="${data.customer}" />`);

        // Cambiar el botón a "Guardar"
        $(this).removeClass("edit-button btn-primary").addClass("save-button btn-success");
        $(this).find('i').removeClass("fa-pencil").addClass('fa-save');
    });


    // Manejar evento de clic en el botón de guardar
    $("#tblClientes").on("click", ".save-button", function () {
        const row = $(this).closest("tr");
        const data = table.row(row).data() as Custormer;

        // Obtener el nuevo valor del input
        const newValue = row.find(".edit-input").val()?.toString().trim() || data.customer;

        // Guardar los cambios en el servidor (ejemplo usando fetch)
        fetch(`/api/v1/customer/${data.rut}/name`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rut: data.rut,
                dv: data.dv,
                customer: newValue,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error al guardar");
                return response.json();
            })
            .then(() => {
                // Actualizar el valor en la tabla
                data.customer = newValue;
                table.row(row).data(data).invalidate();

                // Cambiar el botón de nuevo a "Editar"
                $(this).removeClass("save-button btn-success").addClass("edit-button btn-primary");
                $(this).find('i').removeClass("fa-save").addClass('fa-pencil');
            })
            .catch((error) => {
                console.error(error);
                alert("Error al guardar los cambios.");
            });
    });

    const myBtnNew = document.getElementById('btnNew') as HTMLButtonElement;

    if (myBtnNew) {
        myBtnNew.addEventListener('click', () => {

            const modal = document.getElementById('exampleModal') as HTMLElement;
            //const myModal = new Modal(modal);
            //myModal.show();
            var modalOb = $(modal);
            modalOb.modal('show');
         
        });
    }

    const myBtnSaveNewCustomer = document.getElementById('btnSaveCustomer') as HTMLButtonElement;


    if (myBtnSaveNewCustomer) {
        myBtnSaveNewCustomer.addEventListener('click', async (event) => {

            // Evitar el comportamiento predeterminado del botón si es parte de un formulario
            event.preventDefault();

            const form = document.getElementById("customerForm") as HTMLFormElement; // Selecciona el formulario
            if (!form) return; // Verifica que el formulario exista


            if (!form.checkValidity()) {
                form.classList.add("was-validated"); // Aplica las clases de Bootstrap para mostrar errores
                return; // Detiene el proceso si el formulario no es válido
            }

            guardarNuevoCliente().then(newId => {
                console.log(`El ID del nuevo cliente es: ${newId}`);
                reloadCustomerTable();
            });

        });
    }


    $("#tblClientes").on("click", ".del-button", function () {
        const row = $(this).closest("tr");
        const data = table.row(row).data() as Custormer;

        // Obtener el nuevo valor del input
       

        // Guardar los cambios en el servidor (ejemplo usando fetch)
        fetch(`/api/v1/customer/${data.rut}/${data.dv}/down`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
       
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error al eliminar");
                return response.json();
            })
            .then(() => {
                reloadCustomerTable();
            })
            .catch((error) => {
                console.error(error);
                alert("Error al eliminar los cambios.");
            });
    });


    // Asociar el evento al input
    const rutInput = document.getElementById("txtRutCliente");
    if (rutInput) {
        rutInput.addEventListener("keydown", formatRutInput);
    }

    rutInput?.addEventListener("blur", (event: Event) => {
        const input = event.target as HTMLInputElement;
        
        const parts = input.value?.split("-");
        const payload: IRun = {
            run: parts[0], // also can be a number or string without dots
            dv: parts[1] // also can be a number
        };

        const response: Boolean = validateRUN(payload);

        console.log(response);
    })
}



async function obtenerClientes(): Promise<Custormer[]> {
    try {
        const response = await fetch('/api/v1/customer/all');  // Hacemos la solicitud GET
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();  // Convertimos la respuesta a JSON
        if (!Array.isArray(data)) {
            throw new Error("Respuesta inesperada de la API");
        }

        return data.map(item => ({
            customer: item.customer,
            rut: item.rut,
            dv: item.dv,
            rutdv: item.rutdv
        }));  // Devolvemos los datos
    } catch (error) {
        console.error('Error al llamar la API:', error);
        return [];
    }
}

async function guardarNuevoCliente(): Promise<Custormer> {
    // Obtener el nuevo valor del input
    const newRut :any = $('#txtRutCliente').val() ?? '';
    const newValue : any = $('#txtNombreCliente').val() ?? '';
    // row.find(".edit-input").val()?.toString().trim()
    // Guardar los cambios en el servidor (ejemplo usando fetch)
    let defaultCust: Custormer = { rut: 0, dv: "", customer: "", rutdv: '' };
    defaultCust.dv = newRut ? newRut.split('-')[1] : '';

    let res = newRut ? Number((newRut.split('-')[0]).replaceAll('.', '')) : 0;

    defaultCust.rut = newRut ? res: 0;
    defaultCust.customer = newValue?.toString().trim() ?? "";
    fetch(`/api/v1/customer/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultCust),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al guardar");
            return response.json();
        })
        .then((data: Custormer) => {
            $('#txtRutCliente').val('');
            $('#txtNombreCliente').val('');
            return data;
            // Actualizar el valor en la tabla
            //data.customer = newValue;
            //table.row(row).data(data).invalidate();

            //// Cambiar el botón de nuevo a "Editar"
            //$(this).removeClass("save-button btn-success").addClass("edit-button btn-primary");
            //$(this).find('i').removeClass("fa-save").addClass('fa-pencil');
        })
        .catch((error) => {
            console.error(error);
            alert("Error al guardar los cambios.");
        });
    return defaultCust;
}

async function reloadCustomerTable(): Promise<void> {
    const updatedData = await obtenerClientes(); // Llama a la función para obtener los datos actualizados
    const table = $('#tblClientes').DataTable();
    table.clear(); // Limpia los datos actuales de la tabla
    table.rows.add(updatedData); // Agrega las nuevas filas
    table.draw(); // Redibuja la tabla
}


const formatRutInput = (event: KeyboardEvent): void => {


    const input = event.target as HTMLInputElement;

    // Permitir solo números, "K", guion y borrar
    const allowedKeys = /^[0-9kK-]$/;
    const key = event.key;

    // Si el RUT ya tiene un dígito verificador (K o número), no permitir más entradas
    if (input.value.includes("K") || input.value.length >= 12) {
        if (key !== "Backspace" && key !== "Delete" && key !== "Tab") {
            event.preventDefault();
        }
        return;
    }

    // Si el RUT ya contiene "K", no permitir ingresar más "K"
    if (input.value.includes('K') && key.toUpperCase() === "K") {
        event.preventDefault();
        return;
    }

    // Si se presiona "K", debe ser considerado el dígito verificador y no permitir más caracteres
    if (key.toUpperCase() === "K" && input.value.length === 8) {
        setTimeout(() => {
            input.value = formatRut(input.value + "K"); // Agrega "K" y formatea
        }, 0);
        event.preventDefault();
        return;
    }

    // Validar si la tecla presionada es permitida
    if (!allowedKeys.test(key) && key !== "Backspace" && key !== "Delete" && key !== "Tab") {
        event.preventDefault();
        return;
    }

    // Usar timeout para esperar a que el valor se actualice antes de formatear
    setTimeout(() => {
        input.value = formatRut(input.value);
    }, 0);
};

// Función para formatear el RUT
const formatRut = (rut: string): string => {

    // Limpia el RUT, eliminando cualquier carácter que no sea número o 'k'/'K'
    const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();

    // Si ya tiene 9 caracteres, formateamos
    if (cleanRut.length >= 2 ) {
        const body = cleanRut.slice(0, -1); // Cuerpo (8 números)
        const dv = cleanRut.slice(-1);      // Dígito verificador

        // Agregar los puntos cada 3 dígitos al cuerpo
        const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        // Retornar el RUT formateado
        return formattedBody + `-${dv}`;
    }

    // Si no tiene 9 caracteres, solo devolver el RUT limpio
    return cleanRut;
};
