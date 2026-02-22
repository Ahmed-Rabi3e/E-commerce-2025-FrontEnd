import type { CarouselApi } from "@/components/ui/carousel";

import { CarouselDemo } from "@/components/HomeCarusal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import type { CartItem } from "../types/types";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  photo: string;
  category: string;
}

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  // Media queries for responsive design
  const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 1099px)");
  const isMobile = useMediaQuery("(max-width: 599px)");

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  useEffect(() => {
    if (isError) toast.error("Cannot Fetch the Products");
  }, [isError]);

  // Auto-advance the carousel
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [api, setApi] = useState<CarouselApi | undefined>();

  useEffect(() => {
    if (!api) return;

    // Setup autoplay
    autoplayRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000);

    // Cleanup
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [api]);

  return (
    <div className="font-dosis">
      <CarouselDemo />
      <div className="container mx-auto my-16 md:my-24">
        <div className="flex justify-between my-4 md:my-8 mx-6 relative">
          <h1 className="font-bold text-3xl md:text-4xl before:absolute before:-left-5 before:top-0 before:rounded-md before:w-2 before:h-10 before:bg-orange-500">
            Latest Products
          </h1>
          <Link
            to="/search"
            className="bg-orange-500 hover:drop-shadow-xl px-3 py-1 md:px-4 md:py-2 font-bold text-white rounded-3xl"
          >
            More
          </Link>
        </div>
        <main>
          {isLoading ? (
            <Skeleton width="80vw" />
          ) : (
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent className="mx-8">
                {data?.products?.map((product: Product) => (
                  <CarouselItem
                    key={product._id}
                    className={`pl-2 md:pl-4 ${
                      isMobile
                        ? "basis-full"
                        : isTablet
                        ? "basis-1/2"
                        : "basis-1/4"
                    }`}
                  >
                    <div className="p-1 md:p-4 my-4 md:my-8">
                      <ProductCard
                        productId={product._id}
                        name={product.name}
                        price={product.price}
                        stock={product.stock}
                        handler={addToCartHandler}
                        photo={product.photo}
                        category={product.category}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </main>
        <div className="flex flex-col my-16 md:my-8 mx-6 relative">
          <h1 className="font-bold text-3xl md:text-4xl before:absolute before:-left-5 before:top-0 before:rounded-md before:w-2 before:h-10 before:bg-orange-500 mb-8">
            Featured
          </h1>
          <main className="flex flex-wrap gap-4 md:gap-12 items-center justify-center">
            {isLoading ? (
              <Skeleton width="80vw" />
            ) : (
              data?.products?.map((product: Product) => (
                <ProductCard
                  key={product._id}
                  productId={product._id}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  handler={addToCartHandler}
                  photo={product.photo}
                  category={product.category}
                />
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
