'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ProductCarousel = () => {
  const images = [
    { src: "/assets/imageCarousel.png", alt: 'SafeTyres 200ml/300ml Bottle' },
    { src: "/assets/imageCarousel.png", alt: 'SafeTyres 500ml/1L Bottle' },
    // { src: "/assets/product-angles.jpg", alt: 'Product in Action' },
  ];

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            See It In <span className="text-primary">Action</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our premium anti-puncture liquid from every angle
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video rounded-2xl overflow-hidden group">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px" // Provide sizes for optimization
                      priority={index === 0} // Load the first image eagerly for better LCP
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
