import pilot from "../assets/about_us.png";
import { MotionCarousel } from "./animate-ui/components/community/motion-carousel";

type ProduitProps = {
  id: number;
  name: string;
  price: number;
  rate: number;
  path: string;
};

export const HowItWorks = () => {
  const slides = [
    {
      id: 1,
      image: pilot,
      alt: "Bouteille d'eau minérale Sianto",
    },
    {
      id: 2,
      image: pilot,
      alt: "Ice Tea pomme Sianto",
    },
    {
      id: 3,
      image: pilot,
      alt: "Bonbonne d'eau Sianto",
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

      <div className="flex">
        <MotionCarousel
          slides={slides}
          options={{
            loop: true,
            align: "center",
          }}
        />
      </div>
    </section>
  );
};
