import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { RootState, server } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const { price, photo, name, stock, category } = data?.product || {
    photo: "",
    category: "",
    name: "",
    stock: 0,
    price: 0,
  };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (photoFile) formData.set("photo", photoFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-6 md:p-10">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section className="flex flex-col h-fit bg-white relative px-4 py-6 md:px-8 md:py-10 shadow-xl">
              <strong className="mb-2">ID - {data?.product._id}</strong>
              <img
                src={`${server}/${photo}`}
                alt="Product"
                loading="lazy"
                className="w-full h-[300px] md:h-[500px] rounded object-cover"
              />
              <p className="text-center font-semibold text-xl md:text-2xl my-2">
                {name}
              </p>
              {stock > 0 ? (
                <span className="text-green-500 absolute right-0 mb-2 mr-4">
                  {stock} Available
                </span>
              ) : (
                <span className="text-red-500"> Not Available</span>
              )}
              <h3 className="text-center font-mono text-xl md:text-2xl my-2">
                $.{price}
              </h3>
            </section>
            <article className="flex flex-col items-center relative">
              <form
                onSubmit={submitHandler}
                className="bg-white px-6 py-8 md:px-10 md:py-20 rounded shadow-xl w-full max-w-xl"
              >
                <h2 className="text-center font-bold my-4 text-2xl">Manage</h2>
                <div className="flex flex-col my-2">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                    className="p-3 outline-none bg-gray-100 rounded"
                  />
                </div>
                <div className="flex flex-col my-2">
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    className="p-3 outline-none bg-gray-100 rounded"
                  />
                </div>
                <div className="flex flex-col my-2">
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                    className="p-3 outline-none bg-gray-100 rounded"
                  />
                </div>

                <div className="flex flex-col my-2">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                    className="p-3 outline-none bg-gray-100 rounded"
                  />
                </div>

                <div className="flex flex-col my-2">
                  <label>Photo</label>
                  <input
                    type="file"
                    onChange={changeImageHandler}
                    className="p-3 outline-none bg-gray-100 rounded"
                  />
                </div>

                {photoUpdate && (
                  <img
                    src={photoUpdate}
                    alt="New Image"
                    className="w-full max-h-48 object-contain my-2 rounded"
                  />
                )}
                <button
                  type="submit"
                  className="bg-orange-500 w-full px-4 py-2 text-white rounded my-2"
                >
                  Update
                </button>
                <button
                  className="bg-red-500 w-full flex gap-2 items-center justify-center px-4 py-2 text-white rounded my-2"
                  onClick={deleteHandler}
                >
                  Delete
                  <FaTrash />
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
