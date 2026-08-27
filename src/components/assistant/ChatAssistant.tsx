import { useEffect, useRef, useState } from "react";
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
import {
  envoyerMessageAssistant,
  type HistoriqueMessage,
} from "@/services/assistantService";

interface Message {
  id: number;
  auteur: "assistant" | "utilisateur";
  texte: string;
}

const MESSAGE_ACCUEIL: Message = {
  id: 0,
  auteur: "assistant",
  texte:
    "Bonjour 👋 Je suis l'assistant Sainto. Je peux vous aider à trouver un produit, suivre une commande ou répondre à vos questions.",
};

const SUGGESTIONS = [
  "Voir vos produits",
  "Suivre ma commande",
  "Parler à un conseiller",
];

export const ChatAssistant = () => {
  const { isOpen, fermerAssistant } = useAssistant();
  const [messages, setMessages] = useState<Message[]>([MESSAGE_ACCUEIL]);
  const [saisie, setSaisie] = useState("");
  const [enChargement, setEnChargement] = useState(false);
  const finDesMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDesMessages.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, enChargement]);

  const envoyerMessage = async (texte: string) => {
    const contenu = texte.trim();
    if (!contenu || enChargement) return;

    const messageUtilisateur: Message = {
      id: Date.now(),
      auteur: "utilisateur",
      texte: contenu,
    };
    const construireHistorique = (msgs: Message[]): HistoriqueMessage[] =>
      msgs
        .filter((m) => m.id !== MESSAGE_ACCUEIL.id) // exclut le message d'accueil
        .map((m) => ({
          role: m.auteur === "utilisateur" ? "user" : "assistant",
          content: m.texte,
        }));
    // Historique construit AVANT d'ajouter le nouveau message
    // (le nouveau message est envoyé séparément dans `message`)
    const historique = construireHistorique(messages);

    setMessages((prev) => [...prev, messageUtilisateur]);
    setSaisie("");
    setEnChargement(true);

    try {
      const reponse = await envoyerMessageAssistant(contenu, historique);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          auteur: "assistant",
          texte: reponse,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          auteur: "assistant",
          texte:
            "Désolé, une erreur est survenue. Veuillez réessayer dans un instant.",
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
      {/* En-tête — vague évoquant l'univers de l'eau Sainto */}
      <div className="relative shrink-0 overflow-hidden rounded-t-none bg-blue-500 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:rounded-t-2xl">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
              <FontAwesomeIcon icon={faRobot} className="text-white" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-white">Assistant Sainto</span>
              <span className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                En ligne
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

        {/* Vague décorative */}
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

      {/* Messages */}
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
                "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                message.auteur === "utilisateur"
                  ? "rounded-br-sm bg-blue-500 text-white"
                  : "rounded-bl-sm bg-muted text-foreground",
              )}
            >
              {message.texte}
            </div>
          </div>
        ))}

        {enChargement && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
              <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-foreground/40" />
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

      {/* Saisie */}
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
          placeholder="Écrivez votre message…"
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
