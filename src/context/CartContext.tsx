import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

export interface FlipCardData {
  id: number;
  name: string;
  price: number;
  rate?: number;
  path?: string;
}

export interface FlipCardData extends Produit {
  quantite: number;
}

interface CartContextValue {
  panier: FlipCardData[];
  ajouterAuPanier: (produit: Produit) => void;
  modifierQuantite: (id: number, delta: number) => void;
  definirQuantite: (id: number, valeur: number) => void;
  supprimerDuPanier: (id: number) => void;
  viderPanier: () => void;
  nombreArticles: number;
  totalPanier: number;
  isOpen: boolean;
  ouvrirPanier: () => void;
  fermerPanier: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [panier, setPanier] = useState<FlipCardData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const ajouterAuPanier = (produit: Produit) => {
    setPanier((prev) => {
      const existant = prev.find((l) => l.id === produit.id);
      if (existant) {
        return prev.map((l) =>
          l.id === produit.id ? { ...l, quantite: l.quantite + 1 } : l,
        );
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
    setIsOpen(true); // ouvre le panier automatiquement à l'ajout
  };

  const modifierQuantite = (id: number, delta: number) => {
    setPanier((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, quantite: l.quantite + delta } : l))
        .filter((l) => l.quantite > 0),
    );
  };

  const definirQuantite = (id: number, valeur: number) => {
    if (Number.isNaN(valeur)) return;
    setPanier((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, quantite: valeur } : l))
        .filter((l) => l.quantite > 0),
    );
  };

  const supprimerDuPanier = (id: number) =>
    setPanier((prev) => prev.filter((l) => l.id !== id));

  const viderPanier = () => setPanier([]);

  const nombreArticles = useMemo(
    () => panier.reduce((acc, l) => acc + l.quantite, 0),
    [panier],
  );
  const totalPanier = useMemo(
    () => panier.reduce((acc, l) => acc + l.price * l.quantite, 0),
    [panier],
  );

  return (
    <CartContext.Provider
      value={{
        panier,
        ajouterAuPanier,
        modifierQuantite,
        definirQuantite,
        supprimerDuPanier,
        viderPanier,
        nombreArticles,
        totalPanier,
        isOpen,
        ouvrirPanier: () => setIsOpen(true),
        fermerPanier: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
};
