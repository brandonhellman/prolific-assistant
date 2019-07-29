export async function fetchProlificStudies() {
  const response = await fetch('https://www.prolific.co/api/v1/studies/?current=1', { credentials: 'include' });
  const json: ProlificApiStudies = await response.json();
  return json.results;
}
