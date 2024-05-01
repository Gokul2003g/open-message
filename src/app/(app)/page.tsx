"use client";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/data/messages.json";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Welcome to Open Message.
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Get completely anonymous feedback.
        </p>
      </section>
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full max-w-lg"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold mb-4">
                      {message.title}
                    </span>
                    <span className="font-normal text-xl">
                      {message.content}
                    </span>
                    <span className="text-sm font-light mt-4">
                      {message.recieved}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default Home;
