import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { image_1, image_2 } from "./data";

type CarouselApi = {
  selectedScrollSnap: () => number;
  scrollTo: (index: number) => void;
  on: (event: "select", callback: () => void) => void;
};

export function CarouselDemo() {
  const slides = [
    {
      id: 1,
      title: "Explore The Best Deal with E-Commerce",
      subtitle: "We provide Everything you need Since 1991",
      image: image_1,
    },
    {
      id: 2,
      title: "Explore The Best Deal with E-Commerce",
      subtitle: "Discover the finest products made with love",
      image: image_2,
    },
  ];

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.on("select", () => {});
    };
  }, [api]);

  return (
    <Carousel
      setApi={(apiInstance) => setApi(apiInstance as CarouselApi)}
      className="!w-full relative h-[550px] md:h-[650px] border-b-2 font-dosis border-b-orange-500 overflow-hidden rounded-b-[48px] md:rounded-b-[120px]"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <motion.div
              initial={{ opacity: 0, filter: "blur(20px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full h-[650px] flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Slide Content */}
              <div className="relative z-10 text-center text-white px-4 max-w-3xl">
                <h1 className="text-3xl md:text-7xl font-extrabold mb-4 leading-snug">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
                <button className="bg-transparent border-2 uppercase border-orange-500 px-6 py-2 text-white font-semibold hover:bg-orange-500">
                  Explore
                </button>
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="absolute top-1/2 left-12 z-20 text-white bg-black/50 rounded-full h-20 w-20 border-[1px] border-white hover:border-orange-500 hover:text-white hover:bg-orange-500 hidden md:flex"
        aria-label="Previous"
      />
      <CarouselNext
        className="absolute top-1/2 right-12 z-20 text-white bg-black/50 rounded-full h-20 w-20 border-[1px] border-white hover:border-orange-500 hover:text-white hover:bg-orange-500 hidden md:flex"
        aria-label="Next"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-4 rounded-full transition-all duration-300 ${
              index === current
                ? "w-12 bg-orange-500"
                : "w-4 bg-white/75 hover:bg-white"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
}
