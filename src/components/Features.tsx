import { useEffect, useState } from "react";

import { Badge } from "./ui/badge";
import {
  FlipCard,
  FlipCardData,
} from "./animate-ui/components/community/flip-card";

import { getProducts, ProduitMado } from "../services/productService";

const featureList: string[] = [
  "Madagascar",
  "Rafraichîssant",
  "Qualité",
  "Naturel",
];

export const Features = () => {
  const [listeArticle, setListeArticle] = useState<FlipCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const chargerProduits = async () => {
      try {
        setLoading(true);
        setError(null);

        const produits: ProduitMado[] = await getProducts();

        const articles: FlipCardData[] = produits.map((produit) => ({
          id: produit.id,
          name: produit.name,
          price: Number(produit.price),
          rate: Number(produit.rate),
          path: produit.path,
          nbUniteInpack: produit.nb_unite_in_pack ?? undefined,
          isUnite: produit.is_unite,
          poid: Number(produit.poid),
        }));

        setListeArticle(articles);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);

        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    chargerProduits();
  }, []);

  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Tous{" "}
        <span className="text-blue-500 to-primary bg-clip-text">
          Nos produits
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      {/* Chargement */}
      {loading && (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      )}

      {/* Erreur */}
      {!loading && error && (
        <div className="flex justify-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Produits */}
      {!loading && !error && (
        <div
          className="
            grid
            grid-cols-1
            gap-6
            place-items-center
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {listeArticle.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <FlipCard data={item} />
            </div>
          ))}
        </div>
      )}

      {/* Aucun produit */}
      {!loading && !error && listeArticle.length === 0 && (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Aucun produit disponible.</p>
        </div>
      )}
    </section>
  );
};
