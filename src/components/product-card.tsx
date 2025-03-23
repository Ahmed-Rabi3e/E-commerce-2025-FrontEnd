import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { TiInfoLarge } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
  category: string;
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
  category,
}: ProductsProps) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleBuyClick = () => {
    handler({ productId, price, name, photo, stock, quantity: 1 });
  };

  return (
    <div className="relative overflow-hidden rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl bg-white dark:bg-gray-800">
      {/* Product Image */}
      <div className="flex flex-col">
        <img
          className="h-72 w-72 object-contain cursor-pointer mx-auto transition-transform duration-300 hover:scale-105"
          onClick={() => navigate(`/product/${productId}`)}
          loading="lazy"
          src={`${server}/${photo}`}
          alt={`photo-${photo}`}
        />

        {/* Product Info */}
        <div className="bg-soft dark:bg-gray-900 flex justify-between p-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/product/${productId}`)}
          >
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              {name}
            </h5>
            <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
              ${price}
            </p>
          </div>

          {/* Shopping Cart Button */}
          <div
            className="flex items-center justify-center p-3 rounded-full transition-all duration-300 bg-salmon cursor-pointer"
            onClick={handleBuyClick}
          >
            <FaShoppingCart size={24} className="text-black hover:text-soft" />
          </div>
        </div>
      </div>

      {/* Hover Info Box */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`absolute top-0 right-0 transition-all duration-500 cursor-pointer 
          ${
            hover
              ? "w-[328px] h-[250px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg rounded-lg p-4"
              : "w-12 h-12 bg-soft rounded-bl-lg flex items-center justify-center"
          }
        `}
      >
        {hover ? (
          <div className="text-black">
            <h3 className="font-mono font-semibold text-lg">
              Name: <span className="text-soft">{name}</span>
            </h3>
            <h3 className="font-mono font-semibold text-lg">
              Price: <span className="text-soft">${price}</span>
            </h3>
            <h3 className="font-mono font-semibold text-lg">
              Stock: <span className="text-soft">{stock}</span>
            </h3>
            <h3 className="font-mono font-semibold text-lg">
              Category: <span className="text-soft">{category}</span>
            </h3>
          </div>
        ) : (
          <TiInfoLarge size={30} className="text-white" />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
