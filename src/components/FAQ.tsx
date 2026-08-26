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
    question: "La livraison se fait comment ?",
    answer: "La livraison est livré 24h après la commande.",
    value: "item-1",
  },
  {
    question: "Et la commande ?",
    answer:
      "Pour qu'une commande soit validé il doit être commander au minimum 24h à l'avance pour une livraison le jour j",
    value: "item-2",
  },
  {
    question: "Quelles sont les differents moyens de commande chez vous ?",
    answer:
      "Vous pouvez commander via: commercial@gmail.com, whatsapp: 034 xx xxx xx directement. Mais aussi via notre site en cliquant sur les produits que vous voulez qui est ajouter automatiquement dans votre pannier toute en haut ,puis il ne vous reste plus qu'a le valider. Une fois valider l'email est directement envoyer vers nos commerciaux",
    value: "item-3",
  },
  {
    question:
      "Peut on aller voir et acheter depuis chez vous directement ?",
    answer:
      "Oui, notre adrèsse est dans le pied de page",
    value: "item-5",
  },
  {
    question: "A quoi sert l'assistant AI dans le site ?",
    answer:
      "Le but de l'assistant est de repondre 24h/7 vos demande que ce soit information appropos de nous ou commande. Vous pouvez poser les question que vous voulez appropos de nous tant que c'est dans le cadre << professionnel >> à l'assistant",
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
        ou {" "}
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
