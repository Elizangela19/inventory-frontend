document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:5000/api/products";

    const loadProducts = () => {
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                const apiDataDiv = document.getElementById("apiData");
                apiDataDiv.innerHTML = "";

                const tabla = document.createElement("table");
                tabla.className = "table table-striped";

                const thead = document.createElement("thead");
                thead.innerHTML = `
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                `;

                const tbody = document.createElement("tbody");
                data.forEach((producto) => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${producto.name}</td>
                            <td>${producto.description}</td>
                            <td>${producto.quantity}</td>
                            <td>${producto.price}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${producto._id}" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${producto._id}" data-bs-toggle="modal" data-bs-target="#deleteModal">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });

                tabla.appendChild(thead);
                tabla.appendChild(tbody);
                apiDataDiv.appendChild(tabla);

                // Asignar eventos a los botones
                document.querySelectorAll(".edit-btn").forEach((btn) => {
                    btn.addEventListener("click", (e) => openEditModal(e.target.dataset.id));
                });
                document.querySelectorAll(".delete-btn").forEach((btn) => {
                    btn.addEventListener("click", (e) => openDeleteModal(e.target.dataset.id));
                });
            })
            .catch((error) => console.error("Error al cargar los productos:", error));
    };

    const openEditModal = (id) => {
        fetch(`${apiUrl}/${id}`)
            .then((response) => response.json())
            .then((product) => {
                if (product) {
                    document.getElementById("editProductId").value = product._id || "";
                    document.getElementById("editProductName").value = product.name || "";
                    document.getElementById("editProductDescription").value = product.description || "";
                    document.getElementById("editProductQuantity").value = product.quantity || 0;
                    document.getElementById("editProductPrice").value = product.price || 0.0;
                }
            });
    };

    const openDeleteModal = (id) => {
        if (id) {
            document.getElementById("deleteProductId").value = id;
        }
    };

    document.getElementById("editProductForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("editProductId").value;
        const updatedProduct = {
            name: document.getElementById("editProductName").value,
            description: document.getElementById("editProductDescription").value,
            quantity: parseInt(document.getElementById("editProductQuantity").value, 10),
            price: parseFloat(document.getElementById("editProductPrice").value),
        };

        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => response.json())
            .then(() => {
                bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
                loadProducts();
            });
    });

    document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
        const id = document.getElementById("deleteProductId").value;

        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then(() => {
                bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
                loadProducts();
            });
    });

    document.getElementById("addProductForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const newProduct = {
            name: document.getElementById("addProductName").value,
            description: document.getElementById("addProductDescription").value,
            quantity: parseInt(document.getElementById("addProductQuantity").value, 10),
            price: parseFloat(document.getElementById("addProductPrice").value),
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                return response.json();
            })
            .then(() => {
                bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
                document.getElementById("addProductForm").reset();
                loadProducts();
            })
            .catch((error) => console.error("Error al agregar producto:", error));
    });

    loadProducts();
});
