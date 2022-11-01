const baseUrl = "http://localhost:6278/";

export async function getCompanies() {
  const response = await fetch(`${baseUrl}companies`);
  return await response.json();
}

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
