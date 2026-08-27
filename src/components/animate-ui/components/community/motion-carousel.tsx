"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Slide = {
  id: number;
  image: string;
  alt: string;
};

type PropType = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

const transition: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);

    emblaApi.on("reInit", onInit).on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

function MotionCarousel({ slides, options }: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, prevDisabled, nextDisabled, onPrev, onNext } =
    useEmblaControls(emblaApi);

  return (
    <div
      className="
        w-full
        space-y-4

        [--slide-spacing:0.75rem]
        [--slide-size:90%]

        sm:[--slide-spacing:1rem]
        sm:[--slide-size:70%]

        md:[--slide-spacing:1.5rem]
        md:[--slide-size:60%]

        lg:[--slide-size:50%]
      "
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;

            return (
              <motion.div
                key={slide.id}
                className="
                  mr-[var(--slide-spacing)]
                  basis-[var(--slide-size)]
                  flex-none
                  flex
                  min-w-0

                  h-[420px]
                  sm:h-[520px]
                  md:h-[600px]
                  lg:h-160
                "
              >
                <motion.div
                  className="
                    size-full
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    border-4
                    rounded-xl
                    select-none
                  "
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.9,
                  }}
                  transition={transition}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="
                      size-full
                      rounded-xl
                      object-cover
                    "
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between px-2 sm:px-0">
        <Button
          size="icon"
          className="bg-blue-500 hover:bg-blue-800"
          onClick={onPrev}
          disabled={prevDisabled}
        >
          <ChevronLeft className="size-5" />
        </Button>

        <Button
          size="icon"
          className="bg-blue-500 hover:bg-blue-800"
          onClick={onNext}
          disabled={nextDisabled}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

export { MotionCarousel };
