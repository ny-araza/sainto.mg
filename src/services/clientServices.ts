const API_URL = import.meta.env.VITE_API_URL;

export interface Client {
  id: number;
  email: string | null;
  date: string;
  message: string | null;
}

export async function getClientsWithFeedback(): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients/`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les feedbacks des clients");
  }

  const data = await response.json();

  // Si ton API retourne directement un tableau
  const clients: Client[] = Array.isArray(data)
    ? data
    : (data.results ?? data.data ?? []);

  return clients.filter(
    (client) => client.message && client.message.trim().length > 0,
  );
}

export async function updateClient(id: number | string | null, feedbacks: string) {
  console.log("id", id)
  const response = await fetch(`${API_URL}/clients/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ message: feedbacks }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Impossible de mettre à jour le client");
  }

  return data;
}
