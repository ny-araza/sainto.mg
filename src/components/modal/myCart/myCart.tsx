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
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Package,
  Info,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "@/context/CartContext";
import { createClient, validateCartLikes } from "@/services/productService";
import { updateClient } from "@/services/clientServices";

function formatAriary(montant: number) {
  return `${Math.round(montant).toLocaleString("fr-FR")} Ar`;
}
const API_URL = import.meta.env.VITE_API_URL;

/** TVA incluse dans les prix (les prix des produits sont TTC) */
const TVA = 0.2;

/**
 * Taille du pack selon la contenance du produit.
 * - 1,5 L et 1 L : pack de 6 pièces
 * - 0,5 L (500 ml) : pack de 8 pièces
 * - Tout autre produit : null (vendu à l'unité, donc 1 pièce)
 */
function getTaillePack(nom: string): number | null {
  const n = nom.toLowerCase().replace(",", ".");

  // (?<![\d.]) évite de confondre "1.5 l" avec "5 l" ou "0.5 l" avec "5 l"
  if (/(?<![\d.])0\.5\s*(l|litres?)\b|(?<![\d.])500\s*ml/.test(n)) return 8;
  if (
    /(?<![\d.])1\.5\s*(l|litres?)\b|(?<![\d.])1500\s*ml/.test(n) ||
    /(?<![\d.])1\s*(l|litres?)\b|(?<![\d.])1000\s*ml/.test(n)
  )
    return 6;

  return null;
}

/** Calculs d'une ligne : le prix unitaire (TTC) est multiplié par la taille du pack */
function calculerLigne<
  T extends { name: string; price: number; quantite: number },
>(ligne: T) {
  const taillePack = getTaillePack(ligne.name);
  const prixPack = taillePack ? ligne.price * taillePack : ligne.price;
  const totalTTC = prixPack * ligne.quantite;
  const totalHT = totalTTC / (1 + TVA);
  const montantTVA = totalTTC - totalHT;
  const totalPieces = (taillePack ?? 1) * ligne.quantite;
  return {
    ...ligne,
    taillePack,
    prixPack,
    totalPieces,
    totalHT,
    montantTVA,
    totalTTC,
  };
}

function calculerDevis<
  T extends { name: string; price: number; quantite: number },
>(panier: T[]) {
  const lignes = panier.map(calculerLigne);
  const totalTTC = lignes.reduce((t, l) => t + l.totalTTC, 0);
  const totalHT = lignes.reduce((t, l) => t + l.totalHT, 0);
  const totalTVA = lignes.reduce((t, l) => t + l.montantTVA, 0);
  const totalPieces = lignes.reduce((t, l) => t + l.totalPieces, 0);
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return { lignes, totalHT, totalTVA, totalTTC, totalPieces, date };
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

  // Total du panier calculé par pack (prix TTC x taille du pack x quantité)
  const totalPanierPacks = panier.reduce(
    (total, ligne) => total + calculerLigne(ligne).totalTTC,
    0,
  );

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
    setDevis(calculerDevis(panier));
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
      setLoading(true);
      const client = await createClient(email, "");
      await validateCartLikes(client.id, panier);
      const response = await fetch(`${API_URL}/send-devis-email/`, {
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
          // Le devis contient désormais taillePack, prixPack, totalPieces par ligne
          devis,
        }),
      });

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
    } finally {
      setLoading(false);
      reinitialiserTunnel();
    }
  };

  /** Format "1 234 567 Ar" sans espace insécable (jsPDF ne les gère pas bien) */
  const formatPdf = (montant: number) =>
    `${Math.round(montant)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ar`;

  /** Export du devis en PDF (disponible dans l'étape feedback) */
  const exporterDevisPdf = () => {
    if (!devis) return;

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const largeur = doc.internal.pageSize.getWidth();
    const marge = 14;

    // En-tête
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, largeur, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("DEVIS", marge, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Sainto Madagascar", marge, 21);
    doc.text(`Emis le ${devis.date}`, largeur - marge, 14, { align: "right" });

    // Note importante
    doc.setTextColor(120, 53, 15);
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(245, 158, 11);
    doc.rect(marge, 34, largeur - 2 * marge, 24, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("NOTE IMPORTANTE", marge + 3, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const note = doc.splitTextToSize(
      "Les produits en 1,5 L, 1 L et 0,5 L ne sont vendus que par pack. 1,5 L et 1 L : 6 pieces par pack. 0,5 L : 8 pieces par pack. Les autres produits sont vendus a l'unite.",
      largeur - 2 * marge - 6,
    );
    doc.text(note, marge + 3, 46);

    // Client
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Client", marge, 68);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nom : ${nom}`, marge, 75);
    doc.text(`Email : ${email}`, marge, 81);
    doc.text(`Telephone : ${telephone}`, marge, 87);
    const adresseLignes = doc.splitTextToSize(
      `Adresse : ${adresse}`,
      largeur - 2 * marge,
    );
    doc.text(adresseLignes, marge, 93);

    // Tableau des produits
    const debutTableau = 93 + adresseLignes.length * 5 + 4;
    autoTable(doc, {
      startY: debutTableau,
      margin: { left: marge, right: marge },
      head: [
        [
          "Produit",
          "Vente",
          "Qte",
          "Pieces",
          "Prix pack TTC",
          "HT",
          "TVA",
          "TTC",
        ],
      ],
      body: devis.lignes.map((l) => [
        l.name,
        l.taillePack ? `Pack de ${l.taillePack}` : "A l'unite",
        l.taillePack ? `${l.quantite} pack(s)` : `${l.quantite}`,
        `${l.totalPieces}`,
        formatPdf(l.prixPack),
        formatPdf(l.totalHT),
        formatPdf(l.montantTVA),
        formatPdf(l.totalTTC),
      ]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right", fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Récapitulatif
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let y = ((doc as any).lastAutoTable?.finalY ?? debutTableau) + 10;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    const xLabel = largeur - marge - 80;
    const xValeur = largeur - marge;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text("Total pieces", xLabel, y);
    doc.text(`${devis.totalPieces}`, xValeur, y, { align: "right" });
    doc.text("Total HT", xLabel, y + 7);
    doc.text(formatPdf(devis.totalHT), xValeur, y + 7, { align: "right" });
    doc.text("TVA (20 %)", xLabel, y + 14);
    doc.text(formatPdf(devis.totalTVA), xValeur, y + 14, { align: "right" });
    doc.setDrawColor(37, 99, 235);
    doc.line(xLabel, y + 18, xValeur, y + 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(29, 78, 216);
    doc.text("Total TTC", xLabel, y + 26);
    doc.text(formatPdf(devis.totalTTC), xValeur, y + 26, { align: "right" });

    // Pied de page
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Merci de votre confiance - Sainto Madagascar", largeur / 2, 287, {
      align: "center",
    });

    const nomFichier = nom.trim().replace(/\s+/g, "_") || "client";
    doc.save(`devis_sainto_${nomFichier}.pdf`);
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
        <DialogPanel showCloseButton className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              Panier ({nombreArticles})
            </DialogTitle>
            <DialogDescription>
              Modifiez les quantités ou validez votre commande.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>
              Les produits en <strong>1,5 L</strong>, <strong>1 L</strong> et{" "}
              <strong>0,5 L</strong> sont vendus{" "}
              <strong>uniquement par pack</strong>. La quantité correspond au
              nombre de packs. Les autres produits sont vendus à l'unité.
            </p>
          </div>

          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
            {panier.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Votre panier est vide.
              </p>
            )}
            {panier.map((ligne) => {
              const l = calculerLigne(ligne);
              return (
                <div
                  key={ligne.id}
                  className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{ligne.name}</span>
                    {l.taillePack ? (
                      <span className="text-muted-foreground text-xs">
                        Pack de {l.taillePack} pièces ·{" "}
                        {formatAriary(l.prixPack)} / pack
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        {formatAriary(ligne.price)} / unité
                      </span>
                    )}
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {formatAriary(l.totalTTC)}
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
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
            <span>
              Total TTC ({nombreArticles} article{nombreArticles > 1 ? "s" : ""}
              )
            </span>
            <span>{formatAriary(totalPanierPacks)}</span>
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
                className="min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-input/30"
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
        <DialogPanel className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[720px]">
          {/* En-tête */}
          <div className="rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Votre devis
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                Vérifiez votre commande avant de la valider.
              </DialogDescription>
            </DialogHeader>
            {devis && (
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-100">
                <CalendarDays className="size-4" />
                <span>Émis le {devis.date}</span>
              </div>
            )}
          </div>

          {devis && (
            <div className="space-y-5 px-6 py-5">
              {/* NOTE IMPORTANTE */}
              <div className="flex items-start gap-3 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <Info className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-bold uppercase tracking-wide">
                    Note importante
                  </p>
                  <p className="mt-1">
                    Nous ne vendons <strong>que par pack</strong> les produits
                    en 1,5 L, 1 L et 0,5 L. Les prix affichés tiennent compte du
                    pack complet :
                  </p>
                  <ul className="mt-1 list-inside list-disc text-xs">
                    <li>
                      Produits 1,5 L et 1 L : <strong>6 pièces</strong> par pack
                    </li>
                    <li>
                      Produits 0,5 L : <strong>8 pièces</strong> par pack
                    </li>
                    <li>Autres produits : vendus à l'unité</li>
                  </ul>
                </div>
              </div>

              {/* Client */}
              <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm dark:bg-slate-800/50 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 size-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-muted-foreground text-xs">Client</p>
                    <p className="font-medium">{nom}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-muted-foreground text-xs">Téléphone</p>
                    <p className="font-medium">{telephone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 size-4 text-blue-600 dark:text-blue-400" />
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="truncate font-medium">{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Adresse de livraison
                    </p>
                    <p className="font-medium">{adresse}</p>
                  </div>
                </div>
              </div>

              {/* Lignes de commande */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Détail de la commande
                </h3>
                {devis.lignes.map((ligne) => (
                  <div
                    key={ligne.id}
                    className="rounded-lg border p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{ligne.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                          {ligne.taillePack ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              <Package className="size-3" />
                              Pack de {ligne.taillePack} pièces
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                              Vendu à l'unité
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            {formatAriary(ligne.prixPack)}{" "}
                            {ligne.taillePack ? "/ pack" : "/ unité"} TTC
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                          {formatAriary(ligne.totalTTC)}
                        </p>
                        <p className="text-muted-foreground text-xs">TTC</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-xs sm:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">
                          {ligne.taillePack ? "Nombre de packs" : "Quantité"}
                        </p>
                        <p className="font-semibold">× {ligne.quantite}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total pièces</p>
                        <p className="font-semibold">{ligne.totalPieces}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total HT</p>
                        <p className="font-semibold">
                          {formatAriary(ligne.totalHT)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          TVA ({TVA * 100} %)
                        </p>
                        <p className="font-semibold">
                          {formatAriary(ligne.montantTVA)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Récapitulatif */}
              <div className="ml-auto w-full space-y-2 rounded-lg border bg-slate-50 p-4 dark:bg-slate-800/50 text-sm sm:max-w-[340px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total pièces</span>
                  <span className="font-medium">{devis.totalPieces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total HT</span>
                  <span className="font-medium">
                    {formatAriary(devis.totalHT)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    TVA ({TVA * 100} %)
                  </span>
                  <span className="font-medium">
                    {formatAriary(devis.totalTVA)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-bold text-blue-700 dark:text-blue-400">
                  <span>Total TTC</span>
                  <span>{formatAriary(devis.totalTTC)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 pb-5">
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

          {/* Export PDF du devis */}
          <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40">
            <div className="text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Votre devis
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Téléchargez-le en PDF pour le conserver.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={exporterDevisPdf}
              disabled={!devis}
              className="shrink-0 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/40"
            >
              <Download className="mr-1 size-4" />
              Exporter en PDF
            </Button>
          </div>

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
              className="min-h-[110px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-input/30"
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
