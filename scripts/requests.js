const baseUrl = "http://localhost:6278/";

//Home page
export async function getCompanies() {
  const response = await fetch(`${baseUrl}companies`);
  return await response.json();
}

//Register page
export async function registerUser(user) {
  const response = await fetch(`${baseUrl}auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const responseJson = await response.json();
  console.log(responseJson.error);
  if (responseJson.error) {
    const toastBoxError = document.querySelector(".toast-box-error");
    const toastTextError = document.querySelector(".toast-text-error");
    toastTextError.innerText = responseJson.error;
    toastBoxError.classList.add("active");
    setTimeout(() => {
      toastBoxError.classList.remove("active");
    }, 3000);
  } else {
    const toastBoxSucces = document.querySelector(".toast-box-success");
    const toastText = document.querySelector(".toast-text");
    toastText.innerText = "Cadastro efetuado com sucesso!";
    toastBoxSucces.classList.add("active");
    setTimeout(() => {
      window.location.href = "../pages/login.html";
    }, 1500);
  }
}

//Login page
export async function loginUser(user) {
  const response = await fetch(`${baseUrl}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (response.status === 200) {
    return data;
  } else {
    const toastBoxError = document.querySelector(".toast-box-error");
    const toastTextError = document.querySelector(".toast-text-error");
    toastTextError.innerHTML = data.error;
    toastBoxError.classList.add("active");

    setTimeout(() => {
      toastBoxError.classList.remove("active");
    }, 1500);
  }
}

export async function verifyKindOfUser() {
  const response = await fetch(`${baseUrl}auth/validate_user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

//User page
export async function getUserData() {
  const response = await fetch(`${baseUrl}users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function getDepartmentInfo() {
  const response = await fetch(`${baseUrl}users/departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  let error = "error";
  let data = await response.json();

  if (data.error) {
    return error;
  } else {
    return data;
  }
}

export async function getCoworkers() {
  const response = await fetch(`${baseUrl}users/departments/coworkers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function userEdit(user) {
  const response = await fetch(`${baseUrl}users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  });
  return await response.json();
}

//Admin page

export async function getDepartments() {
  const response = await fetch(`${baseUrl}departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function getWorkers() {
  const response = await fetch(`${baseUrl}users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function getWorkersWithoutDepartment() {
  const response = await fetch(`${baseUrl}admin/out_of_work`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function createDepartment(data) {
  const response = await fetch(`${baseUrl}departments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  if (response.status === 201) {
    alert("Departamento criado com sucesso");
    window.location.reload();
  } else {
    alert(responseJson.error);
  }
}

export async function editDepartment(postData, id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${baseUrl}departments/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();
  console.log(data);
}

export async function deleteDepartment(id) {
  const response = await fetch(`${baseUrl}departments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function addWorkerToDepartment(workeruuid, departmentuuid) {
  const data = {
    user_uuid: workeruuid,
    department_uuid: departmentuuid,
  };
  const response = await fetch(`${baseUrl}departments/hire/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteWorker(workeruuid) {
  const response = await fetch(`${baseUrl}departments/dismiss/${workeruuid}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
}

export async function editWorkerInfo(workeruuid, data) {
  const response = await fetch(`${baseUrl}admin/update_user/${workeruuid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteWorkerGeneral(workeruuid) {
  const response = await fetch(`${baseUrl}admin/delete_user/${workeruuid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  console.log(response);
  return await response.json();
}
