
interface Custormer {
    idcustomer: number,
    customer: string
}

document.addEventListener('DOMContentLoaded', () => {
    obtenerClientes().then(data => {

        var table = $("#tblClientes").DataTable({
            data: data,
            columns: [
                {
                    data: null,
                    title: "",
                    orderable: false,
                    width: '30px',
                    render: function () {
                        // Botón para activar edición
                        return `<button class="btn btn-primary btn-sm edit-button"><i class="fa fa-pencil"></i></button>`;
                    },
                },
                {
                    data: 'idcustomer',
                    title: 'id',
                    width: '70px'
                },
                {
                    data: 'customer',
                    title: 'Cliente',
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
        fetch(`/api/v1/customer/${data.idcustomer}/name`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idcustomer: data.idcustomer,
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
            idcustomer: item.idcustomer,
        }));  // Devolvemos los datos
    } catch (error) {
        console.error('Error al llamar la API:', error);
        return [];
    }
}