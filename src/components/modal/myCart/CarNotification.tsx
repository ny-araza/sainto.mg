import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const CartNotification = () => {
  const { messageAjout, fermerMessageAjout } = useCart();

  if (!messageAjout) return null;

  return (
    <div
      className="
        fixed
        bottom-6
        right-6
        z-[100]
        flex
        items-center
        gap-3
        rounded-xl
        border
        bg-background/80
        px-5
        py-4
        shadow-xl
        backdrop-blur-xl
        animate-in
        slide-in-from-bottom-5
      "
    >
      <CheckCircle2 className="size-6 text-green-500" />

      <div>
        <p className="font-semibold">Produit ajouté</p>

        <p className="text-sm text-muted-foreground">{messageAjout}</p>
      </div>

      <button
        onClick={fermerMessageAjout}
        className="ml-2 text-muted-foreground"
      >
        ✕
      </button>
    </div>
  );
};
