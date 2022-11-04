import { getDepartments } from "./requests.js";
import { getCompanies } from "./requests.js";
import { getWorkers } from "./requests.js";
import { getWorkersWithoutDepartment } from "./requests.js";
import { createDepartment } from "./requests.js";
import { editDepartment } from "./requests.js";
import { deleteDepartment } from "./requests.js";
import { addWorkerToDepartment } from "./requests.js";
import { deleteWorker } from "./requests.js";

const companies = await getCompanies();
console.log("companies", companies);

const companiesNames = companies.map((company) => company.name);
const uniqueCompaniesNames = [...new Set(companiesNames)];
console.log("uniqueCompaniesNames", uniqueCompaniesNames);
const departments = await getDepartments();
console.log("departments", departments);
const workers = await getWorkers();
console.log("workers", workers);
const workersWithoutDepartment = await getWorkersWithoutDepartment();
console.log("workersWithoutDepartment", workersWithoutDepartment);

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
        <button id="${department.uuid}" class="view-department">Ver</button>
        <button id="${department.uuid}"class="edit-department">Editar</button>
        <button id="${department.uuid}" class="delete-department">Deletar</button>
        </div>
        </li>`
    )
    .join("");

  const editDepartmentButtons = document.querySelectorAll(".edit-department");
  console.log("editDepartmentButtons", editDepartmentButtons);
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

  const deleteDepartmentButtons =
    document.querySelectorAll(".delete-department");

  console.log("deleteDepartmentButtons", deleteDepartmentButtons);
  deleteDepartmentButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const deleteDepartmentModal = document.querySelector(
        ".delete-department-modal"
      );
      deleteDepartmentModal.classList.add("active");
      const departmentUuid = event.target.id;
      console.log("departmentUuid", departmentUuid);
      const departmentName =
        button.parentElement.parentElement.children[0].children[0].innerText;
      console.log("departmentName", departmentName);
      modalDeleteContent(departmentUuid, departmentName);
    });
  });

  const viewDepartmentButtons = document.querySelectorAll(".view-department");
  console.log("viewDepartmentButtons", viewDepartmentButtons);

  viewDepartmentButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const viewDepartmentModal = document.querySelector(".view-modal");
      viewDepartmentModal.classList.add("active");
      const departmentUuid = event.target.id;
      console.log("departmentUuid", departmentUuid);
      const departmentName =
        button.parentElement.parentElement.children[0].children[0].innerText;
      console.log("departmentName", departmentName);
      const departmentDescription =
        button.parentElement.parentElement.children[0].children[1].innerText;
      console.log("departmentDescription", departmentDescription);
      const companyName =
        button.parentElement.parentElement.children[0].children[2].innerText;
      console.log("companyName", companyName);

      const workersInDepartment = workers.filter((worker) => {
        return worker.department_uuid === departmentUuid;
      });
      console.log("workersInDepartment", workersInDepartment);
      modalViewContent(
        departmentName,
        departmentDescription,
        companyName,
        workersInDepartment,
        departmentUuid
      );
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

// Modal delete department

function modalDeleteContent(id, name) {
  const deleteDepartmentButton = document.getElementById(
    "confirm-delete-department"
  );
  const departmentName = document.querySelector(".department-name-delete");
  console.log("DepartmentName", departmentName);
  departmentName.textContent = name;
  console.log("deleteDepartmentButton", deleteDepartmentButton);
  deleteDepartmentButton.addEventListener("click", async (event) => {
    event.preventDefault();
    deleteDepartment(id);
    const deleteDepartmentModal = document.querySelector(
      ".delete-department-modal"
    );
    deleteDepartmentModal.classList.remove("active");
    window.location.reload();
  });
}

// Modal view department

function modalViewContent(name, description, company, workers, id) {
  const departmentName = document.querySelector(".view-department-name");
  departmentName.textContent = name;
  const departmentDescription = document.querySelector(
    ".view-department-description"
  );
  departmentDescription.textContent = description;
  const companyName = document.querySelector(".view-department-company");
  const workersWithoutDepartmentContainer = document.querySelector(
    "#workes-without-department-container"
  );
  console.log(
    "workersWithoutDepartmentContainer",
    workersWithoutDepartmentContainer
  );

  workersWithoutDepartmentContainer.innerHTML = workersWithoutDepartment
    .map(
      (worker) => `<option value="${worker.uuid}">${worker.username}</option>`
    )
    .join("");

  const addWorkerToDepartmentButton = document.querySelector(
    "#add-worker-to-department"
  );
  console.log("addWorkerToDepartmentButton", addWorkerToDepartmentButton);

  addWorkerToDepartmentButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const workerUuid = document.querySelector(
      "#workes-without-department-container"
    ).value;
    console.log("workerUuid", workerUuid);
    const department_id = id;

    addWorkerToDepartment(workerUuid, department_id);
    alert("Funcionário adicionado com sucesso!");
    window.location.reload();
  });

  companyName.textContent = company;
  const workersList = document.querySelector(".view-department-workers");
  console.log("workersList", workersList);
  workers.forEach((worker) => {
    workersList.insertAdjacentHTML(
      "beforeend",
      `<li>
            <div class="worker-data">
                <h1>${worker.username}</h1>
                <p>${worker.professional_level}</p> 
                <p>${company}</p>
            </div>
            <div class="worker-buttons">
                <button class="delete-worker" id="${worker.uuid}">Desligar</button>
            </div>
            </li>`
    );

    const deleteWorkerButton = document.getElementById(worker.uuid);
    console.log("deleteWorkerButton", deleteWorkerButton);
    deleteWorkerButton.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("worker.uuid", worker.uuid);
      const workerUuid = worker.uuid;
      deleteWorker(workerUuid);
      alert("Funcionário desligado com sucesso!");
      window.location.reload();
    });
  });
}
