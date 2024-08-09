const apiUrl = "http://localhost:5000/api/v1";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadCategories();

  document
    .getElementById("createProductBtn")
    .addEventListener("click", createProduct);
  document
    .getElementById("updateProductBtn")
    .addEventListener("click", updateProduct);
  document
    .getElementById("loadWishlistBtn")
    .addEventListener("click", loadWishlist);
  if (localStorage.getItem("token")) {
    document.getElementById("logoutBtn").style.display = "block";
  }
});

async function loadProducts() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.status === "success") {
    const products = document.getElementById("productList");
    products.innerHTML = "";
    data.data.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
			<strong>Title: ${product.title}</strong>
			<br>
			${
        product.description
          ? `<strong>Description: ${product.description}</strong>`
          : ""
      }
			<br>
			${product.price ? `<strong>Price: ${product.price}</strong>` : ""}
			<br>
			${
        product.subcategory
          ? `<strong>Subcategory: ${product.subcategory.name}</strong>`
          : ""
      }
			<br>
			${product.category ? `<strong>Category: ${product.category.name}</strong>` : ""}
			<br>
			<button onclick="deleteProduct('${product._id}')">Remove</button>
			<button onclick="editProduct('${product._id}')">Edit</button>
			<button onclick="addToWishlist('${product._id}')">Add to wishlist</button>
		`;
      products.appendChild(li);
    });
  } else {
    alert(
      "Failed to load products: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function loadCategoriesForEdit() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.status === "success") {
    const categorySelect = document.getElementById("updateCategory");
    categorySelect.innerHTML = ""; // Clear existing options
    data.data.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } else {
    alert(
      "Failed to load categories: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function loadCategories() {
  // Fetch available categories
  let token = localStorage.getItem("token");
  const categoryResponse = await fetch(`${apiUrl}/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const categoriesData = await categoryResponse.json();
  if (categoryResponse.ok && categoriesData.status === "success") {
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = ""; // Clear existing options
    categoriesData.data.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } else {
    throw new Error("Failed to load categories");
  }
}

async function createProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const quantity = document.getElementById("quantity").value;

  const token = localStorage.getItem("token");
  // Create the product
  const response = await fetch(`${apiUrl}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      price,
      category,
      description,
      quantity,
    }),
  });

  const data = await response.json();
  if (data.status === "success") {
    await loadProducts(); // Assuming this function refreshes the product list
    alert("Product created successfully");
  } else {
    alert(
      `Error: ${
        data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
      }`
    );
  }
}

async function editProduct(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.status === "success") {
    loadCategoriesForEdit();
    document.getElementById("productForm").style.display = "none";
    document.getElementById("productUpdateForm").style.display = "block";
    document.getElementById("updateProductBtn").dataset.id = id;
    document.getElementById("updateTitle").value = data.data.title;
    document.getElementById("updatePrice").value = data.data.price;
    document.getElementById("updateDescription").value = data.data.description;
    document.getElementById("updateQuantity").value = data.data.quantity;
    document.getElementById("updateCategory").value = data.data.category.name;
  } else {
    alert(
      `Error: ${
        data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
      }`
    );
  }
}

async function updateProduct() {
  const id = document.getElementById("updateProductBtn").dataset.id;
  const title = document.getElementById("updateTitle").value;
  const price = document.getElementById("updatePrice").value;
  const description = document.getElementById("updateDescription").value;
  const quantity = document.getElementById("updateQuantity").value;
  const category = document.getElementById("updateCategory").value;

  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      price,
      description,
      quantity,
      category,
    }),
  });

  const data = await response.json();
  if (data.status === "success") {
    await loadProducts();
    document.getElementById("productForm").style.display = "block";
    document.getElementById("productUpdateForm").style.display = "none";
    alert("Product updated successfully");
  } else {
    alert(
      `Error: ${
        data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
      }`
    );
  }
}

async function deleteProduct(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    await loadProducts();
  }
}

async function loadWishlist() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${apiUrl}/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (data.status === "success") {
      document.getElementById(
        "wishlistCount"
      ).textContent = `Number of Products: ${data["WishList Number of Products"]}`;

      const wishlist = document.getElementById("wishlist");
      wishlist.innerHTML = ""; // Clear any existing items

      data["Your Wishlist"].forEach((product) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${product.title}</strong> - ${product.price} <button onclick="removeFromWishlist('${product._id}')">Remove</button>`;
        wishlist.appendChild(li);
      });
    } else {
      alert(`Error: ${data["Error Message"]}`);
    }
  } catch (error) {
    console.error("Error loading wishlist:", error);
    alert("Failed to load wishlist. Please try again.");
  }
}

async function addToWishlist(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/wishlist/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    await loadWishlist();
  } else {
    alert(
      `Error: ${
        data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
      }`
    );
  }
}

async function removeFromWishlist(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/wishlist/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    await loadWishlist();
  } else {
    alert(
      `Error: ${
        data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
      }`
    );
  }
}

async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  alert("Logout successful");
}
