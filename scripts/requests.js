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
