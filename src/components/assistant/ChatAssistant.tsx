import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faPaperPlane,
  faMinus,
  faXmark,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAssistant } from "@/context/AssistantContext";
import ReactMarkdown from "react-markdown";
import { getProducts, type ProduitMado } from "@/services/productService";

interface Message {
  id: number;
  auteur: "assistant" | "utilisateur";
  texte: string;
}

type Langue = "fr" | "en";
type Intention =
  | "salutation"
  | "aide"
  | "liste_produits"
  | "prix"
  | "poids"
  | "conditionnement"
  | "note"
  | "comparaison"
  | "societe"
  | "commande"
  | "remerciement"
  | "au_revoir"
  | "hors_sujet"
  | "inconnue"
  | "ingredients";

const MESSAGE_ACCUEIL: Message = {
  id: 0,
  auteur: "assistant",
  texte:
    "Bonjour 👋 Je suis l'assistant Sainto. Je peux vous renseigner sur nos produits et les informations disponibles sur notre société. Comment puis-je vous aider ?",
};

const SUGGESTIONS = [
  "Quels sont vos produits ?",
  "Quel est le prix ?",
  "What products do you have?",
  "How can I order?",
];

// Ne renseigner ici que des informations officiellement vérifiées.
// Laisser une valeur vide si l'information n'est pas disponible.
const SOCIETE = {
  nom: "Groupe Mado gamo",
  telephone: "020 22 417 17",
  email: "mado@gmail.com",
  adresse: "4G4V+783, Antananarivo 101",
  horaires: "7h à 16h 30 . 5j sur 7",
  livraison: "Partout à Tana et province",
  paiement: "Mvola, virements, au comptant chez notre",
  site: "Sainto.mg",
};

const normaliser = (texte: string): string =>
  texte
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const contientUn = (texte: string, expressions: string[]): boolean =>
  expressions.some((expression) => {
    const expressionNormalisee = normaliser(expression);
    return (
      texte === expressionNormalisee ||
      texte.startsWith(expressionNormalisee + " ") ||
      texte.includes(" " + expressionNormalisee + " ") ||
      texte.endsWith(" " + expressionNormalisee)
    );
  });

const estAnglais = (texte: string): boolean => {
  const motsAnglais =
    /\b(hello|hi|hey|please|what|which|where|when|who|why|how|price|cost|cheap|expensive|product|products|buy|order|delivery|shipping|payment|company|business|about|weight|size|rating|compare|thanks|thank|goodbye|available|have|sell|selling|your|you|is|are|do|does|can|could|would|tell|me|the|for|and|with|water|tea)\b/;

  const motsFrancais =
    /\b(bonjour|salut|merci|quel|quelle|quels|quelles|combien|prix|produit|produits|acheter|commande|livraison|paiement|societe|entreprise|poids|conditionnement|note|comparer|disponible|vous|votre|vos|est|sont|avec|eau|the)\b/;

  const anglais = (normaliser(texte).match(motsAnglais) || []).length;
  const francais = (normaliser(texte).match(motsFrancais) || []).length;

  return anglais > francais;
};

const formaterPrix = (prix: number): string =>
  `${prix.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} Ar`;

const formaterPoids = (poids: number): string =>
  `${poids.toLocaleString("fr-FR")} g`;

const reponseErreurInconnue = (langue: Langue): string =>
  langue === "fr"
    ? "Je suis l'assistant Sainto. 😊 Je peux vous aider avec les produits, leurs prix, leurs caractéristiques et les informations disponibles sur notre société. Essayez de reformuler votre question."
    : "I'm the Sainto assistant. 😊 I can help you with products, prices, product details, and the company information available to me. Please try rephrasing your question.";

export const ChatAssistant = () => {
  const { isOpen, fermerAssistant } = useAssistant();

  const [messages, setMessages] = useState<Message[]>([MESSAGE_ACCUEIL]);
  const [saisie, setSaisie] = useState("");
  const [enChargement, setEnChargement] = useState(false);
  const [produits, setProduits] = useState<ProduitMado[]>([]);
  const [erreurProduits, setErreurProduits] = useState(false);
  const [produitsCharges, setProduitsCharges] = useState(false);

  const finDesMessages = useRef<HTMLDivElement>(null);
  const prochainId = useRef(1);
  const chargementProduits = useRef<Promise<ProduitMado[]> | null>(null);

  // Une seule récupération des produits pendant la vie du composant.
  // Aucun appel au backend pour générer les réponses du chatbot.
  useEffect(() => {
    let actif = true;

    if (!chargementProduits.current) {
      chargementProduits.current = getProducts().catch((error) => {
        chargementProduits.current = null;
        throw error;
      });
    }

    chargementProduits.current
      .then((data) => {
        if (!actif) return;
        setProduits(Array.isArray(data) ? data : []);
        setErreurProduits(false);
        setProduitsCharges(true);
      })
      .catch(() => {
        if (!actif) return;
        setErreurProduits(true);
        setProduitsCharges(true);
      });

    return () => {
      actif = false;
    };
  }, []);

  useEffect(() => {
    finDesMessages.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isOpen, enChargement]);

  const ajouterMessages = useCallback(
    (nouveauxMessages: Omit<Message, "id">[]) => {
      setMessages((precedents) => [
        ...precedents,
        ...nouveauxMessages.map((message) => ({
          ...message,
          id: prochainId.current++,
        })),
      ]);
    },
    [],
  );

  const reconnaitreIntention = (texte: string, langue: Langue): Intention => {
    const t = normaliser(texte);

    // Les questions de commande ne déclenchent aucune action commerciale.
    if (
      contientUn(t, [
        "commander",
        "commande",
        "commandes",
        "acheter",
        "achat",
        "passer commande",
        "passer une commande",
        "payer",
        "panier",
        "reserver",
        "how to order",
        "place an order",
        "make an order",
        "buy",
        "purchase",
        "checkout",
        "payment",
        "pay",
      ])
    ) {
      return "commande";
    }

    if (
      contientUn(t, [
        "bonjour",
        "salut",
        "bonsoir",
        "coucou",
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "howdy",
      ])
    ) {
      return "salutation";
    }

    if (
      contientUn(t, [
        "merci",
        "merci beaucoup",
        "thanks",
        "thank you",
        "thank you very much",
        "thx",
      ])
    ) {
      return "remerciement";
    }

    if (
      contientUn(t, [
        "au revoir",
        "a bientot",
        "a plus",
        "bye",
        "goodbye",
        "see you",
        "see you later",
        "have a nice day",
      ])
    ) {
      return "au_revoir";
    }

    if (
      contientUn(t, [
        "aide",
        "aide moi",
        "que peux tu faire",
        "que pouvez vous faire",
        "comment ca marche",
        "help",
        "what can you do",
        "how can you help",
        "how does this work",
        "your capabilities",
      ])
    ) {
      return "aide";
    }

    if (
      contientUn(t, [
        "compare",
        "comparer",
        "comparaison",
        "difference entre",
        "lequel est meilleur",
        "which is better",
        "compare the",
        "difference between",
      ])
    ) {
      return "comparaison";
    }

    if (
      contientUn(t, [
        "poids",
        "combien pese",
        "weight",
        "how heavy",
        "how much does it weigh",
      ])
    ) {
      return "poids";
    }

    if (
      contientUn(t, [
        "conditionnement",
        "format",
        "contenance",
        "unite par pack",
        "unites par pack",
        "pack de combien",
        "combien par pack",
        "packaging",
        "package size",
        "pack size",
        "units per pack",
        "size of the pack",
      ])
    ) {
      return "conditionnement";
    }

    if (
      contientUn(t, [
        "note",
        "notation",
        "avis",
        "evaluation",
        "etoiles",
        "rating",
        "review",
        "reviews",
        "stars",
        "customer feedback",
      ])
    ) {
      return "note";
    }
    if (
      contientUn(t, [
        "ingredient",
        "ingredients",
        "composition",
        "compose",
        "composant",
        "composants",
        "matiere premiere",
        "matieres premieres",
        "de quoi est fait",
        "de quoi est compose",
        "what ingredients",
        "ingredients list",
        "what is it made of",
        "what is this made of",
        "composition of",
        "raw materials",
        "contains",
        "what does it contain",
      ])
    ) {
      return "ingredients";
    }
    if (
      contientUn(t, [
        "prix",
        "combien coute",
        "combien ca coute",
        "tarif",
        "tarifs",
        "cout",
        "cher",
        "moins cher",
        "price",
        "prices",
        "how much",
        "cost",
        "costs",
        "expensive",
        "cheap",
      ])
    ) {
      return "prix";
    }

    if (
      contientUn(t, [
        "vos produits",
        "les produits",
        "liste des produits",
        "catalogue",
        "que vendez vous",
        "que vendez vous",
        "quels produits",
        "produits disponibles",
        "product list",
        "list products",
        "show products",
        "show me your products",
        "what products",
        "which products",
        "what do you sell",
        "your products",
        "catalog",
        "catalogue",
      ])
    ) {
      return "liste_produits";
    }

    if (
      contientUn(t, [
        "societe",
        "entreprise",
        "sainto",
        "qui etes vous",
        "a propos",
        "votre adresse",
        "vos coordonnees",
        "contact",
        "telephone",
        "email",
        "adresse",
        "horaire",
        "horaires",
        "livraison",
        "livrez vous",
        "paiement",
        "moyens de paiement",
        "company",
        "business",
        "about you",
        "about sainto",
        "your company",
        "your address",
        "contact details",
        "phone number",
        "opening hours",
        "business hours",
        "delivery",
        "shipping",
        "payment methods",
        "where are you located",
      ])
    ) {
      return "societe";
    }

    // On traite les formulations courtes comme "bonjour" et "help"
    // plus haut. Le reste sera analysé par la recherche de produit.
    return "inconnue";
  };

  const trouverProduits = (texte: string): ProduitMado[] => {
    const t = normaliser(texte);

    if (!t) return [];

    return produits.filter((produit) => {
      const nom = normaliser(produit.name);

      return nom.length > 0 && (t.includes(nom) || nom.includes(t));
    });
  };

  const repondreSociete = (texte: string, langue: Langue): string => {
    const t = normaliser(texte);

    const informations: Array<{
      mots: string[];
      valeur: string;
      libelleFr: string;
      libelleEn: string;
    }> = [
      {
        mots: ["telephone", "phone number", "phone"],
        valeur: SOCIETE.telephone,
        libelleFr: "Téléphone",
        libelleEn: "Phone",
      },
      {
        mots: ["email", "e-mail", "courriel"],
        valeur: SOCIETE.email,
        libelleFr: "E-mail",
        libelleEn: "Email",
      },
      {
        mots: ["adresse", "address", "where are you located"],
        valeur: SOCIETE.adresse,
        libelleFr: "Adresse",
        libelleEn: "Address",
      },
      {
        mots: ["horaire", "horaires", "opening hours", "business hours"],
        valeur: SOCIETE.horaires,
        libelleFr: "Horaires",
        libelleEn: "Opening hours",
      },
      {
        mots: ["livraison", "livrez vous", "delivery", "shipping"],
        valeur: SOCIETE.livraison,
        libelleFr: "Livraison",
        libelleEn: "Delivery",
      },
      {
        mots: ["paiement", "payment", "payment methods"],
        valeur: SOCIETE.paiement,
        libelleFr: "Paiement",
        libelleEn: "Payment",
      },
      {
        mots: ["site", "website"],
        valeur: SOCIETE.site,
        libelleFr: "Site web",
        libelleEn: "Website",
      },
    ];

    const information = informations.find((item) =>
      item.mots.some((mot) => t.includes(normaliser(mot))),
    );

    if (information) {
      if (information.valeur.trim()) {
        const libelle =
          langue === "fr" ? information.libelleFr : information.libelleEn;

        return `**${libelle} :** ${information.valeur}`;
      }

      return langue === "fr"
        ? "Je ne dispose pas encore d'une information vérifiée à ce sujet. Veuillez consulter les coordonnées officielles de Sainto sur le site."
        : "I don't have verified information about that yet. Please check Sainto's official website for the correct details.";
    }

    return langue === "fr"
      ? `Je suis l'assistant virtuel de **${SOCIETE.nom}**. Je peux vous renseigner sur les produits affichés sur ce site. Pour les autres informations sur l'entreprise, je préfère ne pas donner de renseignements non vérifiés.`
      : `I'm the virtual assistant for **${SOCIETE.nom}**. I can provide information about the products listed on this website. For other company details, I don't want to provide unverified information.`;
  };

  const repondreProduit = (
    produit: ProduitMado,
    intention: Intention,
    langue: Langue,
  ): string => {
    const nom = produit.name;
    const prix = formaterPrix(produit.price);
    const poids = formaterPoids(produit.poid);
    const note =
      Number.isFinite(produit.rate) && produit.rate > 0
        ? `${produit.rate.toLocaleString("fr-FR")}/5`
        : langue === "fr"
          ? "Aucune note disponible"
          : "No rating available";

    const conditionnement = produit.is_unite
      ? langue === "fr"
        ? "Vendu à l'unité"
        : "Sold individually"
      : produit.nb_unite_in_pack != null
        ? langue === "fr"
          ? `${produit.nb_unite_in_pack} unité(s) par pack`
          : `${produit.nb_unite_in_pack} unit(s) per pack`
        : langue === "fr"
          ? "Conditionnement non précisé"
          : "Packaging information unavailable";

    switch (intention) {
      case "prix":
        return langue === "fr"
          ? `Le prix de **${nom}** est de **${prix}**.`
          : `The price of **${nom}** is **${prix}**.`;

      case "poids":
        return langue === "fr"
          ? `Le poids indiqué pour **${nom}** est de **${poids}**.`
          : `The listed weight of **${nom}** is **${poids}**.`;

      case "conditionnement":
        return langue === "fr"
          ? `**${nom}** : ${conditionnement}.`
          : `**${nom}**: ${conditionnement}.`;

      case "note":
        return langue === "fr"
          ? `La note enregistrée pour **${nom}** est de **${note}**.`
          : `The recorded rating for **${nom}** is **${note}**.`;

      default:
        return langue === "fr"
          ? [
              `### ${nom}`,
              `- **Prix :** ${prix}`,
              `- **Poids :** ${poids}`,
              `- **Conditionnement :** ${conditionnement}`,
              `- **Note :** ${note}`,
            ].join("\n")
          : [
              `### ${nom}`,
              `- **Price:** ${prix}`,
              `- **Weight:** ${poids}`,
              `- **Packaging:** ${conditionnement}`,
              `- **Rating:** ${note}`,
            ].join("\n");
    }
  };

  const repondre = (texte: string): string => {
    const langue: Langue = estAnglais(texte) ? "en" : "fr";
    const t = normaliser(texte);
    const intention = reconnaitreIntention(texte, langue);
    const correspondances = trouverProduits(texte);

    // Un produit explicitement cité a priorité sur les questions générales.
    if (correspondances.length === 1) {
      return repondreProduit(correspondances[0], intention, langue);
    }
    if (intention === "ingredients") {
      return repondreIngredients(texte, langue);
    }
    if (intention === "salutation") {
      return langue === "fr"
        ? "Bonjour 👋 Bienvenue chez Sainto ! Je peux vous renseigner sur nos produits, leurs prix, leurs poids et leurs conditionnements."
        : "Hello 👋 Welcome to Sainto! I can help you with our products, prices, weights, and packaging.";
    }

    if (intention === "remerciement") {
      return langue === "fr"
        ? "Avec plaisir ! 😊 Avez-vous une question sur un produit Sainto ?"
        : "You're welcome! 😊 Do you have a question about a Sainto product?";
    }

    if (intention === "au_revoir") {
      return langue === "fr"
        ? "Au revoir et merci de votre visite ! 👋"
        : "Goodbye, and thank you for visiting! 👋";
    }

    if (intention === "aide") {
      return langue === "fr"
        ? [
            "Je peux vous aider avec :",
            "- La liste des produits",
            "- Les prix",
            "- Le poids et le conditionnement",
            "- Les notes disponibles",
            "- Les informations connues sur Sainto",
            "- Les instructions pour passer commande",
            "",
            "Vous pouvez par exemple écrire : **Quel est le prix de [nom du produit] ?**",
          ].join("\n")
        : [
            "I can help you with:",
            "- The product list",
            "- Prices",
            "- Weight and packaging",
            "- Available ratings",
            "- Known information about Sainto",
            "- How to place an order",
            "",
            "For example: **What is the price of [product name]?**",
          ].join("\n");
    }

    if (intention === "liste_produits") {
      if (erreurProduits) {
        return langue === "fr"
          ? "Je n'arrive pas à charger le catalogue pour le moment. Veuillez réessayer plus tard."
          : "I can't load the product catalog right now. Please try again later.";
      }

      if (!produitsCharges) {
        return langue === "fr"
          ? "Le catalogue est en cours de chargement. Veuillez réessayer dans un instant."
          : "The product catalog is loading. Please try again in a moment.";
      }

      if (produits.length === 0) {
        return langue === "fr"
          ? "Aucun produit n'est actuellement disponible dans le catalogue."
          : "There are currently no products in the catalog.";
      }

      const liste = produits
        .slice(0, 15)
        .map((p) => `- **${p.name}** — ${formaterPrix(p.price)}`)
        .join("\n");

      const suite =
        produits.length > 15
          ? langue === "fr"
            ? `\n\nEt ${produits.length - 15} autre(s) produit(s).`
            : `\n\nAnd ${produits.length - 15} more product(s).`
          : "";

      return langue === "fr"
        ? `Voici les produits du catalogue :\n\n${liste}${suite}\n\nVous pouvez demander le prix ou les caractéristiques d'un produit précis.`
        : `Here are the products in the catalog:\n\n${liste}${suite}\n\nYou can ask for the price or details of a specific product.`;
    }

    if (intention === "societe") {
      return repondreSociete(texte, langue);
    }

    if (intention === "commande") {
      return langue === "fr"
        ? "Pour passer commande, utilisez le bouton **« Nos produits »** sur le site et suivez les étapes affichées. Je peux vous renseigner sur les produits, mais je ne peux pas valider une commande depuis cette conversation."
        : "To place an order, use the **“Our products”** button on the website and follow the steps shown. I can provide product information, but I can't place or confirm an order from this chat.";
    }

    if (intention === "comparaison") {
      if (correspondances.length >= 2) {
        return langue === "fr"
          ? correspondances
              .map(
                (p) =>
                  `**${p.name}**\n- Prix : ${formaterPrix(p.price)}\n- Poids : ${formaterPoids(p.poid)}`,
              )
              .join("\n\n")
          : correspondances
              .map(
                (p) =>
                  `**${p.name}**\n- Price: ${formaterPrix(p.price)}\n- Weight: ${formaterPoids(p.poid)}`,
              )
              .join("\n\n");
      }

      return langue === "fr"
        ? "Pour comparer deux produits, indiquez leurs noms, par exemple : **Compare [produit A] et [produit B]**."
        : "To compare two products, tell me their names, for example: **Compare [product A] and [product B]**.";
    }

    if (
      intention === "prix" ||
      intention === "poids" ||
      intention === "conditionnement" ||
      intention === "note"
    ) {
      return langue === "fr"
        ? "De quel produit parlez-vous ? Écrivez son nom pour que je puisse vous donner les informations disponibles."
        : "Which product are you asking about? Enter its name so I can provide the available information.";
    }

    // Recherche d'un nom de produit même si la question est formulée
    // d'une manière que les règles d'intention ne connaissent pas.
    if (correspondances.length > 1) {
      return langue === "fr"
        ? `Plusieurs produits correspondent à votre demande :\n\n${correspondances
            .slice(0, 10)
            .map((p) => `- **${p.name}** — ${formaterPrix(p.price)}`)
            .join("\n")}\n\nPrécisez le produit qui vous intéresse.`
        : `Several products match your request:\n\n${correspondances
            .slice(0, 10)
            .map((p) => `- **${p.name}** — ${formaterPrix(p.price)}`)
            .join("\n")}\n\nPlease specify which product you're interested in.`;
    }

    // Le catalogue peut être indisponible même si l'utilisateur a cité
    // un nom de produit : ne jamais inventer de caractéristiques.
    if (
      erreurProduits &&
      /\b(prix|price|product|produit|catalogue|catalog)\b/.test(t)
    ) {
      return langue === "fr"
        ? "Le catalogue est temporairement indisponible. Je ne peux pas vérifier les informations demandées."
        : "The product catalog is temporarily unavailable. I can't verify the requested information.";
    }

    return reponseErreurInconnue(langue);
  };

  const repondreIngredients = (texte: string, langue: Langue): string => {
    const t = normaliser(texte);

    const parleIceTea = contientUn(t, [
      "ice tea",
      "iced tea",
      "the glace",
      "the glaces",
      "boisson au the",
      "boissons au the",
    ]);

    if (parleIceTea) {
      return langue === "fr"
        ? "Nos Ice Tea sont des boissons principalement composées d'ingrédients naturels et frais. 🍃 Pour obtenir la liste exacte des ingrédients d'une référence précise, veuillez consulter les informations figurant sur son emballage."
        : "Our Ice Tea drinks are primarily made with natural and fresh ingredients. 🍃 For the exact ingredient list of a specific product, please check the information on its packaging.";
    }

    return langue === "fr"
      ? "Les ingrédients et les matières premières de nos produits proviennent principalement de la montagne d'Iharanandriana, à Morarano, au PK 38 sur la route d'Antsirabe. 🌿 Pour connaître la composition exacte d'un produit, veuillez consulter son emballage."
      : "The ingredients and raw materials used in our products are sourced mainly from the mountain of Iharanandriana, in Morarano, at kilometer 38 on the road to Antsirabe. 🌿 For the exact composition of a product, please check its packaging.";
  };

  const envoyerMessage = (texte: string) => {
    const contenu = texte.trim();

    if (!contenu || enChargement) return;

    ajouterMessages([
      {
        auteur: "utilisateur",
        texte: contenu,
      },
    ]);

    setSaisie("");

    // Les règles sont exécutées localement, sans appel HTTP.
    setEnChargement(true);

    try {
      const resultat = repondre(contenu);

      ajouterMessages([
        {
          auteur: "assistant",
          texte: resultat,
        },
      ]);
    } catch {
      ajouterMessages([
        {
          auteur: "assistant",
          texte:
            "Désolé, je n'ai pas pu traiter cette demande. Veuillez reformuler votre question.",
        },
      ]);
    } finally {
      setEnChargement(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background",
        "md:inset-auto md:bottom-6 md:left-6 md:h-[560px] md:w-[380px]",
        "md:rounded-2xl md:border md:shadow-2xl",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
      )}
    >
      <div className="relative shrink-0 overflow-hidden rounded-t-none bg-blue-500 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:rounded-t-2xl">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
              <FontAwesomeIcon icon={faRobot} className="text-white" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-white">Assistant Sainto</span>
              <span className="flex items-center gap-1.5 text-xs text-white/80">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    erreurProduits ? "bg-amber-300" : "bg-emerald-400",
                  )}
                />
                {erreurProduits
                  ? "Catalogue indisponible"
                  : !produitsCharges
                    ? "Chargement du catalogue…"
                    : "En ligne"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-white hover:bg-white/15 hover:text-white"
              onClick={fermerAssistant}
              aria-label="Réduire l'assistant"
            >
              <FontAwesomeIcon icon={faMinus} className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-white hover:bg-white/15 hover:text-white"
              onClick={fermerAssistant}
              aria-label="Fermer l'assistant"
            >
              <FontAwesomeIcon icon={faXmark} className="size-4" />
            </Button>
          </div>
        </div>

        <svg
          className="absolute -bottom-px left-0 w-full text-background"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0 16c50-12 100-12 150 0s100 12 150 0 100-12 100-12V24H0Z"
          />
        </svg>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.auteur === "utilisateur"
                ? "justify-end"
                : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                message.auteur === "utilisateur"
                  ? "rounded-br-sm bg-blue-500 text-white"
                  : "rounded-bl-sm bg-muted text-foreground",
              )}
            >
              {message.auteur === "assistant" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-2 list-disc space-y-1 pl-5">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-2 list-decimal space-y-1 pl-5">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    h1: ({ children }) => (
                      <h1 className="mb-2 text-lg font-bold">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-2 text-base font-bold">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-1 font-semibold">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-black/10 px-1 py-0.5 text-xs">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.texte}
                </ReactMarkdown>
              ) : (
                message.texte
              )}
            </div>
          </div>
        ))}

        {enChargement && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
              <span className="size-1.5 animate-bounce rounded-full bg-foreground/40" />
              <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => envoyerMessage(suggestion)}
                className="rounded-full border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div ref={finDesMessages} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          envoyerMessage(saisie);
        }}
        className="flex shrink-0 items-center gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <span className="hidden shrink-0 sm:flex">
          <FontAwesomeIcon icon={faDroplet} className="text-blue-500/40" />
        </span>
        <Input
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="Écrivez votre message… / Type your message…"
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          className="shrink-0 bg-blue-500 hover:bg-blue-800"
          disabled={!saisie.trim() || enChargement}
          aria-label="Envoyer"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="size-3.5" />
        </Button>
      </form>
    </div>
  );
};
