import { useEffect, useState } from "react";
import { MotionCarousel } from "./animate-ui/components/community/motion-carousel";

import { getPubs, Pub } from "../services/productService";

export const HowItWorks = () => {
  const [slides, setSlides] = useState<
    {
      id: number;
      image: string;
      alt: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerPublicites = async () => {
      try {
        const pubs: Pub[] = await getPubs();

        const slidesData = pubs.slice(0, 3).map((pub) => ({
          id: pub.id,
          image: pub.path,
          alt: `Publicité SAINTO ${pub.id}`,
        }));

        setSlides(slidesData);
      } catch (error) {
        console.error("Erreur lors du chargement des publicités :", error);
      } finally {
        setLoading(false);
      }
    };

    chargerPublicites();
  }, []);

  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        Nos Moments de{" "}
        <span className="bg-gradient-to-b text-blue-500 bg-clip-text">
          Fraîcheur
        </span>{" "}
      </h2>

      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Découvrez nos campagnes et les moments qui font vivre l'univers Sainto.
      </p>

      {loading ? (
        <div className="py-10">Chargement des publicités...</div>
      ) : slides.length > 0 ? (
        <div className="flex">
          <MotionCarousel
            slides={slides}
            options={{
              loop: true,
              align: "center",
            }}
          />
        </div>
      ) : (
        <div className="py-10 text-muted-foreground">
          Aucune publicité disponible.
        </div>
      )}
    </section>
  );
};
