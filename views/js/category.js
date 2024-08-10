const apiUrl = "http://localhost:5000/api/v1/categories";

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loadCategoriesBtn")
    .addEventListener("click", loadCategories);

  document
    .getElementById("createCategoryBtn")
    .addEventListener("click", createCategory);
  document
    .getElementById("updateCategoryBtn")
    .addEventListener("click", updateCategory);
  if (localStorage.getItem("token")) {
    document.getElementById("logoutBtn").style.display = "inline-block";
  }
});

async function loadCategories() {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your token if required
    },
  });
  const data = await response.json();

  if (data.status === "success") {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";

    data.data.forEach((category) => {
      const li = document.createElement("li");
      li.innerHTML = `
			<strong>${category._id}</strong>
			<br>
            <strong>${category.name}</strong>
			<br>
			<strong>${category.type}</strong>
			<br>
            <button onclick="editCategory('${category._id}')">Edit</button>
            <button onclick="deleteCategory('${category._id}')">Delete</button>
			<p style="cursor: pointer; color: blue;" onclick="fetchSubcategories('${category._id}')">Click to see subcategories</p>
        `;
      categoryList.appendChild(li);
    });
  } else {
    alert(
      "Failed to load categories: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function createCategory() {
  const name = document.getElementById("categoryName").value;
  const type = document.getElementById("categoryType").value;
  const token = localStorage.getItem("token");
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add your token if required
    },
    body: JSON.stringify({ name, type }),
  });

  const data = await response.json();
  if (data.status === "success") {
    loadCategories();
    document.getElementById("categoryName").value = "";
    document.getElementById("categoryType").value = "";
  } else {
    alert(
      "Failed to create category: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function editCategory(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Add your token if required
    },
  });
  const data = await response.json();

  if (data.status === "success") {
    const category = data.data;
    document.getElementById("updateCategoryName").value = category.name;
    document.getElementById("updateCategoryType").value = category.type;

    document.getElementById("updateCategoryBtn").dataset.id = id;
    document.getElementById("categoryForm").style.display = "none";
    document.getElementById("categoryUpdateForm").style.display = "block";
  }
}

async function updateCategory() {
  const id = document.getElementById("updateCategoryBtn").dataset.id;
  const name = document.getElementById("updateCategoryName").value;
  const type = document.getElementById("updateCategoryType").value;

  const response = await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your token if required
    },
    body: JSON.stringify({ name, type }),
  });

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("categoryForm").style.display = "block";
    document.getElementById("categoryUpdateForm").style.display = "none";
    loadCategories();
  } else {
    alert(
      "Failed to update category: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function deleteCategory(id) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your token if required
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    loadCategories();
  } else {
    alert(
      "Failed to delete category: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function fetchSubcategories(categoryId) {
  try {
    const response = await fetch(`${apiUrl}/${categoryId}/level2`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Error fetching subcategories");

    const data = await response.json();
    const subcategoriesList = document.getElementById("subcategoriesList");
    subcategoriesList.innerHTML = ""; // Clear existing list

    data.data.forEach((subcategory) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
	  	  <strong>${subcategory._id}</strong>
		  <br>
		  <strong>${subcategory.name}</strong>
		  <br>
		  <button onclick="editSubcategory('${categoryId}', '${subcategory._id}')">Edit</button>
		  <button onclick="deleteSubcategory('${categoryId}', '${subcategory._id}')">Delete</button>
		  <p style="cursor: pointer; color: blue;" onclick="fetchSubSubcategories('${categoryId}', '${subcategory._id}')">View sub-subcategories</p> 
	  `;

      subcategoriesList.appendChild(listItem);
    });

    document.getElementById("subcategoriesSection").style.display = "block";
    document.getElementById("subSubcategoriesSection").style.display = "none";
    document
      .getElementById("addSubcategoryBtn")
      .addEventListener("click", createSubcategory.bind(null, categoryId));
  } catch (error) {
    console.error(error);
    alert("Failed to fetch subcategories.");
  }
}

async function fetchSubSubcategories(categoryId, subCategoryId) {
  try {
    const response = await fetch(
      `${apiUrl}/${categoryId}/level2/${subCategoryId}/level3`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) throw new Error("Error fetching subSubCategories");

    const data = await response.json();
    const subSubcategoriesList = document.getElementById(
      "subSubcategoriesList"
    );
    subSubcategoriesList.innerHTML = ""; // Clear existing list

    data.data.forEach((subSubcategory) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
	  <strong>${subSubcategory._id}</strong>
	  <br>
	  <strong>${subSubcategory.name}</strong>
	  <br>
	  <button onclick="deleteSubSubcategory('${categoryId}', '${subCategoryId}', '${subSubcategory._id}')">Delete</button>
	  <button onclick="editSubSubcategory('${categoryId}', '${subCategoryId}', '${subSubcategory._id}')">Update</button>
	  `;
      subSubcategoriesList.appendChild(listItem);
    });

    document.getElementById("subSubcategoriesSection").style.display = "block";

    document
      .getElementById("addSubSubcategoryBtn")
      .addEventListener(
        "click",
        createSubSubcategory.bind(null, categoryId, subCategoryId)
      );
  } catch (error) {
    console.error(error);
    alert("Failed to fetch subSubCategories.");
  }
}
async function createSubcategory(categoryId) {
  try {
    const subcategoryName = document.getElementById("subCategoryName").value;
    const response = await fetch(`${apiUrl}/${categoryId}/level2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: subcategoryName }),
    });

    if (!response.ok) throw new Error("Error creating subcategory");

    const data = await response.json();
    if (data.status === "success") {
      alert("Subcategory created successfully");
      fetchSubcategories(categoryId); // Refresh subcategories
    } else {
      alert(
        "Failed to create subcategory: " + data["Error Message"] ||
          data["Array of errors about validation"][0]["msg"]
      );
    }
  } catch (error) {
    console.error(error);
    alert("Failed to create subcategory.");
  }
}

async function createSubSubcategory(categoryId, subCategoryId) {
  try {
    const subSubcategoryName =
      document.getElementById("subSubCategoryName").value;
    const response = await fetch(
      `${apiUrl}/${categoryId}/level2/${subCategoryId}/level3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: subSubcategoryName }),
      }
    );

    if (!response.ok) throw new Error("Error creating subSubcategory");

    const data = await response.json();
    if (data.status === "success") {
      alert("SubSubCategory created successfully");
      fetchSubSubcategories(categoryId, subCategoryId); // Refresh subSubCategories
    } else {
      alert(
        "Failed to create subSubcategory: " + data["Error Message"] ||
          data["Array of errors about validation"][0]["msg"]
      );
    }
  } catch (error) {
    console.error(error);
    alert("Failed to create subSubcategory.");
  }
}

async function deleteSubcategory(categoryId, subCategoryId) {
  try {
    const response = await fetch(
      `${apiUrl}/${categoryId}/level2/${subCategoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      alert("Subcategory deleted successfully");
      fetchSubcategories(categoryId); // Refresh subcategories
    } else {
      alert(
        "Failed to delete subcategory: " + data["Error Message"] ||
          data["Array of errors about validation"][0]["msg"]
      );
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete subcategory.");
  }
}

async function deleteSubSubcategory(
  categoryId,
  subCategoryId,
  subSubcategoryId
) {
  try {
    const response = await fetch(
      `${apiUrl}/${categoryId}/level2/${subCategoryId}/level3/${subSubcategoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      alert("SubSubcategory deleted successfully");
      fetchSubSubcategories(categoryId, subCategoryId); // Refresh subSubCategories
    } else {
      alert(
        "Failed to delete subSubcategory: " + data["Error Message"] ||
          data["Array of errors about validation"][0]["msg"]
      );
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete subSubcategory.");
  }
}

async function editSubcategory(categoryId, subCategoryId) {
  const response = await fetch(
    `${apiUrl}/${categoryId}/level2/${subCategoryId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) throw new Error("Error editing subcategory");

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("subCategoryForm").style.display = "none";
    document.getElementById("subCategoryUpdateForm").style.display = "block";
    document.getElementById("updateSubcategoryName").value = data.data.name;
    document
      .getElementById("updateSubcategoryBtn")
      .addEventListener(
        "click",
        updateSubcategory.bind(null, categoryId, subCategoryId)
      );
  } else {
    alert(
      "Failed to edit subcategory: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function updateSubcategory(categoryId, subCategoryId) {
  const subcategoryName = document.getElementById(
    "updateSubcategoryName"
  ).value;
  const response = await fetch(
    `${apiUrl}/${categoryId}/level2/${subCategoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: subcategoryName }),
    }
  );

  if (!response.ok) throw new Error("Error updating subcategory");

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("subCategoryForm").style.display = "block";
    document.getElementById("subCategoryUpdateForm").style.display = "none";
    alert("Subcategory updated successfully");
    fetchSubcategories(categoryId); // Refresh subcategories
  } else {
    alert(
      "Failed to update subcategory: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function editSubSubcategory(categoryId, subCategoryId, subSubcategoryId) {
  const response = await fetch(
    `${apiUrl}/${categoryId}/level2/${subCategoryId}/level3/${subSubcategoryId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) throw new Error("Error editing subSubcategory");

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("subSubcategoryForm").style.display = "none";
    document.getElementById("subSubcategoryUpdateForm").style.display = "block";
    document.getElementById("updatesubSubcategoryName").value = data.data.name;
    document
      .getElementById("updateSubSubcategoryBtn")
      .addEventListener(
        "click",
        updateSubSubcategory.bind(
          null,
          categoryId,
          subCategoryId,
          subSubcategoryId
        )
      );
  } else {
    alert(
      "Failed to edit subSubcategory: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function updateSubSubcategory(
  categoryId,
  subCategoryId,
  subSubcategoryId
) {
  const subSubcategoryName = document.getElementById(
    "updatesubSubcategoryName"
  ).value;
  const response = await fetch(
    `${apiUrl}/${categoryId}/level2/${subCategoryId}/level3/${subSubcategoryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: subSubcategoryName }),
    }
  );

  if (!response.ok) throw new Error("Error updating subSubcategory");

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("subSubcategoryForm").style.display = "block";
    document.getElementById("subSubcategoryUpdateForm").style.display = "none";
    alert("SubSubcategory updated successfully");
    fetchSubSubcategories(categoryId, subCategoryId); // Refresh subSubCategories
  } else {
    alert(
      "Failed to update subSubcategory: " + data["Error Message"] ||
        data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  alert("Logout successful");
  window.location.reload();
}
