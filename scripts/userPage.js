import { getUserData } from "./requests.js";
import { getDepartmentInfo } from "./requests.js";
import { getCoworkers } from "./requests.js";
import { userEdit } from "./requests.js";
const userData = document.querySelector(".user-data");
const editUserForm = document.querySelector("form");
const formBox = document.querySelector(".form-box");

async function renderUserData() {
  const data = await getUserData();
  userData.innerHTML = `<div class="all-informations">
        <div class="user-name">
        <h2>${data.username}</h2>
        </div>
        <div class="user-info">
        <p>${data.email}</p>
        <p>${data.professional_level}</p>
        <p>${data.kind_of_work}</p> 
        </div>
        </div>
        <button class="edit-button">Edit</button>
        `;

  const editButton = document.querySelector(".edit-button");
  editButton.addEventListener("click", () => {
    formBox.classList.add("active");
  });
}

renderUserData();

const departmentInfo = document.querySelector(".department-info");

async function renderDepartmentInfo() {
  const data = await getDepartmentInfo();
  if (data === "error") {
    departmentInfo.innerHTML = `<div class="department-name">
        <h2>Department</h2>
        </div>
        <div class="department-info">
        <p>Department not found</p>
        </div>
        `;
  } else {
    departmentInfo.innerHTML = `
            <div class="your-company">
                <h2>${data.name}</h2>
                <h2>${data.departments[0].name}</h2>
            </div>
            `;
  }
}

renderDepartmentInfo();

const coworkers = document.querySelector(".coworkers");

async function renderCoworkers() {
  const data = await getCoworkers();
  console.log(data);

  data[0].users.forEach((coworker) => {
    coworkers.innerHTML += `
            <div class="coworker">
                <h2>${coworker.username}</h2>
                <p>${coworker.professional_level}</p>

            </div>
            `;
  });
}

renderCoworkers();

editUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(editUserForm);
  const user = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const data = await userEdit(user);
  if (data.error) {
    alert(data.error);
  } else {
    alert("User edited successfully");
    window.location.reload();
  }
});
