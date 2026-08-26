import { Badge } from "./ui/badge";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";
import TiltDemo from "./ui/tiltDemo";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

type ProduitProps = {
  id: number;
  name: string;
  price: number;
  rate: number;
  path: string;
};

const featureList: string[] = [
  "Madagascar",
  "Rafraichîssant",
  "Qualité",
  "Naturel",
];

export const Features = () => {
  const listeArticle: ProduitProps[] = [
    {
      id: 1,
      name: "SAINTO 1.5L",
      price: 2291.66,
      rate: 4.8,
      path: "#"
    },
    {
      id: 2,
      name: "SAINTO 1L",
      price: 1388.33,
      rate: 4.7,
      path: "#"
    },
    {
      id: 3,
      name: "SAINTO 0.5L",
      price: 1180,
      rate: 4.6,
      path: "#"
    },
    {
      id: 4,
      name: "SAINTO 5L",
      price: 4166.66,
      rate: 4.9,
      path: "#"
    },
    {
      id: 5,
      name: "Bonbonne 1ère Livraison",
      price: 73333.33,
      rate: 4.5,
      path: "#"
    },
    {
      id: 6,
      name: "Bonbonne Recharge",
      price: 30000,
      rate: 4.8,
      path: "#"
    },
    {
      id: 7,
      name: "ICE TEA pomme 1.5L",
      price: 6805,
      rate: 4.7,
      path: "#"
    },
    {
      id: 8,
      name: "ICE TEA pêche 1.5L",
      price: 6805,
      rate: 4.9,
      path: "#"
    },
    {
      id: 9,
      name: "ICE TEA citron 1.5L",
      price: 6805,
      rate: 4.6,
      path: "#"
    },
    {
      id: 10,
      name: "ICE TEA pomme 0.5L",
      price: 2916.66,
      rate: 4.5,
      path: "#"
    },
    {
      id: 11,
      name: "ICE TEA pêche 0.5L",
      price: 2916.66,
      rate: 4.8,
      path: "#"
    },
    {
      id: 12,
      name: "ICE TEA citron 0.5L",
      price: 2916.66,
      rate: 4.7,
      path: "#"
    },
  ];

  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        <span className="bg-gradient-to-b text-blue-500 to-primary text-transparent bg-clip-text">
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

        <div className="grid grid-cols-1 gap-6 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listeArticle.map((item) => (
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
