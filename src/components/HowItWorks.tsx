import TiltDemo from "./ui/tiltDemo";
import pilot from "../assets/about_us.png";

type ProduitProps = {
  id: number;
  name: string;
  price: number;
  rate: number;
  path: string;
};

export const HowItWorks = () => {
  const listeBestRatingArticle: ProduitProps[] = [
    {
      id: 1,
      name: "SAINTO 1.5L",
      price: 2291.66,
      rate: 4.8,
      path: pilot,
    },
    {
      id: 2,
      name: "SAINTO 1L",
      price: 1388.33,
      rate: 4.7,
      path: pilot,
    },
    {
      id: 3,
      name: "SAINTO 0.5L",
      price: 1180,
      rate: 4.6,
      path: pilot,
    },
    {
      id: 4,
      name: "SAINTO 5L",
      price: 4166.66,
      path: pilot,
      rate: 4.9,
    },
    {
      id: 5,
      name: "Bonbonne 1ère Livraison",
      price: 73333.33,
      path: pilot,
      rate: 4.5,
    },
    {
      id: 6,
      name: "Bonbonne Recharge",
      price: 30000,
      path: pilot,
      rate: 4.8,
    },
    {
      id: 7,
      name: "ICE TEA pomme 1.5L",
      price: 6805,
      path: pilot,
      rate: 4.7,
    },
    {
      id: 8,
      name: "ICE TEA pêche 1.5L",
      price: 6805,
      path: pilot,
      rate: 4.9,
    },
    {
      id: 9,
      name: "ICE TEA citron 1.5L",
      price: 6805,
      path: pilot,
      rate: 4.6,
    },
    {
      id: 10,
      name: "ICE TEA pomme 0.5L",
      price: 2916.66,
      path: pilot,
      rate: 4.5,
    },
    {
      id: 11,
      name: "ICE TEA pêche 0.5L",
      price: 2916.66,
      path: pilot,
      rate: 4.8,
    },
    {
      id: 12,
      name: "ICE TEA citron 0.5L",
      price: 2916.66,
      path: pilot,
      rate: 4.7,
    },
  ];
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold ">
        Nos{" "}
        <span className="bg-gradient-to-b bg-blue-800 to-primary text-transparent bg-clip-text">
          Produits{" "}
        </span>
        les plus noté
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Après chaque commande, les clients peuvent noter notre service et les
        produits reçus de 1 à 5.
      </p>

      <div className="grid grid-cols-1 gap-6 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listeBestRatingArticle.map((item) => (
          <TiltDemo
            key={item.id}
            maxTilt={4}
            perspective={200}
            image={item.path}
            product={item}
          />
        ))}
      </div>
    </section>
  );
};
