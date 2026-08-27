import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/animate-ui/components/headless/dialog";

import { Input } from "@/components/ui/input";

import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

import { useCart } from "@/context/CartContext";

import { createClient, validateCartLikes } from "@/services/productService";

function formatAriary(montant: number) {
  return `${montant.toLocaleString("fr-FR")} Ar`;
}

export const MyChart = () => {
  const {
    panier,
    modifierQuantite,
    definirQuantite,
    supprimerDuPanier,
    viderPanier,
    nombreArticles,
    totalPanier,
    isOpen,
    fermerPanier,
  } = useCart();

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  /**
   * Clique sur "Valider le panier"
   */
  const validerPanier = () => {
    if (panier.length === 0) return;

    setEmailDialogOpen(true);
  };

  /**
   * Enregistre le client et les likes
   */
  const terminerCommande = async (clientEmail: string | null) => {
    try {
      setLoading(true);

      // 1. Créer le client
      const client = await createClient(clientEmail);

      // 2. Créer les likes selon les quantités
      await validateCartLikes(client.id, panier);

      console.log("Commande validée", panier);

      // 3. Vider le panier
      viderPanier();

      // 4. Fermer les dialogs
      setEmailDialogOpen(false);
      fermerPanier();

      // Réinitialiser l'email
      setEmail("");
    } catch (error) {
      console.error("Erreur lors de la validation :", error);

      alert("Une erreur est survenue lors de la validation de votre commande.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Client accepte de donner son email
   */
  const envoyerEmail = async () => {
    if (!email.trim()) {
      return;
    }

    await terminerCommande(email.trim());
  };

  /**
   * Client refuse de donner son email
   */


  return (
    <>
      {/* ========================= */}
      {/* PANIER */}
      {/* ========================= */}

      <Dialog open={isOpen} onClose={fermerPanier}>
        <DialogPanel showCloseButton className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              Panier ({nombreArticles})
            </DialogTitle>

            <DialogDescription>
              Modifiez les quantités ou validez votre commande.
            </DialogDescription>
          </DialogHeader>

          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
            {panier.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Votre panier est vide.
              </p>
            )}

            {panier.map((ligne) => (
              <div
                key={ligne.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-2
                  rounded-md
                  border
                  px-3
                  py-2
                "
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{ligne.name}</span>

                  <span className="text-muted-foreground text-xs">
                    {formatAriary(ligne.price)} / unité
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    onClick={() => modifierQuantite(ligne.id, -1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>

                  <Input
                    type="number"
                    min={1}
                    value={ligne.quantite}
                    onChange={(e) =>
                      definirQuantite(ligne.id, parseInt(e.target.value, 10))
                    }
                    className="
                      h-7
                      w-14
                      px-1
                      text-center
                    "
                  />

                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    onClick={() => modifierQuantite(ligne.id, 1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="
                      text-destructive
                      size-7
                    "
                    onClick={() => supprimerDuPanier(ligne.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div
            className="
            flex
            items-center
            justify-between
            border-t
            pt-2
            text-sm
            font-semibold
          "
          >
            <span>
              Total ({nombreArticles} article
              {nombreArticles > 1 ? "s" : ""})
            </span>

            <span>{formatAriary(totalPanier)}</span>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={viderPanier}
              disabled={panier.length === 0 || loading}
            >
              Vider le panier
            </Button>

            <Button
              onClick={validerPanier}
              disabled={panier.length === 0 || loading}
            >
              Valider le panier
            </Button>
          </DialogFooter>
        </DialogPanel>
      </Dialog>

      {/* ========================= */}
      {/* DEMANDE EMAIL */}
      {/* ========================= */}

      <Dialog
        open={emailDialogOpen}
        onClose={() => !loading && setEmailDialogOpen(false)}
      >
        <DialogPanel className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Avant de continuer</DialogTitle>

            <DialogDescription>
              Veuillez entrer votre email ou tel pour nous permettre de vous contacter lors des livraisons
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              type="text"
              placeholder="N° tel ou email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button onClick={envoyerEmail} disabled={loading || !email.trim()}>
              {loading ? "Validation..." : "Continuer"}
            </Button>
          </DialogFooter>
        </DialogPanel>
      </Dialog>
    </>
  );
};
