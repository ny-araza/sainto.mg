import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import userImg from "../assets/user_03.png";
import { getClientsWithFeedback, type Client } from "@/services/clientServices";

interface TestimonialProps {
  id: number;
  image: string;
  userName: string;
  comment: string;
}

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

export const Testimonials = () => {
  const [columns, setColumns] = useState(3);

  const [testimonials, setTestimonials] = useState<TestimonialProps[]>([]);

  const [loading, setLoading] = useState(true);

  /**
   * Récupération des feedbacks
   */
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);

        const clients: Client[] = await getClientsWithFeedback();

        const formattedTestimonials = clients.map((client) => ({
          id: client.id,

          image: userImg,

          userName: client.email || "Client anonyme",

          comment: client.message || "",
        }));

        setTestimonials(formattedTestimonials);
      } catch (error) {
        console.error("Erreur lors du chargement des feedbacks :", error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  /**
   * Gestion responsive
   */
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3);
      } else if (window.innerWidth >= 768) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();

    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  const rows = chunkArray(testimonials, columns);

  // Duplication pour créer une boucle infinie
  const infiniteRows = testimonials.length > 0 ? [...rows, ...rows] : [];

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold md:text-4xl">
        Feedback des
        <span className="text-blue-500 to-primary bg-clip-text"> Clients </span>
        qui commandent chez nous
      </h2>

      <p className="pb-8 pt-4 text-xl text-muted-foreground">
        Découvrez ce que nos clients pensent de nos produits et services.
      </p>

      {/* Chargement */}
      {loading && (
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          Chargement des feedbacks...
        </div>
      )}

      {/* Aucun feedback */}
      {!loading && testimonials.length === 0 && (
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          Aucun feedback pour le moment.
        </div>
      )}

      {/* Testimonials */}
      {!loading && testimonials.length > 0 && (
        <div className="relative h-[500px] overflow-hidden">
          {/* Fade supérieur */}
          <div
            className="
              pointer-events-none
              absolute
              top-0
              z-10
              h-16
              w-full
              bg-gradient-to-b
              from-background
              to-transparent
            "
          />

          {/* Conteneur animé */}
          <div className="animate-testimonials-scroll space-y-6">
            {infiniteRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {row.map((testimonial) => (
                  <Card
                    key={`${testimonial.id}-${rowIndex}`}
                    className="overflow-hidden"
                  >
                    <CardHeader
                      className="
                            flex
                            flex-row
                            items-center
                            gap-4
                            pb-2
                          "
                    >
                      <Avatar>
                        <AvatarImage
                          alt={testimonial.userName}
                          src={testimonial.image}
                        />

                        <AvatarFallback>
                          {testimonial.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <CardDescription className="truncate">
                          {testimonial.userName}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent>{testimonial.comment}</CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>

          {/* Fade inférieur */}
          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              z-10
              h-16
              w-full
              bg-gradient-to-t
              from-background
              to-transparent
            "
          />
        </div>
      )}
    </section>
  );
};
