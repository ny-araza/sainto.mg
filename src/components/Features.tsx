// import { Badge } from "./ui/badge";
// import { FlipCard, FlipCardData } from "./animate-ui/components/community/flip-card";

// const featureList: string[] = [
//   "Madagascar",
//   "Rafraichîssant",
//   "Qualité",
//   "Naturel",
// ];

// export const Features = () => {
//   const listeArticle: FlipCardData[] = [
//     {
//       id: 1,
//       name: "SAINTO 1.5L",
//       price: 2291.66,
//       rate: 4.8,
//       path: "#",
//       nbUniteInpack: 6,
//       poid: 9
//     },
//     {
//       id: 2,
//       name: "SAINTO 1L",
//       price: 1388.33,
//       rate: 4.7,
//       path: "#",
//       nbUniteInpack: 6,
//       poid: 6
//     },
//     {
//       id: 3,
//       name: "SAINTO 0.5L",
//       price: 1180,
//       rate: 4.6,
//       path: "#",
//       nbUniteInpack: 8,
//       poid: 4
//     },
//     {
//       id: 4,
//       name: "SAINTO 5L",
//       price: 4166.66,
//       rate: 4.9,
//       path: "#",
//       isUnite: true,
//       poid: 5
//     },
//     {
//       id: 5,
//       name: "Bonbonne 1ère Livraison",
//       price: 73333.33,
//       rate: 4.5,
//       path: "#",
//       isUnite: true,
//       poid: 20
//     },
//     {
//       id: 6,
//       name: "Bonbonne Recharge",
//       price: 30000,
//       rate: 4.8,
//       path: "#",
//       isUnite: true,
//       poid: 9
//     },
//     {
//       id: 7,
//       name: "ICE TEA pomme 1.5L",
//       price: 6805,
//       rate: 4.7,
//       path: "#",
//       nbUniteInpack: 6,
//       poid: 9
//     },
//     {
//       id: 8,
//       name: "ICE TEA pêche 1.5L",
//       price: 6805,
//       rate: 4.9,
//       path: "#",
//       nbUniteInpack: 6,
//       poid: 9
//     },
//     {
//       id: 9,
//       name: "ICE TEA citron 1.5L",
//       price: 6805,
//       rate: 4.6,
//       path: "#",
//       nbUniteInpack: 6,
//       poid: 9
//     },
//     {
//       id: 10,
//       name: "ICE TEA pomme 0.5L",
//       price: 2916.66,
//       rate: 4.5,
//       path: "#",
//       nbUniteInpack: 8,
//       poid: 4
//     },
//     {
//       id: 11,
//       name: "ICE TEA pêche 0.5L",
//       price: 2916.66,
//       path: "#",
//       rate: 4.8,
//       nbUniteInpack: 8,
//       poid: 4
//     },
//     {
//       id: 12,
//       name: "ICE TEA citron 0.5L",
//       price: 2916.66,
//       rate: 4.7,
//       path: "#",
//       nbUniteInpack: 8,
//       poid: 4
//     },
//   ];
//   return (
//     <section id="features" className="container py-24 sm:py-32 space-y-8">
//       <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
//         Tous{" "}
//         <span className=" text-blue-500  to-primary bg-clip-text">
//           Nos produits
//         </span>
//       </h2>

//       <div className="flex flex-wrap md:justify-center gap-4">
//         {featureList.map((feature: string) => (
//           <div key={feature}>
//             <Badge variant="secondary" className="text-sm">
//               {feature}
//             </Badge>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 gap-6 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {listeArticle.map((item) => (
//           <div key={item.id} className="flex flex-col items-center gap-2">
//             {/*<TiltDemo
//               maxTilt={4}
//               perspective={200}
//               image={item.path}
//               product={item}
//             />
//             <Button
//               variant={"ghost"}
//               size="sm"
//               onClick={() => ajouterAuPanier(item)}
//               title="Ajouter au panier"
//             >
//               <FontAwesomeIcon icon={faPlusCircle} />
//             </Button>*/}
//             <FlipCard data={item} />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };
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
