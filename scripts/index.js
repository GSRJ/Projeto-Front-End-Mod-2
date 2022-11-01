import { getCompanies } from "./requests.js";

const companies = await getCompanies();

const sectors = [
  ...new Set(companies.map((company) => company.sectors.description)),
];

function renderSectors() {
  const sectorsContainer = document.querySelector("select");
  sectors.forEach((sector) => {
    const option = document.createElement("option");
    option.value = sector;
    option.textContent = sector;
    sectorsContainer.appendChild(option);
  });
}
renderSectors();

const filteredCompanies = companies.filter((company) => {
  return company.sectors.description === "TI";
});

function renderCompanies(array) {
  const companiesList = document.getElementById("companies-list");
  companiesList.innerHTML = array
    .map(
      (company) => `<li>
    <h1>${company.name}</h1>
    <p>${company.opening_hours}</p>
    <buitton>${company.sectors.description}</buitton>
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

  if (selectedSector === "") {
    renderCompanies(companies);
  }
});
