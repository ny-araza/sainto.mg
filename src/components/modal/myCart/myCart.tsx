// import { useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogPanel,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   type DialogPanelProps,
// } from "@/components/animate-ui/components/headless/dialog";
// import { Input } from "@/components/ui/input";
// import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Produit {
//   id: string;
//   nom: string;
//   prix: number; // en Ariary
// }

// interface LigneCart extends Produit {
//   quantite: number;
// }

// interface HeadlessDialogDemoProps {
//   from: DialogPanelProps["from"];
//   showCloseButton: boolean;
//   open: boolean;
//   onCLose: () => void;
// }

// // À remplacer par vos vraies données produits (API / props)
// const PRODUITS_DISPONIBLES: Produit[] = [
//   { id: "1", nom: "Paracétamol 500mg", prix: 2000 },
//   { id: "2", nom: "Amoxicilline 500mg", prix: 8500 },
//   { id: "3", nom: "Sirop toux", prix: 6000 },
//   { id: "4", nom: "Vitamine C", prix: 3500 },
//   { id: "5", nom: "Alcool 90°", prix: 4200 },
//   { id: "6", nom: "Compresses stériles", prix: 1800 },
// ];

// function formatAriary(montant: number) {
//   return `${montant.toLocaleString("fr-FR")} Ar`;
// }

// export const MyChart = ({
//   from,
//   showCloseButton,
//   open,
//   onCLose,
// }: HeadlessDialogDemoProps) => {
//   const [panier, setPanier] = useState<LigneCart[]>([]);

//   const nombreArticles = useMemo(
//     () => panier.reduce((acc, ligne) => acc + ligne.quantite, 0),
//     [panier],
//   );

//   const totalPanier = useMemo(
//     () => panier.reduce((acc, ligne) => acc + ligne.prix * ligne.quantite, 0),
//     [panier],
//   );

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
//   };

//   const modifierQuantite = (id: string, delta: number) => {
//     setPanier((prev) =>
//       prev
//         .map((l) => (l.id === id ? { ...l, quantite: l.quantite + delta } : l))
//         .filter((l) => l.quantite > 0),
//     );
//   };

//   const definirQuantite = (id: string, valeur: number) => {
//     if (Number.isNaN(valeur)) return;
//     setPanier((prev) =>
//       prev
//         .map((l) => (l.id === id ? { ...l, quantite: valeur } : l))
//         .filter((l) => l.quantite > 0),
//     );
//   };

//   const supprimerDuPanier = (id: string) => {
//     setPanier((prev) => prev.filter((l) => l.id !== id));
//   };

//   const viderPanier = () => setPanier([]);

//   const validerPanier = () => {
//     if (panier.length === 0) return;
//     // TODO: appel API pour enregistrer la vente/commande
//     console.log("Panier validé :", panier, "Total :", totalPanier);
//     viderPanier();
//     onCLose();
//   };

//   return (
//     <div>
//       <Dialog open={open} onClose={onCLose}>
//         <DialogPanel
//           from={from}
//           showCloseButton={showCloseButton}
//           className="sm:max-w-[700px]"
//         >
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <ShoppingCart className="size-5" />
//               Panier
//             </DialogTitle>
//             <DialogDescription>
//               Cliquez sur un produit pour l&apos;ajouter au panier, puis validez
//               votre commande.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-4 sm:grid-cols-2">
//             {/* Liste des produits disponibles */}
//             <div className="flex flex-col gap-2">
//               <span className="text-sm font-medium">Produits disponibles</span>
//               <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
//                 {PRODUITS_DISPONIBLES.map((produit) => (
//                   <button
//                     key={produit.id}
//                     type="button"
//                     onClick={() => ajouterAuPanier(produit)}
//                     className={cn(
//                       "flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
//                       "hover:bg-accent hover:text-accent-foreground",
//                     )}
//                   >
//                     <span>{produit.nom}</span>
//                     <span className="text-muted-foreground">
//                       {formatAriary(produit.prix)}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Contenu du panier */}
//             <div className="flex flex-col gap-2">
//               <span className="text-sm font-medium">
//                 Dans le panier ({nombreArticles})
//               </span>
//               <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
//                 {panier.length === 0 && (
//                   <p className="text-muted-foreground text-sm">
//                     Aucun produit ajouté pour le moment.
//                   </p>
//                 )}
//                 {panier.map((ligne) => (
//                   <div
//                     key={ligne.id}
//                     className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
//                   >
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium">{ligne.nom}</span>
//                       <span className="text-muted-foreground text-xs">
//                         {formatAriary(ligne.prix)} / unité
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-1">
//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="outline"
//                         className="size-7"
//                         onClick={() => modifierQuantite(ligne.id, -1)}
//                       >
//                         <Minus className="size-3.5" />
//                       </Button>

//                       <Input
//                         type="number"
//                         min={1}
//                         value={ligne.quantite}
//                         onChange={(e) =>
//                           definirQuantite(
//                             ligne.id,
//                             parseInt(e.target.value, 10),
//                           )
//                         }
//                         className="h-7 w-14 text-center px-1"
//                       />

//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="outline"
//                         className="size-7"
//                         onClick={() => modifierQuantite(ligne.id, 1)}
//                       >
//                         <Plus className="size-3.5" />
//                       </Button>

//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="ghost"
//                         className="text-destructive size-7"
//                         onClick={() => supprimerDuPanier(ligne.id)}
//                       >
//                         <Trash2 className="size-3.5" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm font-semibold">
//                 <span>
//                   Total ({nombreArticles} article{nombreArticles > 1 ? "s" : ""}
//                   )
//                 </span>
//                 <span>{formatAriary(totalPanier)}</span>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={viderPanier}
//               disabled={panier.length === 0}
//             >
//               Vider le panier
//             </Button>
//             <Button onClick={validerPanier} disabled={panier.length === 0}>
//               Valider le panier
//             </Button>
//           </DialogFooter>
//         </DialogPanel>
//       </Dialog>
//     </div>
//   );
// };

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

  const validerPanier = () => {
    if (panier.length === 0) return;
    // TODO: appel API vente
    console.log("Panier validé :", panier, "Total :", totalPanier);
    viderPanier();
    fermerPanier();
  };

  return (
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
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
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
                  className="h-7 w-14 px-1 text-center"
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
                  className="text-destructive size-7"
                  onClick={() => supprimerDuPanier(ligne.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
          <span>
            Total ({nombreArticles} article{nombreArticles > 1 ? "s" : ""})
          </span>
          <span>{formatAriary(totalPanier)}</span>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={viderPanier}
            disabled={panier.length === 0}
          >
            Vider le panier
          </Button>
          <Button onClick={validerPanier} disabled={panier.length === 0}>
            Valider le panier
          </Button>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
};
