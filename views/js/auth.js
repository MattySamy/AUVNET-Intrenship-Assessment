const apiUrl = "http://localhost:5000/api/v1";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupBtn").addEventListener("click", signUp);
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("loadUsersBtn").addEventListener("click", loadUsers);
  document
    .getElementById("createUserBtn")
    .addEventListener("click", createUser);
  document
    .getElementById("loadAdminsBtn")
    .addEventListener("click", loadAdmins);
  if (localStorage.getItem("token")) {
    document.getElementById("logoutBtn").style.display = "block";
  }
});

async function signUp() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const username = document.getElementById("signupUsername").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  const response = await fetch(`${apiUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, username, passwordConfirm }),
  });

  const data = await response.json();
  console.log(data);
  if (data.status === "success") {
    alert("Sign up successful");
    loadUsers();
  } else {
    alert(
      "Sign up failed: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (data.status === "success") {
    if (localStorage.getItem("token")) {
      alert("Already logged in");
      loadUsers();
      loadAdmins();
      window.location.reload();
    } else {
      localStorage.setItem("token", data["JWT Token"]);
      localStorage.setItem("refreshToken", data.refreshToken);
      alert("Login successful");
      loadUsers();
      loadAdmins();
      window.location.reload();
    }
  } else {
    alert(
      "Login failed: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}

const deleteUser = async function (id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    loadUsers();
    loadAdmins();
  } else {
    alert(
      "Failed to delete user: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
};

async function loadUsers() {
  const limit = +document.getElementById("limit").value;
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/users?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.status === "success") {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    data.data.forEach((user) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <strong>${user.username}</strong> - ${user.email}
                <button onclick="deleteUser('${user._id}')">Delete</button>
            `;
      userList.appendChild(li);
    });
  } else {
    alert(
      "Failed to load users: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}
async function loadAdmins() {
  const limit = +document.getElementById("limitAdmin").value;
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/users/admins?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.status === "success") {
    const adminList = document.getElementById("adminList");
    adminList.innerHTML = "";
    data.data.forEach((admin) => {
      const li = document.createElement("li");
      li.innerHTML = `
				<strong>${admin.username}</strong> - ${admin.email}
				<button onclick="deleteUser('${admin._id}')">Delete</button>
			`;
      adminList.appendChild(li);
    });
  } else {
    alert(
      "Failed to load admins: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function createUser() {
  const username = document.getElementById("createUsername").value;
  const email = document.getElementById("createEmail").value;
  const password = document.getElementById("createPassword").value;
  const passwordConfirm = document.getElementById(
    "createConfirmPassword"
  ).value;
  const role = document.getElementById("createRole").value;

  const token = localStorage.getItem("token");
  const response = await fetch(`${apiUrl}/users/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, email, password, passwordConfirm, role }),
  });

  const data = await response.json();
  if (data.status === "success") {
    if (role === "admin") {
      loadAdmins();
    }
    loadUsers();
    alert("User created successfully");
  } else {
    alert(
      "Failed to create user: " + data["Error Message"]
        ? data["Error Message"]
        : data["Array of errors about validation"][0]["msg"]
    );
  }
}

async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  alert("Logout successful");
  window.location.reload();
}
