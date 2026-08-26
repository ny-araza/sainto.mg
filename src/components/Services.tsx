import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import cubeLeg from "../assets/employer_epanoui_01.png";
import collaborationImg from "../assets/collaboration.png";
import clientImg from "../assets/client_bien_accuilli.jpg";
import deliveryImg from "../assets/good_delivery.jpg";

interface ServiceProps {
  title: string;
  description: string;
  image: string;
}

const serviceList: ServiceProps[] = [
  {
    title: "Collaboration entre les équipes",
    description:
      "Une équipe coordonnée pour un service efficace, chaleureux et fiable.",
    image: collaborationImg,
  },
  {
    title: "Gestion et traitement des commandes",
    description:
      "Des commandes vérifiées, préparées et suivies avec rapidité et soin.",
    image: clientImg,
  },
  {
    title: "Livraison et satisfaction client",
    description:
      "Une livraison ponctuelle et soignée pour garantir la satisfaction de chaque client.",
    image: deliveryImg,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b text-blue-500 to-primary text-transparent bg-clip-text">
              Service{" "}
            </span>
            Client
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8">
            Sainto Madagascar : le sourire en magasin, le soin jusqu’à votre
            porte
          </p>
          <div className="flex flex-col gap-8">
            {serviceList.map(({ image, title, description }: ServiceProps) => (
              <Card key={title} className="overflow-hidden">
                <CardHeader className="space-y-1 flex flex-row justify-start items-start gap-4">
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl shrink-0 border border-primary/20"
                  />
                  <div>
                    <CardTitle className="text-blue-500">{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <img
          src={cubeLeg}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
