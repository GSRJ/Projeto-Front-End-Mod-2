import { getUserData } from "./requests.js";

const userData = document.querySelector(".user-data");

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

  // const editButton = document.querySelector(".edit-button");
  // editButton.addEventListener("click", () => {
}

renderUserData();
