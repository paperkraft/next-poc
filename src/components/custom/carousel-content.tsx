"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

const slides = [
  {
    title: "Title One",
    description: "Lorem ipsum dolor sit amet experience one-tap access consectetur elit.",
    image: "/landing_01.png",
  },
  {
    title: "Title Two",
    description: "Lorem ipsum dolor consectetur sit experience one-tap access dolor amet.",
    image: "/landing_01.png",
  },
  {
    title: "Title Three",
    description: "Lorem ipsum dolor consectetur sit experience one-tap access dolor amet.",
    image: "/landing_01.png",
  }
];

export function CarouselPlugin() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [current, setCurrent] = React.useState<number | undefined>(0)
  const autoplayDelay = 6000;

  React.useEffect(() => {
    if (!api) return;

    const onChange = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onChange);

    onChange();
    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  return (
    <>
      <div className="space-y-4">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: autoplayDelay })]}
          setApi={setApi}
        >
          <CarouselContent>
            {slides.map((item, index) => (
              <CarouselItem key={index}>
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={180}
                    priority
                    className="aspect-auto"
                  />
                  <h1 className="font-semibold p-1">{item.title}</h1>
                  <p className="p-1 text-center leading-normal text-balance">{item.description}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel> 


        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div key={index} className="relative rounded-full">
              <button
                className={`rounded-full bg-gray-300 dark:bg-muted ${current === index ? "w-6 h-1.5" : "w-1.5 h-1.5"}`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
              {current === index && (
                <div className="absolute top-1/2 bg-primary w-6 h-1.5 rounded-full animate-progress"
                  style={{ animationDuration: `${autoplayDelay}ms`, animationTimingFunction: "ease-in-out", }}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
