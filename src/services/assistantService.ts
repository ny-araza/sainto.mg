const API_URL = import.meta.env.VITE_API_URL;

export type RoleMessage = "user" | "assistant";

export interface HistoriqueMessage {
  role: RoleMessage;
  content: string;
}

export interface AssistantChatResponse {
  message: string;
}

export interface AssistantChatError {
  error: string;
}

/**
 * Envoie un message (avec l'historique de conversation) à l'assistant IA
 * et retourne sa réponse.
 * @throws {Error} si la requête échoue ou si le serveur renvoie une erreur
 */
export async function envoyerMessageAssistant(
  message: string,
  historique: HistoriqueMessage[] = [],
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(`${API_URL}/assistant/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, historique }),
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as AssistantChatError;
    throw new Error(errorData.error || "Une erreur est survenue");
  }

  return (data as AssistantChatResponse).message;
}
