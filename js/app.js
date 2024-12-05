document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:5000/api/products"; // URL de la API Backend

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const apiDataDiv = document.getElementById("apiData");

            // Limpiar el contenido del div antes de agregar nuevos datos
            apiDataDiv.innerHTML = "";

            // Crear la tabla
            const tabla = document.createElement("table");

            // Crear el thead
            const thead = document.createElement("thead");

            // Añadir clase a la tabla
            tabla.className = "table table-striped";

            // Crear el contenido del thead
            thead.innerHTML = `
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            `;

            // Añadir el thead a la tabla
            tabla.appendChild(thead);

            // Crear el tbody
            const tbody = document.createElement("tbody");
            data.forEach(producto => {
                tbody.innerHTML += `
                    <tr>
                        <td>${producto.name}</td>
                        <td>${producto.description}</td>
                        <td>${producto.quantity}</td>
                        <td>${producto.price}</td>
                    </tr>
                `;
            });

            tabla.appendChild(tbody);
            apiDataDiv.appendChild(tabla);
        })
        .catch((error) => {
            console.error("Error al obtener datos de la API:", error);
        });
});
