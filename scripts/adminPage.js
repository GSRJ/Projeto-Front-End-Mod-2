import { getDepartments, verifyKindOfUser } from "./requests.js";
import { getCompanies } from "./requests.js";
import { getWorkers } from "./requests.js";
import { getWorkersWithoutDepartment } from "./requests.js";
import { createDepartment } from "./requests.js";
import { editDepartment } from "./requests.js";
import { deleteDepartment } from "./requests.js";
import { addWorkerToDepartment } from "./requests.js";
import { deleteWorker } from "./requests.js";
import { editWorkerInfo } from "./requests.js";
import { deleteWorkerGeneral } from "./requests.js";

function verifyAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../pages/login.html";
  }
}

verifyAuthentication();

const logoutButton = document.querySelector(".logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.reload();
});

const companies = await getCompanies();

const companiesNames = companies.map((company) => company.name);
const uniqueCompaniesNames = [...new Set(companiesNames)];
const departments = await getDepartments();

const workers = await getWorkers();

const workersWithoutDepartment = await getWorkersWithoutDepartment();

const workersIndepartments = workers.filter((worker) => {
  return worker.department_uuid !== null;
});

function renderCompanies() {
  const companiesContainer = document.querySelector("#companies-container");
  companiesContainer.insertAdjacentHTML(
    "beforeend",
    `<option value="todas">Selecionar Empresa</option>`
  );
  const companiesWhitDepartments = departments.map((department) => {
    return department.companies.name;
  });
  const uniqueCompaniesWhitDepartments = [...new Set(companiesWhitDepartments)];

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

  const filteredWorkers = workersIndepartments.filter((worker) => {
    return filteredDepartments.some(
      (department) => department.uuid === worker.department_uuid
    );
  });
  if (selectedCompany === "todas") {
    renderDepartments(departments);
    renderWorkers(workers);
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
        <h2>${department.name}</h2>
        <p>${department.description}</p>
        <p>${department.companies.name}</p>
      </div>
        <div class="department-buttons">
        <button id="${department.uuid}" class="view-department"><img src="../assets/img/viewIcon.svg" alt="View Icon" id="${department.uuid}"></button>
        <button id="${department.uuid}"class="edit-department"><img src="../assets/img/editIconBlack.svg" alt="Edit Icon" id="${department.uuid}"></button>
        <button id="${department.uuid}" class="delete-department"><img src="../assets/img/deleteIcon.svg" alt="Delete Icon" id="${department.uuid}"></button>
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

      modalEditContent(departmentUuid, departmentDescription);
    });
  });

  const deleteDepartmentButtons =
    document.querySelectorAll(".delete-department");

  deleteDepartmentButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const deleteDepartmentModal = document.querySelector(
        ".delete-department-modal"
      );
      deleteDepartmentModal.classList.add("active");
      const departmentUuid = event.target.id;
      const departmentName =
        button.parentElement.parentElement.children[0].children[0].innerText;
      modalDeleteContent(departmentUuid, departmentName);
    });
  });

  const closeDeleteDepartmentModal = document.querySelector(
    ".close-icon-delete-department"
  );
  closeDeleteDepartmentModal.addEventListener("click", () => {
    const deleteDepartmentModal = document.querySelector(
      ".delete-department-modal"
    );
    deleteDepartmentModal.classList.remove("active");
  });

  const viewDepartmentButtons = document.querySelectorAll(".view-department");

  viewDepartmentButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const viewDepartmentModal = document.querySelector(".view-modal");
      viewDepartmentModal.classList.add("active");
      const departmentUuid = event.target.id;
      const departmentName =
        button.parentElement.parentElement.children[0].children[0].innerText;
      const departmentDescription =
        button.parentElement.parentElement.children[0].children[1].innerText;
      const companyName =
        button.parentElement.parentElement.children[0].children[2].innerText;

      const workersInDepartment = workers.filter((worker) => {
        return worker.department_uuid === departmentUuid;
      });
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

const closeIconView = document.querySelector(".close-icon-view");

closeIconView.addEventListener("click", () => {
  const viewDepartmentModal = document.querySelector(".view-modal");
  viewDepartmentModal.classList.remove("active");
});

const companiesWithDepartments = departments.map((department) => {
  return department.companies.name;
});

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
                <p>${worker.kind_of_work}</p>
            </div>
            <div class="worker-buttons">
                <button id="${worker.uuid}" class="edit-worker"><img src="../assets/img/editIconBlack.svg" alt="Edit Icon" id="${worker.uuid}"></button>
                <button id="${worker.uuid}"  class="delete-worker-general"><img src="../assets/img/deleteIcon.svg" alt="Delete Icon" id="${worker.uuid}"></button>
            </div>
            </li>`
    )
    .join("");

  const editWorkerButtons = document.querySelectorAll(".edit-worker");

  editWorkerButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const editWorkerModal = document.querySelector(".modal-edit-worker");
      editWorkerModal.classList.add("active");
      const workerUuid = event.target.id;
      modalEditWorkerContent(workerUuid);
    });
  });

  const deleteWorkerButtons = document.querySelectorAll(
    ".delete-worker-general"
  );

  deleteWorkerButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const deleteWorkerModal = document.querySelector(".delete-worker-modal");
      deleteWorkerModal.classList.add("active");
      const workerUuid = event.target.id;
      const workerName =
        button.parentElement.parentElement.children[0].children[0].innerText;
      modalDeleteWorkerContent(workerUuid, workerName);
    });
  });
}

renderWorkers(workers);

// Modal create department

const formCreateDepartment = document.querySelector("#form-create-department");

const createModal = document.querySelector(".create-modal");
const createDepartmentButton = document.querySelector(
  ".create-department-button"
);

const closeIcon = document.querySelector(".close-icon");

closeIcon.addEventListener("click", () => {
  createModal.classList.remove("active");
});

createDepartmentButton.addEventListener("click", () => {
  createModal.classList.add("active");
});

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
});

// Modal edit department

const formEditDepartment = document.querySelector("#form-edit-department");

function modalEditContent(id, description) {
  const departmentDescription = document.querySelector(
    "#edit-department-description"
  );
  departmentDescription.value = description;

  const editDepartmentButton = document.getElementById("save-edit-department");

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
    alert("Departamento editado com sucesso!");
    window.location.reload();
  });
}

// Modal delete department

function modalDeleteContent(id, name) {
  const deleteDepartmentButton = document.getElementById(
    "confirm-delete-department"
  );
  const departmentName = document.querySelector(".department-name-delete");
  departmentName.textContent = name;
  deleteDepartmentButton.addEventListener("click", async (event) => {
    event.preventDefault();
    deleteDepartment(id);
    const deleteDepartmentModal = document.querySelector(
      ".delete-department-modal"
    );
    deleteDepartmentModal.classList.remove("active");
    alert("Departamento deletado com sucesso!");
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

  workersWithoutDepartmentContainer.innerHTML = workersWithoutDepartment
    .map(
      (worker) => `<option value="${worker.uuid}">${worker.username}</option>`
    )
    .join("");

  workersWithoutDepartmentContainer.insertAdjacentHTML(
    "afterbegin",
    `<option value="0" disabled Selected> Selecionar usu??rio</option>`
  );

  const addWorkerToDepartmentButton = document.querySelector(
    "#add-worker-to-department"
  );

  addWorkerToDepartmentButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const workerUuid = document.querySelector(
      "#workes-without-department-container"
    ).value;
    const department_id = id;

    addWorkerToDepartment(workerUuid, department_id);
    alert("Funcion??rio adicionado com sucesso!");
    window.location.reload();
  });

  companyName.textContent = company;
  const workersList = document.querySelector(".view-department-workers");

  workers.forEach((worker) => {
    workersList.insertAdjacentHTML(
      "beforeend",
      `<li>
            <div class="worker-data">
                <h3>${worker.username}</h3>
                <p>${worker.professional_level}</p> 
                <p>${company}</p>
            </div>
            <div class="worker-buttons">
                <button class="delete-worker red-btn" id="${worker.uuid}">Desligar</button>
            </div>
            </li>`
    );

    const removeWorkerButton = document.querySelectorAll(".delete-worker");

    removeWorkerButton.forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        const workerUuid = button.id;
        deleteWorker(workerUuid);
        alert("Funcion??rio removido com sucesso!");
        window.location.reload();
      });
    });
  });
}

// Modal edit worker

function modalEditWorkerContent(id) {
  const editWorkerButton = document.getElementById("save-edit-worker");

  editWorkerButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const workerKindOfWork = document.querySelector(
      "#edit-worker-kind-of-work"
    ).value;
    const workerProfessionalLevel = document.querySelector(
      "#edit-worker-professional-level"
    ).value;

    const workerData = {
      kind_of_work: workerKindOfWork,
      professional_level: workerProfessionalLevel,
    };

    editWorkerInfo(id, workerData);
    alert("Informa????es do funcion??rio editadas com sucesso!");
    window.location.reload();
  });
}

const closeIconEditWorker = document.querySelector(".close-icon-edit-worker");
closeIconEditWorker.addEventListener("click", (event) => {
  event.preventDefault();
  const editWorkerModal = document.querySelector(".modal-edit-worker");
  editWorkerModal.classList.remove("active");
});

const closeEditModal = document.querySelector(".close-icon-edit");

closeEditModal.addEventListener("click", (event) => {
  event.preventDefault();
  const editModal = document.querySelector(".edit-modal");
  editModal.classList.remove("active");
});

// Modal delete worker

function modalDeleteWorkerContent(id, name) {
  const deleteWorkerButton = document.getElementById(
    "confirm-delete-worker-general"
  );
  const workerName = document.querySelector(".worker-name-delete-general");
  workerName.textContent = name;
  deleteWorkerButton.addEventListener("click", async (event) => {
    event.preventDefault();
    deleteWorkerGeneral(id);
    const deleteWorkerModal = document.querySelector(".delete-worker-modal");
    deleteWorkerModal.classList.remove("active");
    alert("Funcion??rio desligado com sucesso!");
    window.location.reload();
  });
}

const closeIconDeleteWorker = document.querySelector(
  ".close-icon-delete-worker"
);

closeIconDeleteWorker.addEventListener("click", (event) => {
  event.preventDefault();
  const deleteWorkerModal = document.querySelector(".delete-worker-modal");
  deleteWorkerModal.classList.remove("active");
});
