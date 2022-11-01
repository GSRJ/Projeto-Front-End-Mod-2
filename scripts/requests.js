const baseUrl = "http://localhost:6278/";

export async function getCompanies() {
  const response = await fetch(`${baseUrl}companies`);
  return await response.json();
}
