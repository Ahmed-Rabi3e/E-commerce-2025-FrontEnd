import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Skeleton } from "../components/loader";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, isLoading, isError } = useProductDetailsQuery(id!);
  const { _id, price, name, photo, stock } = data?.product || {};
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isError) {
      toast.error("Cannot fetch product details");
    }
  }, [isError]);

  const decrementHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const incrementHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setQuantity((prev) => (prev < stock! ? prev + 1 : prev));
  };

  const addToCartHandler = (
    cartItem: CartItem,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  return (
    <>
      {isLoading ? (
        <Skeleton width="80vw" />
      ) : (
        <section className="container mx-auto h-[80vh] p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <img
            className="w-full md:w-3/4 mx-auto aspect-square h-auto rounded-xl"
            loading="lazy"
            src={`${server}/${data?.product.photo}`}
            alt={data?.product.name || "Product"}
          />
          <form className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold font-mono">
              {data?.product.name}
            </h2>
            <p className="font-bold text-xl md:text-2xl">
              <span className="text-gray-400">$</span> {data?.product.price}
            </p>
            <p className="text-green-500 font-bold text-lg md:text-xl">
              Stock: {data?.product.stock}
            </p>
            <div className="flex items-center gap-4">
              <button
                className="w-10 h-10 text-xl md:text-2xl hover:bg-black text-white border-none rounded-md cursor-pointer bg-orange-500"
                onClick={decrementHandler}
              >
                -
              </button>
              <p className="text-xl md:text-2xl">{quantity}</p>
              <button
                className="w-10 h-10 text-xl md:text-2xl hover:bg-black text-white border-none rounded-md cursor-pointer bg-orange-500"
                onClick={incrementHandler}
              >
                +
              </button>
            </div>
            <small className="text-gray-800 text-sm md:text-lg">
              SHIPS ON JANUARY 5, 2024
            </small>
            <button
              onClick={(e) =>
                addToCartHandler(
                  {
                    productId: _id!,
                    price: price!,
                    name: name!,
                    photo: photo!,
                    stock: stock!,
                    quantity: quantity,
                  },
                  e
                )
              }
              className="bg-orange-500 hover:bg-black text-white text-lg md:text-2xl uppercase rounded-lg w-full p-4"
              type="submit"
            >
              Add To Cart
            </button>
            <p className="font-bold text-lg md:text-2xl">
              Description:
              <br />
              <span className="text-gray-500 font-mono text-base md:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </span>
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default ProductDetails;
