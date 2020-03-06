export async function fetchProlificStudies(authHeader: any) {
  const { name, value } = authHeader
  const headers = { [name]: value }
  // omit credentials here, since auth is handled via the bearer token
  const response = await fetch('https://www.prolific.co/api/v1/studies/?current=1', { credentials: 'omit', headers });
  const json: ProlificApiStudies = await response.json();
  return json;
}
