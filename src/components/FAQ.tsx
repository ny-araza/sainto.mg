import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Comment se déroule la livraison ?",
    answer:
      "Les livraisons sont généralement effectuées dans un délai de 24 heures après la confirmation de votre commande, selon la disponibilité des produits et la zone de livraison.",
    value: "item-1",
  },
  {
    question: "Quel est le délai à prévoir pour passer une commande ?",
    answer:
      "Afin de garantir la disponibilité des produits et une bonne organisation de la livraison, nous vous recommandons de passer votre commande au moins 24 heures à l'avance pour une livraison à la date souhaitée.",
    value: "item-2",
  },
  {
    question: "Quels sont les différents moyens de passer commande ?",
    answer:
      "Vous pouvez passer votre commande directement par email à l'adresse madogamo@gmail.com ou par WhatsApp au 020 22 417 17. Vous pouvez également commander directement depuis notre site : sélectionnez les produits de votre choix, ajoutez-les à votre panier, puis validez votre demande. Celle-ci sera ensuite transmise à notre équipe commerciale pour traitement.",
    value: "item-3",
  },
  {
    question: "Est-il possible d'acheter directement sur place ?",
    answer:
      "Oui. Vous avez la possibilité de vous rendre directement chez nous pour découvrir et acheter nos produits. Vous trouverez notre adresse ainsi que nos coordonnées dans le pied de page du site.",
    value: "item-5",
  },
  {
    question: "À quoi sert l'assistant IA disponible sur le site ?",
    answer:
      "Notre assistant IA est disponible 24h/24 et 7j/7 pour répondre à vos questions concernant nos produits, nos services, les modalités de commande et toute autre information relative à notre activité. Il peut également vous accompagner dans vos démarches et vous orienter vers les informations dont vous avez besoin.",
    value: "item-4",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Les{" "}
        <span className="bg-blue-500 to-primary text-transparent bg-clip-text">
          Questions{" "}
        </span>
        Les plus frequements posé
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Vous avez encore d'autre question? Demander a notre{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-blue-500 transition-all border-primary hover:border-b-2"
        >
          Assistant virtuel{" "}
        </a>
        ou{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-blue-500 transition-all border-primary hover:border-b-2"
        >
          Contacter directement ici
        </a>
      </h3>
    </section>
  );
};
