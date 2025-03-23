import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem as CartItemType } from "../types/types";

type CartItemProps = {
  cartItem: CartItemType;
  incrementHandler: (cartItem: CartItemType) => void;
  decrementHandler: (cartItem: CartItemType) => void;
  removeHandler: (id: string) => void;
};

const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="flex flex-col md:flex-row items-center bg-salmon shadow-md rounded-lg p-4 gap-4 md:gap-6 w-full">
      {/* Product Image */}
      <img
        className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg"
        src={`${server}/${photo}`}
        loading="lazy"
        alt={name}
      />

      {/* Product Details */}
      <article className="flex flex-col flex-grow text-center md:text-left">
        <Link
          className="text-lg md:text-xl font-semibold text-black hover:text-orange-500 transition"
          to={`/product/${productId}`}
        >
          {name}
        </Link>
        <span className="text-gray-600 text-sm md:text-base font-medium">
          $ {price.toFixed(2)}
        </span>
      </article>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center text-xl font-bold bg-orange-500 text-white rounded-lg shadow hover:bg-black transition"
          onClick={() => decrementHandler(cartItem)}
        >
          -
        </button>
        <p className="text-lg font-medium w-6 text-center">{quantity}</p>
        <button
          className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center text-xl font-bold bg-orange-500 text-white rounded-lg shadow hover:bg-black transition"
          onClick={() => incrementHandler(cartItem)}
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        className="text-gray-600 hover:text-red-600 transition text-xl md:text-2xl"
        onClick={() => removeHandler(productId)}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
