// import {
//   createContext,
//   useContext,
//   useState,
//   useMemo,
//   type ReactNode,
// } from "react";

// export interface FlipCardData {
//   id: number;
//   name: string;
//   price: number;
//   rate?: number;
//   path?: string;
// }

// export interface FlipCardData extends Produit {
//   quantite: number;
// }

// interface CartContextValue {
//   panier: FlipCardData[];
//   ajouterAuPanier: (produit: Produit) => void;
//   modifierQuantite: (id: number, delta: number) => void;
//   definirQuantite: (id: number, valeur: number) => void;
//   supprimerDuPanier: (id: number) => void;
//   viderPanier: () => void;
//   nombreArticles: number;
//   totalPanier: number;
//   isOpen: boolean;
//   ouvrirPanier: () => void;
//   fermerPanier: () => void;
// }

// const CartContext = createContext<CartContextValue | undefined>(undefined);

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [panier, setPanier] = useState<FlipCardData[]>([]);
//   const [isOpen, setIsOpen] = useState(false);

//   const ajouterAuPanier = (produit: Produit) => {
//     setPanier((prev) => {
//       const existant = prev.find((l) => l.id === produit.id);
//       if (existant) {
//         return prev.map((l) =>
//           l.id === produit.id ? { ...l, quantite: l.quantite + 1 } : l,
//         );
//       }
//       return [...prev, { ...produit, quantite: 1 }];
//     });
//     setIsOpen(true); // ouvre le panier automatiquement à l'ajout
//   };

//   const modifierQuantite = (id: number, delta: number) => {
//     setPanier((prev) =>
//       prev
//         .map((l) => (l.id === id ? { ...l, quantite: l.quantite + delta } : l))
//         .filter((l) => l.quantite > 0),
//     );
//   };

//   const definirQuantite = (id: number, valeur: number) => {
//     if (Number.isNaN(valeur)) return;
//     setPanier((prev) =>
//       prev
//         .map((l) => (l.id === id ? { ...l, quantite: valeur } : l))
//         .filter((l) => l.quantite > 0),
//     );
//   };

//   const supprimerDuPanier = (id: number) =>
//     setPanier((prev) => prev.filter((l) => l.id !== id));

//   const viderPanier = () => setPanier([]);

//   const nombreArticles = useMemo(
//     () => panier.reduce((acc, l) => acc + l.quantite, 0),
//     [panier],
//   );
//   const totalPanier = useMemo(
//     () => panier.reduce((acc, l) => acc + l.price * l.quantite, 0),
//     [panier],
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         panier,
//         ajouterAuPanier,
//         modifierQuantite,
//         definirQuantite,
//         supprimerDuPanier,
//         viderPanier,
//         nombreArticles,
//         totalPanier,
//         isOpen,
//         ouvrirPanier: () => setIsOpen(true),
//         fermerPanier: () => setIsOpen(false),
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
//   return ctx;
// };

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

export interface Produit {
  id: number;
  name: string;
  price: number;
  rate?: number;
  path?: string;
}

export interface ProduitPanier extends Produit {
  quantite: number;
}

interface CartContextValue {
  panier: ProduitPanier[];

  // Demande d'ajout
  demanderAjout: (produit: Produit) => void;

  // Confirmation réelle
  confirmerAjout: (quantite: number) => void;

  // Annulation
  annulerAjout: () => void;

  produitEnCours: Produit | null;

  isConfirmOpen: boolean;

  modifierQuantite: (id: number, delta: number) => void;
  definirQuantite: (id: number, valeur: number) => void;
  supprimerDuPanier: (id: number) => void;
  viderPanier: () => void;

  nombreArticles: number;
  totalPanier: number;

  // Panier
  isOpen: boolean;
  ouvrirPanier: () => void;
  fermerPanier: () => void;

  // Notification
  messageAjout: string | null;
  fermerMessageAjout: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [panier, setPanier] = useState<ProduitPanier[]>([]);

  // Panier
  const [isOpen, setIsOpen] = useState(false);

  // Produit en attente de confirmation
  const [produitEnCours, setProduitEnCours] = useState<Produit | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Notification
  const [messageAjout, setMessageAjout] = useState<string | null>(null);

  /**
   * Ouvre le modal de confirmation
   */
  const demanderAjout = (produit: Produit) => {
    setProduitEnCours(produit);
    setIsConfirmOpen(true);
  };

  /**
   * Ajoute réellement le produit après confirmation
   */
  const confirmerAjout = (quantite: number) => {
    if (!produitEnCours || quantite < 1) return;

    setPanier((prev) => {
      const existant = prev.find((ligne) => ligne.id === produitEnCours.id);

      if (existant) {
        return prev.map((ligne) =>
          ligne.id === produitEnCours.id
            ? {
                ...ligne,
                quantite: ligne.quantite + quantite,
              }
            : ligne,
        );
      }

      return [
        ...prev,
        {
          ...produitEnCours,
          quantite,
        },
      ];
    });

    // Ferme uniquement le modal de confirmation
    setIsConfirmOpen(false);

    // Message
    setMessageAjout(`${produitEnCours.name} a été ajouté au panier`);

    // Nettoyage
    setProduitEnCours(null);

    // Ferme automatiquement le message après 3 secondes
    setTimeout(() => {
      setMessageAjout(null);
    }, 3000);
  };

  /**
   * Annuler l'ajout
   */
  const annulerAjout = () => {
    setProduitEnCours(null);
    setIsConfirmOpen(false);
  };

  const modifierQuantite = (id: number, delta: number) => {
    setPanier((prev) =>
      prev
        .map((ligne) =>
          ligne.id === id
            ? {
                ...ligne,
                quantite: ligne.quantite + delta,
              }
            : ligne,
        )
        .filter((ligne) => ligne.quantite > 0),
    );
  };

  const definirQuantite = (id: number, valeur: number) => {
    if (Number.isNaN(valeur)) return;

    setPanier((prev) =>
      prev
        .map((ligne) =>
          ligne.id === id
            ? {
                ...ligne,
                quantite: valeur,
              }
            : ligne,
        )
        .filter((ligne) => ligne.quantite > 0),
    );
  };

  const supprimerDuPanier = (id: number) => {
    setPanier((prev) => prev.filter((ligne) => ligne.id !== id));
  };

  const viderPanier = () => {
    setPanier([]);
  };

  const nombreArticles = useMemo(
    () => panier.reduce((total, ligne) => total + ligne.quantite, 0),
    [panier],
  );

  const totalPanier = useMemo(
    () =>
      panier.reduce((total, ligne) => total + ligne.price * ligne.quantite, 0),
    [panier],
  );

  return (
    <CartContext.Provider
      value={{
        panier,

        demanderAjout,
        confirmerAjout,
        annulerAjout,

        produitEnCours,
        isConfirmOpen,

        modifierQuantite,
        definirQuantite,
        supprimerDuPanier,
        viderPanier,

        nombreArticles,
        totalPanier,

        isOpen,
        ouvrirPanier: () => setIsOpen(true),
        fermerPanier: () => setIsOpen(false),

        messageAjout,
        fermerMessageAjout: () => setMessageAjout(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }

  return ctx;
};
