import { getCompanies } from "./requests.js";

const companies = await getCompanies();

const sectors = [
  ...new Set(companies.map((company) => company.sectors.description)),
];

function renderSectors() {
  const sectorsContainer = document.querySelector("select");
  sectorsContainer.insertAdjacentHTML(
    "beforeend",
    `<option value="companies">Selecionar Setor</option>`
  );
  sectors.forEach((sector) => {
    sectorsContainer.insertAdjacentHTML(
      "beforeend",
      `<option value="${sector}">${sector}</option>`
    );
  });
}

renderSectors();

function renderCompanies(array) {
  const companiesList = document.getElementById("companies-list");
  companiesList.innerHTML = array
    .map(
      (company) => `<li>
    <h1>${company.name}</h1>
    <div>
    <p>${company.opening_hours}</p>
    <button>${company.sectors.description}</button>
    </div>
    </li>`
    )
    .join("");
}

renderCompanies(companies);

const selectedSector = document.querySelector("select");
selectedSector.addEventListener("change", (event) => {
  const selectedSector = event.target.value;
  const filteredCompanies = companies.filter(
    (company) => company.sectors.description === selectedSector
  );
  renderCompanies(filteredCompanies);
  if (selectedSector === "companies") {
    renderCompanies(companies);
  }
});

const toLoginButton = document.querySelectorAll(".to-login");
const toRegisterButton = document.querySelectorAll(".to-register");

toLoginButton.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "./pages/login.html";
  });
});

toRegisterButton.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "./pages/register.html";
  });
});

const menuButton = document.querySelector(".menu");

const headerbutton = document.querySelector(".buttons");

menuButton.addEventListener("mouseenter", () => {
  headerbutton.classList.add("active");
});

headerbutton.addEventListener("mouseleave", () => {
  headerbutton.classList.remove("active");
});
