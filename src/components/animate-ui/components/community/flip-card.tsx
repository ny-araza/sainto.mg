"use client";

import { Button } from "@/components/ui/button";
import { easeOut, motion } from "motion/react";
import * as React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

export function FlipCard({ data }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

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

  return (
    <div
      className="
        relative
        mx-auto
        mt-2
        h-[280px]
        w-[85vw]
        max-w-[240px]
        cursor-pointer
        md:h-80
        md:w-60
        [perspective:1000px]
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
            flex h-full w-full
            flex-col items-center justify-center
            rounded-md border-2 border-foreground/20
            bg-gradient-to-br from-muted via-background to-muted
            px-4 py-6 text-center
            [backface-visibility:hidden]
          "
        >
          <img
            src={data.image}
            alt={data.name}
            className="mb-4 size-24 rounded-full border-2 object-cover"
          />

          <h2 className="text-lg font-bold">{data.name}</h2>

          <p className="text-sm text-muted-foreground">@{data.username}</p>

          {/* Indication mobile */}
          <p className="mt-4 text-xs text-muted-foreground md:hidden">
            Touchez la carte pour voir plus d'informations
          </p>
        </div>

        {/* BACK */}
        <div
          className="
            absolute inset-0
            flex h-full w-full
            flex-col items-center justify-between
            gap-y-4
            rounded-md border-2 border-foreground/20
            bg-gradient-to-tr from-muted via-background to-muted
            px-4 py-6
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
          "
        >
          <p className="text-center text-sm text-muted-foreground">
            {data.bio}
          </p>

          <div className="flex w-full items-center justify-between px-4">
            <div className="text-center">
              <p className="text-base font-bold">{data.stats.following}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>

            <div className="text-center">
              <p className="text-base font-bold">{data.stats.followers}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>

            {data.stats.posts !== undefined && (
              <div className="text-center">
                <p className="text-base font-bold">{data.stats.posts}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            {data.socialLinks?.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={20} />
              </a>
            )}

            {data.socialLinks?.github && (
              <a
                href={data.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={20} />
              </a>
            )}

            {data.socialLinks?.twitter && (
              <a
                href={data.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Twitter size={20} />
              </a>
            )}
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              // action Follow
            }}
          >
            Follow
          </Button>

          {/* Bouton pour retourner la carte sur mobile */}
          <button
            type="button"
            className="text-xs text-muted-foreground md:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
          >
            ← Retour
          </button>
        </div>
      </motion.div>
    </div>
  );
}
