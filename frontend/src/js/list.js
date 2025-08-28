const search = document.querySelectorAll("#searchUser");

let searchTimeout;

async function getUsers() {
  try {
    const request = await fetch("http://localhost:7000/api/users");
    const users = await request.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [] };
  }
}

async function searchUsers(query) {
  try {
    const request = await fetch(
      `http://localhost:7000/api/users?search=${query}`
    );
    const users = await request.json();
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return { users: [] };
  }
}

function debounceSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (query.trim() === "") {
      getUsers().then((data) => {
        if (data.users?.length > 0) {
          addUsersToHtml(data.users);
        } else {
          showEmptyState();
        }
      });
    } else {
      searchUsers(query).then((data) => {
        if (data.users?.length > 0) {
          addUsersToHtml(data.users);
        } else {
          showEmptyState();
        }
      });
    }
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#searchUser");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value;
      debounceSearch(query);
    });
  }

  getUsers().then((data) => {
    if (data.users?.length > 0) {
      addUsersToHtml(data.users);
    } else {
      showEmptyState();
    }
  });
});

function addUsersToHtml(users) {
  const usersContainer = document.querySelector("#tablaAlumnos");
  usersContainer.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-800 transition-colors duration-150";
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${
        user.name || ""
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${
        user.lastName || ""
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${
        user.countryId || ""
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${
        user.phone || ""
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${
        user.emergencyPhone || ""
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-200">
          ${user.expirement || "N/A"}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${
        user.debtType || ""
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button class="text-gym-blue hover:text-gym-accent transition-colors duration-200" onclick="editUser('${
          user.id || ""
        }')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button class="text-red-400 hover:text-red-300 transition-colors duration-200" onclick="deleteUser('${
          user.id || ""
        }')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </td>
    `;

    usersContainer.appendChild(tr);
  });
}

function editUser(userId) {
  window.location.href = "edit-user.html?id=" + userId;
}

function showEmptyState() {
  const usersContainer = document.querySelector("#tablaAlumnos");
  const emptyState = document.querySelector("#emptyState");

  usersContainer.innerHTML = "";
  emptyState.classList.remove("hidden");
}

async function deleteUser(userId) {
  try {
    const request = await fetch(`http://localhost:7000/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const deleteUser = await request.json();
    return deleteUser;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [] };
  }
}
