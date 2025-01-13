const url ="https://678502fa1ec630ca33a6c7d5.mockapi.io/products";

const container = document.getElementById("product-container");

const fetchProducts = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = "";
        data.slice(0, 20).forEach((product) => createProductCard(product));
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const createProductCard = (product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", product.id);

    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button class="update-btn">Update</button>
        <button class="delete-btn">Delete</button>`;

    card.querySelector(".update-btn").addEventListener("click", () => handleUpdate(product.id));
    card.querySelector(".delete-btn").addEventListener("click", () => handleDelete(product.id));

    container.appendChild(card);
};

const handleAdd = async () => {
    const newProduct = {
        title: "New Product",
        price: 20.99,
        description: "This is a newly added product.",
        image: "https://via.placeholder.com/150"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });
        const data = await response.json();
        createProductCard(data);
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

const handleUpdate = async (id) => {
    const newTitle = prompt("Enter the new title:");
    if (!newTitle) return;

    try {
        const response = await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
        });
        const data = await response.json();

        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if (card) card.querySelector("h3").textContent = data.title;
    } catch (error) {
        console.error("Error updating product:", error);
    }
};

const handleDelete = async (id) => {
    try {
        await fetch(`${url}/${id}`, { method: "DELETE" });

        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if (card) container.removeChild(card);
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};

document.getElementById("add-product-btn").addEventListener("click", handleAdd);

fetchProducts();