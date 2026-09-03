const API_URL = import.meta.env.VITE_CREW_API_URL;
const TOKEN = import.meta.env.VITE_CREW_BEARER_TOKEN;

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${TOKEN}`,
};

// Check API
export async function healthCheck() {
  const response = await fetch(`${API_URL}/healthcheck`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

// Get required inputs
export async function getInputs() {
  const response = await fetch(`${API_URL}/inputs`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Could not get inputs");
  }

  return response.json();
}

// Start CrewAI execution
export async function startRecovery(inputData={}) {
  const response = await fetch(`${API_URL}/kickoff`, {
    method: "POST",
    headers,
    body: JSON.stringify(inputData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

// Check execution status
export async function getRecoveryStatus(kickoffId) {
  const response = await fetch(
    `${API_URL}/status/${kickoffId}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Could not get execution status");
  }

  return response.json();
}