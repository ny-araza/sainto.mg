import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@headlessui/react";
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
import { updateClient } from "@/services/clientServices";
function formatAriary(montant: number) {
  return `${montant.toLocaleString("fr-FR")} Ar`;
}

export const MyChart = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [feedback, setFeedback] = useState("");
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

  // Étapes du tunnel de commande
  const [infoClientOpen, setInfoClientOpen] = useState(false);
  const [devisOpen, setDevisOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [devis, setDevis] = useState<ReturnType<typeof calculerDevis> | null>(
    null,
  );
  const [clientId, setClientId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);

  const TVA = 0.2;

  const calculerDevis = () => {
    const lignes = panier.map((ligne) => {
      const totalHT = ligne.price * ligne.quantite;
      const montantTVA = totalHT * TVA;
      const totalTTC = totalHT + montantTVA;
      return { ...ligne, totalHT, montantTVA, totalTTC };
    });
    const totalHT = lignes.reduce((total, ligne) => total + ligne.totalHT, 0);
    const totalTVA = lignes.reduce(
      (total, ligne) => total + ligne.montantTVA,
      0,
    );
    return { lignes, totalHT, totalTVA, totalTTC: totalHT + totalTVA };
  };

  /** Étape 1 → 2 : "Valider le panier" ferme le panier et ouvre le formulaire client */
  const validerPanier = () => {
    if (panier.length === 0) return;
    fermerPanier();
    setInfoClientOpen(true);
  };

  /** Étape 2 → 3 : génère le devis à partir des infos client saisies */
  const genererDevis = () => {
    if (!nom.trim() || !email.trim() || !telephone.trim() || !adresse.trim())
      return;
    setDevis(calculerDevis());
    setInfoClientOpen(false);
    setDevisOpen(true);
  };

  /**
   * Étape 3 → 4 : "Valider le devis"
   * Stocke le client + les lignes dans la table likeproduct,
   * PUIS ouvre le dialog de feedback.
   */
  const validerDevis = async () => {
    try {
      console.log("here")
      setLoading(true);
      const client = await createClient(email, "");
      await validateCartLikes(client.id, panier);
      const response = await fetch(
        "http://localhost:8000/api/send-devis-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            email,
            telephone,
            adresse,
            panier,
            devis,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
      setClientId(client.id);
      viderPanier();
      setDevisOpen(false);
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Erreur lors de la validation du devis :", error);
    } finally {
      setLoading(false);
    }
  };

  /** Étape 4 : envoi du feedback, une fois la commande déjà enregistrée */
  const envoyerFeedback = async () => {
    try {
      setLoading(true);
      await updateClient(clientId, feedback);
      console.log("Feedback pour le client", clientId, ":", feedback);
    } finally {
      setLoading(false);
      reinitialiserTunnel();
    }
  };

  const passerFeedback = () => reinitialiserTunnel();

  const reinitialiserTunnel = () => {
    setFeedbackOpen(false);
    setNom("");
    setEmail("");
    setTelephone("");
    setAdresse("");
    setFeedback("");
    setDevis(null);
    setClientId(null);
  };

  return (
    <>
      {/* ========================= */}
      {/* 1. PANIER */}
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
      {/* 2. INFOS CLIENT */}
      {/* ========================= */}
      <Dialog
        open={infoClientOpen}
        onClose={() => !loading && setInfoClientOpen(false)}
      >
        <DialogPanel className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Vos informations</DialogTitle>
            <DialogDescription>
              Renseignez vos informations afin que nous puissions générer votre
              devis (prix HT, TVA, TTC) et vous livrer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom complet</label>
              <Input
                type="text"
                placeholder="Votre nom et prénom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse email</label>
              <Input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Numéro de téléphone</label>
              <Input
                type="tel"
                placeholder="+261 XX XX XXX XX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Adresse de livraison
              </label>
              <Textarea
                placeholder="Ex : Antananarivo, quartier, rue..."
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="min-h-[80px] w-full resize-none border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={genererDevis}
              disabled={
                loading ||
                !nom.trim() ||
                !email.trim() ||
                !telephone.trim() ||
                !adresse.trim()
              }
              className="bg-blue-500 hover:bg-blue-800"
            >
              Générer mon devis
            </Button>
          </DialogFooter>
        </DialogPanel>
      </Dialog>

      {/* ========================= */}
      {/* 3. DEVIS */}
      {/* ========================= */}
      <Dialog open={devisOpen} onClose={() => !loading && setDevisOpen(false)}>
        <DialogPanel className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Votre devis</DialogTitle>
            <DialogDescription>
              Vérifiez votre commande avant de la valider.
            </DialogDescription>
          </DialogHeader>

          {devis && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 text-sm">
                <p>
                  <strong>Client :</strong> {nom}
                </p>
                <p>
                  <strong>Email :</strong> {email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {telephone}
                </p>
                <p>
                  <strong>Adresse :</strong> {adresse}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b text-left">
                    <tr>
                      <th className="p-2">Produit</th>
                      <th className="p-2">Qté</th>
                      <th className="p-2">HT</th>
                      <th className="p-2">TVA</th>
                      <th className="p-2">TTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devis.lignes.map((ligne) => (
                      <tr key={ligne.id} className="border-b">
                        <td className="p-2">{ligne.name}</td>
                        <td className="p-2">{ligne.quantite}</td>
                        <td className="p-2">{formatAriary(ligne.totalHT)}</td>
                        <td className="p-2">
                          {formatAriary(ligne.montantTVA)}
                        </td>
                        <td className="p-2 font-medium">
                          {formatAriary(ligne.totalTTC)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto w-full max-w-[300px] space-y-2 rounded-lg border p-4">
                <div className="flex justify-between">
                  <span>Total HT</span>
                  <span>{formatAriary(devis.totalHT)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA 20%</span>
                  <span>{formatAriary(devis.totalTVA)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total TTC</span>
                  <span>{formatAriary(devis.totalTTC)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDevisOpen(false);
                setInfoClientOpen(true);
              }}
              disabled={loading}
            >
              Modifier
            </Button>
            <Button
              onClick={validerDevis}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-800"
            >
              {loading ? "Validation..." : "Valider le devis"}
            </Button>
          </DialogFooter>
        </DialogPanel>
      </Dialog>

      {/* ========================= */}
      {/* 4. FEEDBACK (après stockage) */}
      {/* ========================= */}
      <Dialog
        open={feedbackOpen}
        onClose={() => !loading && setFeedbackOpen(false)}
      >
        <DialogPanel className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Merci pour votre commande !</DialogTitle>
            <DialogDescription>
              Votre commande a bien été enregistrée. Un dernier mot avant de
              terminer ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <label className="text-sm font-medium">
              Votre feedback
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (facultatif)
              </span>
            </label>
            <Textarea
              placeholder="Votre avis, vos suggestions ou vos compliments..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[110px] w-full resize-none border"
            />
            <p className="text-xs text-muted-foreground">
              💡 Dites-nous ce que vous souhaitez améliorer, partagez votre
              expérience ou laissez-nous un petit mot.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={passerFeedback}
              disabled={loading}
            >
              Passer
            </Button>
            <Button
              onClick={envoyerFeedback}
              disabled={loading || !feedback.trim()}
              className="bg-blue-500 hover:bg-blue-800"
            >
              {loading ? "Envoi..." : "Envoyer mon feedback"}
            </Button>
          </DialogFooter>
        </DialogPanel>
      </Dialog>
    </>
  );
};
