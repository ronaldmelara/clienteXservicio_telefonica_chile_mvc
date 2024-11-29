

/// <reference path="./interfaces.ts" />     

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
            const myModal = new bootstrap.Modal(modal);
            myModal.show();
         
        });
    }

    const myBtnSaveNewCustomer = document.getElementById('btnSaveCustomer') as HTMLButtonElement;


    if (myBtnSaveNewCustomer) {
        myBtnSaveNewCustomer.addEventListener('click', () => {

            guardarNuevoCliente().then(newId => {
                console.log(`El ID del nuevo cliente es: ${newId}`);
                reloadCustomerTable();
            });
            //addService(selectedSuggestion).then(newId => {
            //    console.log(`El ID del nuevo servicio es: ${newId}`);
            //}).catch(error => {
            //    console.error('Error al agregar el servicio:', error);
            //});
        });
    }


    $("#tblClientes").on("click", ".del-button", function () {
        const row = $(this).closest("tr");
        const data = table.row(row).data() as Custormer;

        // Obtener el nuevo valor del input
       

        // Guardar los cambios en el servidor (ejemplo usando fetch)
        fetch(`/api/v1/customer/${data.rut}/down`, {
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
    const newValue = document.getElementById('txtCliente') as HTMLInputElement;
    // row.find(".edit-input").val()?.toString().trim()
    // Guardar los cambios en el servidor (ejemplo usando fetch)
    let defaultCust: Custormer = { rut: 0, dv: "", customer: "", rutdv : '' };
    defaultCust.customer = $(newValue).val()?.toString().trim() ?? "";
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