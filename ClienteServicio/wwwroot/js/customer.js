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
document.addEventListener('DOMContentLoaded', () => {
    obtenerClientes().then(data => {
        var table = $("#tblClientes").DataTable({
            data: data,
            columns: [
                {
                    data: null,
                    title: "",
                    orderable: false,
                    width: '69px',
                    render: function () {
                        // Bot�n para activar edici�n
                        return `<button class="btn btn-primary btn-sm edit-button"><i class="fa fa-pencil"></i></button>
                        <button class="btn btn-danger btn-sm del-button"><i class="fa fa-trash"></i></button>`;
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
                    render: function (data) {
                        // Renderiza el texto del cliente como texto editable
                        return `<span class="editable-cell">${data}</span>`;
                    },
                }
            ],
            scrollX: true,
            /* scrollY: '400px',*/ // Ajusta la altura de la tabla si es necesario
            scrollCollapse: true,
            responsive: true, // Asegura que la tabla se vea bien en dispositivos m�viles
        });
        loadTableEvents(table);
    });
});
function loadTableEvents(table) {
    // Manejar evento de clic en el bot�n de edici�n
    $("#tblClientes").on("click", ".edit-button", function () {
        const row = $(this).closest("tr");
        const data = table.row(row).data();
        // Cambiar la celda de texto a un input
        const editableCell = row.find(".editable-cell");
        editableCell.html(`<input type="text" class="form-control edit-input" value="${data.customer}" />`);
        // Cambiar el bot�n a "Guardar"
        $(this).removeClass("edit-button btn-primary").addClass("save-button btn-success");
        $(this).find('i').removeClass("fa-pencil").addClass('fa-save');
    });
    // Manejar evento de clic en el bot�n de guardar
    $("#tblClientes").on("click", ".save-button", function () {
        var _a;
        const row = $(this).closest("tr");
        const data = table.row(row).data();
        // Obtener el nuevo valor del input
        const newValue = ((_a = row.find(".edit-input").val()) === null || _a === void 0 ? void 0 : _a.toString().trim()) || data.customer;
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
            if (!response.ok)
                throw new Error("Error al guardar");
            return response.json();
        })
            .then(() => {
            // Actualizar el valor en la tabla
            data.customer = newValue;
            table.row(row).data(data).invalidate();
            // Cambiar el bot�n de nuevo a "Editar"
            $(this).removeClass("save-button btn-success").addClass("edit-button btn-primary");
            $(this).find('i').removeClass("fa-save").addClass('fa-pencil');
        })
            .catch((error) => {
            console.error(error);
            alert("Error al guardar los cambios.");
        });
    });
    const myBtnNew = document.getElementById('btnNew');
    if (myBtnNew) {
        myBtnNew.addEventListener('click', () => {
            const modal = document.getElementById('exampleModal');
            const myModal = new bootstrap.Modal(modal);
            myModal.show();
        });
    }
    const myBtnSaveNewCustomer = document.getElementById('btnSaveCustomer');
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
        const data = table.row(row).data();
        // Obtener el nuevo valor del input
        // Guardar los cambios en el servidor (ejemplo usando fetch)
        fetch(`/api/v1/customer/${data.idcustomer}/down`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
            if (!response.ok)
                throw new Error("Error al eliminar");
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
function obtenerClientes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/v1/customer/all'); // Hacemos la solicitud GET
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = yield response.json(); // Convertimos la respuesta a JSON
            if (!Array.isArray(data)) {
                throw new Error("Respuesta inesperada de la API");
            }
            return data.map(item => ({
                customer: item.customer,
                idcustomer: item.idcustomer,
            })); // Devolvemos los datos
        }
        catch (error) {
            console.error('Error al llamar la API:', error);
            return [];
        }
    });
}
function guardarNuevoCliente() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Obtener el nuevo valor del input
        const newValue = document.getElementById('txtCliente');
        // row.find(".edit-input").val()?.toString().trim()
        // Guardar los cambios en el servidor (ejemplo usando fetch)
        let defaultCust = { idcustomer: 0, customer: "" };
        defaultCust.customer = (_b = (_a = $(newValue).val()) === null || _a === void 0 ? void 0 : _a.toString().trim()) !== null && _b !== void 0 ? _b : "";
        fetch(`/api/v1/customer/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(defaultCust),
        })
            .then((response) => {
            if (!response.ok)
                throw new Error("Error al guardar");
            return response.json();
        })
            .then((data) => {
            return data;
            // Actualizar el valor en la tabla
            //data.customer = newValue;
            //table.row(row).data(data).invalidate();
            //// Cambiar el bot�n de nuevo a "Editar"
            //$(this).removeClass("save-button btn-success").addClass("edit-button btn-primary");
            //$(this).find('i').removeClass("fa-save").addClass('fa-pencil');
        })
            .catch((error) => {
            console.error(error);
            alert("Error al guardar los cambios.");
        });
        return defaultCust;
    });
}
function reloadCustomerTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedData = yield obtenerAreas(); // Llama a la funci�n para obtener los datos actualizados
        const table = $('#tblClientes').DataTable();
        table.clear(); // Limpia los datos actuales de la tabla
        table.rows.add(updatedData); // Agrega las nuevas filas
        table.draw(); // Redibuja la tabla
    });
}
