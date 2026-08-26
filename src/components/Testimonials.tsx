import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import userImg from "../assets/user_03.png";

interface TestimonialProps {
  image: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: userImg,
    userName: "marieclaire_randrianarisoa@gmail.com",
    comment: "Super accueil en magasin 😊 ⭐",
  },
  {
    image: userImg,
    userName: "jeanmichelrakotoarivony17@gmail.com",
    comment:
      "Livraison rapide et très professionnelle 🚚 Mes produits sont arrivés bien emballés et totalement conformes à ma commande ✅. Merci les gars 👍",
  },
  {
    image: userImg,
    userName: "farandrianjafy02@gmail.com",
    comment:
      "Très belle expérience avec Sainto Madagascar 😍, quelle équipe !! 💯",
  },
  {
    image: userImg,
    userName: "tahina_ravelomanantsoa32@gmail.com",
    comment: "Service au top ! gg les gars 🙌✨",
  },
  {
    image: userImg,
    userName: "lucasAndriamihaja56@outlook.com",
    comment:
      "Commande facile, traitement rapide et livraison impeccable 🚚✅ Franchement, je recommande Sainto Madagascar sans hésiter ! 😎",
  },
  {
    image: userImg,
    userName: "mialy_rakotondrabe_g@gmail.com",
    comment:
      "Les articles commandés étaient bien protégés et sont arrivés dans les délais prévus. À la prochaine !",
  },
];

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

export const Testimonials = () => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumns(3); // Desktop
      } else if (window.innerWidth >= 768) {
        setColumns(2); // Tablet
      } else {
        setColumns(1); // Mobile
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
  const infiniteRows = [...rows, ...rows];

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold md:text-4xl">
        Feedback des
        <span className=" text-blue-500 to-primary bg-clip-text text-transparent">
          {" "}
          Clients{" "}
        </span>
        qui commandent chez nous
      </h2>

      <p className="pb-8 pt-4 text-xl text-muted-foreground">
        Découvrez ce que nos clients pensent de nos produits et services.
      </p>

      {/* Zone de scroll */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Fade supérieur */}
        <div className="pointer-events-none absolute top-0 z-10 h-16 w-full bg-gradient-to-b from-background to-transparent" />

        {/* Conteneur animé */}
        <div
          className="animate-testimonials-scroll space-y-6"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {infiniteRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {row.map((testimonial, index) => (
                <Card
                  key={`${testimonial.userName}-${rowIndex}-${index}`}
                  className="overflow-hidden"
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
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
        <div className="pointer-events-none absolute bottom-0 z-10 h-16 w-full bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
};
