"use client";

import { Button } from "@/components/ui/button";
import {
  faCartShopping,
  faStar,
  faList,
  faBox,
  faBottleWater,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { easeOut, motion } from "motion/react";
import * as React from "react";
import { useCart } from "@/context/CartContext";

export interface FlipCardData {
  id: number;
  name: string;
  price: number;
  path: string;
  rate: number;
  nbUniteInpack?: number;
  isUnite?: boolean;
  poid: number;
}
interface FlipCardProps {
  data: FlipCardData;
}

export function FlipCard({ data }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  const { demanderAjout } = useCart();

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const updateDeviceType = () => {
      setIsTouchDevice(mediaQuery.matches);
    };

    updateDeviceType();

    mediaQuery.addEventListener("change", updateDeviceType);

    return () => {
      mediaQuery.removeEventListener("change", updateDeviceType);
    };
  }, []);

  const handleClick = () => {
    if (isTouchDevice) {
      setIsFlipped((prev) => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsFlipped(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div
      className="
        relative
        mx-auto
        mt-2
        h-[400px]
        w-[85vw]
        max-w-[240px]
        cursor-pointer
        md:h-[350px]
        md:w-[85vw]
        [perspective:900px]
      "
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute inset-0 h-full w-full"
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: easeOut,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* FRONT */}
        <div
          className="
            absolute inset-0
            overflow-hidden
            rounded-md
            border-2 border-foreground/20
            bg-background
            [backface-visibility:hidden]
            w-full
            item
          "
        >
          {/* Image */}
          <div className="relative h-full w-full">
            <img
              src={data.path}
              alt={data.name}
              className="h-full w-full object-cover"
            />

            {/* Badge prix */}
            <div
              className="
                absolute
                left-3
                top-3
                rounded-full
                border
                border-white/20
                bg-background/30
                px-4
                py-2
                text-sm
                font-bold
                text-foreground
                shadow-lg
                backdrop-blur-md
              "
            >
              {formatPrice(data.price)} Ar
            </div>
            {/* Badge poids */}
            <div
              className="
                 absolute
                 right-3
                 top-3
                 flex
                 items-center
                 gap-2
                 rounded-full
                 border
                 border-white/20
                 bg-background/30
                 px-4
                 py-2
                 text-sm
                 font-bold
                 text-foreground
                 shadow-lg
                 backdrop-blur-md
               "
              title="Poids total du produit"
            >
              <FontAwesomeIcon icon={faWeightHanging} />
              {data.poid} kg
            </div>
          </div>

          {/* Informations */}
          <div className="flex h-[30%] flex-col items-center justify-center px-3 text-center">

            <p className="mt-2 text-xs text-muted-foreground md:hidden">
              Touchez pour voir les détails
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="
            absolute inset-0
            flex h-full w-full
            flex-col
            rounded-md
            border-2 border-foreground/20
            bg-gradient-to-tr from-muted via-background to-muted
            p-5
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
          "
        >
          {/* Titre */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">{data.name}</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {data.isUnite && "Se vend par unité"}
              {!data.isUnite && "Se vend par pack"}
            </p>
          </div>

          {/* Rating */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={
                    star <= Math.round(data.rate)
                      ? "text-yellow-400"
                      : "text-muted-foreground/30"
                  }
                />
              ))}
            </div>

            <p className="mt-1 text-sm font-medium">{data.rate}/5</p>
          </div>

          {/* Section ingrédients */}
          {!data.isUnite && (
            <div className="mt-5 rounded-lg border border-foreground/10 bg-background/30 p-3 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} className="text-blue-500" />
                {`1 pack = ${data.nbUniteInpack || 0}`}
                <FontAwesomeIcon icon={faBottleWater} />
                <h4 className="text-sm font-semibold"></h4>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            {/* Retour mobile */}
            <button
              type="button"
              className="
                rounded-md
                px-3
                py-2
                text-xs
                text-muted-foreground
                transition-colors
                hover:bg-muted
                md:hidden
              "
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              ← Retour
            </button>

            {/* Ajouter au panier */}
            <Button
              className="flex-1 bg-blue-500 hover:bg-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                demanderAjout(data);
              }}
              title="Ajouter au panier"
            >
              <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
