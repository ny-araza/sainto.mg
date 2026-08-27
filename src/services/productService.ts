const API_URL = import.meta.env.VITE_API_URL;

export interface ProduitMado {
  id: number;
  name: string;
  price: number;
  path: string;
  rate: number;
  nb_unite_in_pack: number | null;
  is_unite: boolean;
  poid: number;
}

export interface Client {
  id: number;
  email: string;
  date: string;
  message: string | null;
  rating: number | null;
}

export interface ProduitLike {
  id: number;
  client: number;
  produit: number;
  date: string;
}

export interface ProductRating {
  productId: number;
  totalLikes: number;
  averageRating: number;
  rate: number;
}

export async function getProducts(): Promise<ProduitMado[]> {
  const response = await fetch(`${API_URL}/produits/`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les produits");
  }

  const data = await response.json();

  return data;
}

export async function createClient(
  email: string,
  message?: string,
  rating?: number
): Promise<Client> {
  const response = await fetch(`${API_URL}/clients/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      message: message ?? null,
      rating: rating ?? null,
    }),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error?.message || "Impossible de créer le client"
    );
  }

  return response.json();
}

export async function likeProduct(
  clientId: number,
  productId: number
): Promise<ProduitLike> {
  const response = await fetch(`${API_URL}/likes/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      client: clientId,
      produit: productId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Impossible de liker le produit"
    );
  }

  return data.data;
}

export async function unlikeProduct(
  likeId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/likes/${likeId}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de supprimer le like"
    );
  }
}

export async function getClientLikes(
  clientId: number
): Promise<ProduitLike[]> {
  const response = await fetch(
    `${API_URL}/clients/${clientId}/likes/`
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer les likes du client"
    );
  }

  const data = await response.json();

  return data.data;
}

export async function getProductRating(
  productId: number
): Promise<ProductRating> {
  const response = await fetch(
    `${API_URL}/produits/${productId}/ratings/`
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer la note du produit"
    );
  }

  const data = await response.json();

  return {
    productId: data.product,
    totalLikes: data.total,
    averageRating: data.average,
    rate: Math.min(
      5,
      Math.max(
        1,
        Math.round(data.average)
      )
    ),
  };
}

export async function sendFeedback(
  email: string,
  message: string,
  rating: number
): Promise<Client> {

  if (rating < 1 || rating > 5) {
    throw new Error(
      "La note doit être comprise entre 1 et 5"
    );
  }

  return createClient(
    email,
    message,
    rating
  );
}

export async function addProductToCart(
  productId: number,
  email: string
): Promise<{
  client: Client;
  like: ProduitLike;
}> {

  // 1. Créer/récupérer le client
  const client = await createClient(email);

  // 2. Liker automatiquement le produit
  const like = await likeProduct(
    client.id,
    productId
  );

  return {
    client,
    like,
  };
}