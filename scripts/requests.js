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
  return await response.json();
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
