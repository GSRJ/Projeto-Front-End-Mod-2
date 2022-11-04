import { getDepartments } from "./requests.js";
import { getCompanies } from "./requests.js";
import { getWorkers } from "./requests.js";
import { getWorkersWithoutDepartment } from "./requests.js";
import { createDepartment } from "./requests.js";
import { editDepartment } from "./requests.js";

const companies = await getCompanies();
console.log("companies", companies);

const companiesNames = companies.map((company) => company.name);
const uniqueCompaniesNames = [...new Set(companiesNames)];
console.log("uniqueCompaniesNames", uniqueCompaniesNames);
const departments = await getDepartments();
console.log("departments", departments);
const workers = await getWorkers();
console.log("workers", workers);
const workersIndepartments = workers.filter((worker) => {
  return worker.department_uuid !== null;
});
console.log("workersIndepartments", workersIndepartments);

function renderCompanies() {
  const companiesContainer = document.querySelector("#companies-container");
  companiesContainer.insertAdjacentHTML(
    "beforeend",
    `<option value="todas">Todas</option>`
  );
  const companiesWhitDepartments = departments.map((department) => {
    return department.companies.name;
  });
  console.log("companiesWhitDepartments", companiesWhitDepartments);
  const uniqueCompaniesWhitDepartments = [...new Set(companiesWhitDepartments)];
  console.log("uniqueCompaniesWhitDepartments", uniqueCompaniesWhitDepartments);

  uniqueCompaniesNames.forEach((company) => {
    companiesContainer.insertAdjacentHTML(
      "beforeend",
      `<option value="${company}">${company}</option>`
    );
  });
}
renderCompanies();

const selectedCompany = document.querySelector("#companies-container");
selectedCompany.addEventListener("change", (event) => {
  const selectedCompany = event.target.value;
  const filteredDepartments = departments.filter(
    (department) => department.companies.name === selectedCompany
  );
  console.log("filteredDepartments", filteredDepartments);
  const filteredWorkers = workersIndepartments.filter((worker) => {
    return filteredDepartments.some(
      (department) => department.uuid === worker.department_uuid
    );
  });
  console.log("selectedCompany", selectedCompany);
  console.log("filteredWorkers", filteredWorkers);
  if (selectedCompany === "todas") {
    renderDepartments(departments);
    renderWorkers(workersIndepartments);
  } else {
    renderDepartments(filteredDepartments);
    renderWorkers(filteredWorkers, selectedCompany);
  }
});

function renderDepartments(array) {
  const departmentsList = document.getElementById("departments-list");
  departmentsList.innerHTML = array
    .map(
      (department) => `<li>
      <div class="department-data">
        <h1>${department.name}</h1>
        <p>${department.description}</p>
        <p>${department.companies.name}</p>
      </div>
        <div class="department-buttons">
        <button id="${department.uuid}class="view-department">Ver</button>
        <button id="${department.uuid}"class="edit-department">Editar</button>
        <button id=""${department.uuid}"class="delete-department">Deletar</button>
        </div>
        </li>`
    )
    .join("");

  const editDepartmentButtons = document.querySelectorAll(".edit-department");
  editDepartmentButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const editModal = document.querySelector(".edit-modal");
      editModal.classList.add("active");
      const departmentUuid = event.target.id;
      const departmentDescription =
        button.parentElement.parentElement.children[0].children[1].innerText;

      console.log("departmentDescription", departmentDescription);

      console.log("departmentUuid", departmentUuid);
      modalEditContent(departmentUuid, departmentDescription);
    });
  });
}
renderDepartments(departments);

const companiesWithDepartments = departments.map((department) => {
  return department.companies.name;
});
console.log("companiesWithDepartments", companiesWithDepartments);

function renderWorkers(array, selectedCompany) {
  if (selectedCompany === undefined) {
    selectedCompany = "";
  }
  const workersList = document.getElementById("workers-list");
  workersList.innerHTML = array
    .map(
      (worker) => `<li>
            <div class="worker-data">
                <h1>${worker.username}</h1>
                <p>${worker.professional_level}</p>
                <p>${selectedCompany}</p>
            </div>
            <div class="worker-buttons">
                <button class="edit-worker">Editar</button>
                <button class="delete-worker">Deletar</button>
            </div>
            </li>`
    )
    .join("");
}
renderWorkers(workersIndepartments);

// Modal create department

const formCreateDepartment = document.querySelector("#form-create-department");
console.log("formCreateDepartment", formCreateDepartment);

function renderCompaniesToCreateDepartment() {
  const companiesContainer = document.querySelector("#chose-company");
  companiesContainer.insertAdjacentHTML(
    "beforeend",
    `<option value="" disable required>Selecionar empresa</option>`
  );
  companies.forEach((company) => {
    companiesContainer.insertAdjacentHTML(
      "beforeend",
      `<option value="${company.uuid}">${company.name}</option>`
    );
  });
}

renderCompaniesToCreateDepartment();

function getDepartmentData() {
  const departmentName = document.querySelector("#department-name").value;
  const departmentDescription = document.querySelector(
    "#department-description"
  ).value;
  const departmentCompany = document.querySelector("#chose-company").value;
  const departmentData = {
    name: departmentName,
    description: departmentDescription,
    company_uuid: departmentCompany,
  };
  return departmentData;
}

formCreateDepartment.addEventListener("submit", async (event) => {
  event.preventDefault();
  const departmentData = getDepartmentData();
  const newDepartment = await createDepartment(departmentData);
  console.log("newDepartment", newDepartment);
});

// Modal edit department

const formEditDepartment = document.querySelector("#form-edit-department");

function modalEditContent(id, description) {
  const departmentDescription = document.querySelector(
    "#edit-department-description"
  );
  console.log("departmentDescription", departmentDescription);
  departmentDescription.value = description;

  const editDepartmentButton = document.getElementById("save-edit-department");
  console.log("editDepartmentButton", editDepartmentButton);

  editDepartmentButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const departmentDescription = document.querySelector(
      "#edit-department-description"
    ).value;

    const departmentData = {
      description: departmentDescription,
    };

    editDepartment(departmentData, id);
    const editModal = document.querySelector(".edit-modal");
    editModal.classList.remove("active");
    window.location.reload();
  });
}
