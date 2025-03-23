import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });
  const [disabled, setDisabled] = useState(false);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));
    toast.success("Payment in progress");
    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDisabled(true);
      setTimeout(() => {
        navigate("/pay", {
          state: data.clientSecret,
        });
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="flex justify-center items-center bg-salmon">
      <button
        className="w-12 h-12 bg-soft hover:shadow-2xl text-white flex justify-center items-center fixed top-24 left-8 rounded-full border-none outline-none cursor-pointer shadow-xl"
        onClick={() => navigate("/cart")}
      >
        <BiArrowBack fill="white" size={30} />
      </button>

      <form
        onSubmit={submitHandler}
        className="max-w-md w-full flex flex-col p-8"
      >
        <h1 className="text-3xl m-8 text-center font-semibold">Shipping Address</h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
          className="bg-white p-4 outline-none text-lg rounded-lg border border-gray-400 border-1 my-4"
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
          className="bg-white p-4 outline-none text-lg rounded-lg border border-gray-400 border-1 my-4"
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
          className="bg-white p-4 outline-none text-lg rounded-lg border border-gray-400 border-1 my-4"
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
          className="bg-white p-4 outline-none text-lg rounded-lg border border-gray-400 border-1 my-4"
        >
          <option value="">Choose Country</option>
          <option value="egypt">Egypt</option>
          <option value="germany">Germany</option>
          <option value="englend">Englend</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
          className="bg-white p-4 outline-none text-lg rounded-lg border border-gray-400 border-1 my-4"
        />

        <button
          type="submit"
          disabled={disabled}
          className="bg-soft w-full uppercase p-4 rounded-tl-xl rounded-br-xl text-white font-bold my-4"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Shipping;
