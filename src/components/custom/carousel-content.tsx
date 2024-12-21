"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"

const data = [
  {
    title: "Title One",
    content: "Lorem ipsum dolor sit amet experience one-tap access consectetur elit.",
    image: "/landing_01.png"
  },
  {
    title: "Title Two",
    content: "Lorem ipsum dolor consectetur sit experience one-tap access dolor  amet.",
    image: "/landing_01.png"
  },
]

export function CarouselPlugin() {

  return (
    <Carousel
      className="w-full p-4 py-6"
      opts={{ align: "start", loop: true }}
      plugins={[Autoplay({ delay: 6000 })]}
    >
      <CarouselContent>
        {data.map((item) => (
          <CarouselItem key={item.title}>
            <div className="space-y-2 flex flex-col justify-center items-center">
              <Image src={item.image} alt={item.title} width={300} height={180} className="aspect-auto" />
              <h1 className="font-semibold p-1">{item.title}</h1>
              <p className="p-1 text-center leading-normal text-balance">{item.content}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
