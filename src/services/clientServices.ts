const API_URL = import.meta.env.VITE_API_URL;

export interface Client {
  id: number;
  email: string | null;
  date: string;
  message: string | null;
}

function getCookie(name: string): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : null;
}

export async function getClientsWithFeedback(): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les feedbacks des clients");
  }

  const data = await response.json();

  const clients: Client[] = Array.isArray(data)
    ? data
    : (data.results ?? data.data ?? []);

  return clients.filter(
    (client) => client.message && client.message.trim().length > 0,
  );
}

export async function updateClient(
  id: number | string | null,
  feedbacks: string,
) {
  if (id == null) {
    throw new Error("L'identifiant du client est manquant");
  }

  const csrfToken = getCookie("csrftoken");

  const response = await fetch(`${API_URL}/clients/${id}/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    },
    body: JSON.stringify({ message: feedbacks }),
  });

  const text = await response.text();

  let data: any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.error("Réponse non JSON de l'API clients :", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      body: text.slice(0, 500),
    });

    throw new Error("L'API clients a renvoyé une réponse non JSON");
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Impossible de mettre à jour le client");
  }

  return data;
}
