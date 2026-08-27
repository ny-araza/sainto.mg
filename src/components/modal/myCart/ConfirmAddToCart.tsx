import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/animate-ui/components/headless/dialog";

import { Minus, Plus, ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";

function formatAriary(montant: number) {
  return `${montant.toLocaleString("fr-FR")} Ar`;
}

export const ConfirmAddToCart = () => {
  const { produitEnCours, isConfirmOpen, confirmerAjout, annulerAjout } =
    useCart();

  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    if (isConfirmOpen) {
      setQuantite(1);
    }
  }, [isConfirmOpen]);

  if (!produitEnCours) return null;

  const total = produitEnCours.price * quantite;

  return (
    <Dialog open={isConfirmOpen} onClose={annulerAjout}>
      <DialogPanel showCloseButton className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-blue-500" />
            Ajouter au panier
          </DialogTitle>

          <DialogDescription>
            Choisissez la quantité souhaitée.
          </DialogDescription>
        </DialogHeader>

        {/* Produit */}
        <div className="flex items-center gap-4 rounded-lg border p-3">
          {produitEnCours.path && (
            <img
              src={produitEnCours.path}
              alt={produitEnCours.name}
              className="
                size-16
                rounded-md
                object-cover
              "
            />
          )}

          <div className="flex flex-1 flex-col">
            <span className="font-semibold">{produitEnCours.name}</span>

            <span className="text-sm text-muted-foreground">
              {formatAriary(produitEnCours.price)} / unité
            </span>
          </div>
        </div>

        {/* Quantité */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium">Quantité</span>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            >
              <Minus className="size-4" />
            </Button>

            <Input
              type="number"
              min={1}
              value={quantite}
              onChange={(e) => {
                const valeur = parseInt(e.target.value, 10);

                if (!Number.isNaN(valeur)) {
                  setQuantite(Math.max(1, valeur));
                }
              }}
              className="w-16 text-center"
            />

            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantite((q) => q + 1)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 flex justify-between border-t pt-4">
          <span className="font-medium">Total</span>

          <span className="font-bold text-blue-500">{formatAriary(total)}</span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={annulerAjout}>
            Annuler
          </Button>

          <Button
            className="bg-blue-500 hover:bg-blue-800"
            onClick={() => confirmerAjout(quantite)}
          >
            <ShoppingCart className="mr-2 size-4" />
            Ajouter au panier
          </Button>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
};
