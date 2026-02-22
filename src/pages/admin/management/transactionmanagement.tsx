import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/orderAPI";
import { RootState, server } from "../../../redux/store";
import { Order, OrderItem } from "../../../types/types";
import { responseToast } from "../../../utils/features";

const defaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
};

const TransactionManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, data, isError } = useOrderDetailsQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pinCode },
    orderItems,
    user: { name },
    status,
    tax,
    subtotal,
    total,
    discount,
    shippingCharges,
  } = data?.order || defaultData;

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: data?.order._id!,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-6 md:p-10">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section className="flex flex-col h-fit bg-white relative px-4 py-6 md:px-8 md:py-10 shadow-xl rounded">
              <h2 className="text-center font-bold my-4 text-2xl">
                Order Items
              </h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${server}/${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="flex flex-col h-fit bg-white px-6 py-8 md:px-10 md:py-20 rounded shadow-xl">
              <h1 className="text-center font-bold my-4 text-2xl">
                Order Info
              </h1>
              <h5 className="font-semibold my-2 text-xl">User Info</h5>
              <div className="my-1 bg-gray-100 py-4 px-4 md:py-8 md:px-6 rounded">
                <p>Name: {name}</p>
                <p>
                  Address:{" "}
                  {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
                </p>
              </div>
              <h5 className="font-semibold my-2 text-xl">Amount Info</h5>
              <p className="my-1 text-lg">Subtotal: {subtotal}</p>
              <p className="my-1 text-lg">
                Shipping Charges: {shippingCharges}
              </p>
              <p className="my-1 text-lg">Tax: {tax}</p>
              <p className="my-1 text-lg">Discount: {discount}</p>
              <p className="my-1 text-lg">Total: {total}</p>

              <h5 className="font-semibold my-2 text-xl">Status Info</h5>
              <p className="my-2">
                Status:{" "}
                <span
                  className={`font-bold
                    ${
                      status === "Delivered"
                        ? "text-purple-500"
                        : status === "Shipped"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                >
                  {status}
                </span>
              </p>
              <button
                className="bg-orange-500 w-full font-bold px-4 py-2 text-white rounded my-2"
                onClick={updateHandler}
              >
                Process Status
              </button>
              <button
                className="bg-red-500 w-full font-bold flex gap-2 items-center justify-center px-4 py-2 text-white rounded my-2"
                onClick={deleteHandler}
              >
                Delete
                <FaTrash />
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="flex items-center gap-2 flex-col sm:flex-row sm:items-center">
    <img
      src={photo}
      alt={name}
      loading="lazy"
      className="w-20 h-20 sm:w-16 sm:h-16 rounded object-cover"
    />
    <Link
      to={`/product/${productId}`}
      className="font-semibold text-base sm:text-lg hover:text-orange-500"
    >
      {name}
    </Link>
    <span className="ml-auto">
      $.{price} X {quantity} = $.{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
