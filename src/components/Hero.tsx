import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import background from "../assets/background_header05.jpg";
import { TypingTextDemo } from "./ui/typingText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { useAssistant } from "@/context/AssistantContext";

export const Hero = () => {
  const { ouvrirAssistant } = useAssistant();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-center bg-no-repeat md:bg-cover"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
        <div className="text-center lg:text-start space-y-6 ">
          <main className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            <h1 className="inline">
              <TypingTextDemo
                delay={2000}
                holdDelay={500}
                loop={false}
                cursor={true}
                text="La fraîcheur naturelle de Madagascar."
              />
            </h1>
          </main>

          <p className="text-xl text-slate-200 md:w-10/12 mx-auto lg:mx-0 font-light">
            Sainto est une marque malgache d'eau de source naturelle
            embouteillée par la société Mado, dont la source se trouve sur la
            montagne d'Iharanandriana, à Morarano (au PK 38 sur la route
            d'Antsirabe).
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              onClick={ouvrirAssistant}
              className="w-full md:w-1/3 hover:bg-blue-500 bg-blue-800"
              variant={"default"}
            >
              <FontAwesomeIcon className="mr-2" icon={faRobot} />
              Assistant virtuel
            </Button>

            <a
              rel="noreferrer noopener"
              href="#features"
              className={`w-full md:w-1/3 ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Nos Produits
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
