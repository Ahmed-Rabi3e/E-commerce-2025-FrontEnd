import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItem } from "../types/types";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeOutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">
      {/* Cart Items Section */}
      <main className="w-full lg:w-2/3 overflow-y-auto p-4 bg-white shadow-md rounded-lg space-y-2">
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1 className="text-center text-2xl md:text-3xl font-bold font-mono text-gray-600">
            No Items Added
          </h1>
        )}
      </main>

      {/* Summary Section */}
      <aside className="w-full border-2 border-soft lg:w-1/3 p-6 bg-white shadow-lg rounded flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

        <div className="space-y-3 text-lg">
          <p className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-bold">${shippingCharges.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax:</span>
            <span className="font-bold">${tax.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-red-500">
            <span>Discount:</span>
            <span className="font-bold">- ${discount.toFixed(2)}</span>
          </p>
          <hr className="border-t-2 my-3" />
          <p className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </p>
        </div>

        {/* Coupon Input */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="p-3 w-full border rounded outline-none bg-white"
          />

          {couponCode &&
            (isValidCouponCode ? (
              <p className="text-green-500 flex items-center gap-2 mt-2">
                <FaCheckCircle size={20} /> ${discount.toFixed(2)} off applied!
              </p>
            ) : (
              <p className="text-red-500 flex items-center gap-2 mt-2">
                <MdError size={20} /> Invalid Coupon Code
              </p>
            ))}
        </div>

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <Link
            to="/shipping"
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white p-3 text-center font-bold rounded-tl-xl rounded-br-xl transition"
          >
            Proceed to Checkout
          </Link>
        )}
      </aside>
    </div>
  );
};

export default Cart;
