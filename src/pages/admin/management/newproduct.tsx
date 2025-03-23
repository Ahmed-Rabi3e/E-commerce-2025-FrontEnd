import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || stock < 0 || !category || !photo) return;

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("photo", photo);
    formData.set("category", category);

    const res = await newProduct({ id: user?._id!, formData });

    responseToast(res, navigate, "/admin/product");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="flex flex-col justify-center items-center">
        <article>
          <form
            onSubmit={submitHandler}
            className="bg-white px-10 py-20 rounded shadow-xl"
          >
            <h2 className="text-center font-bold my-4 text-2xl">New Product</h2>
            <div className="flex flex-col my-2">
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 outline-none bg-gray-100 rounded"
              />
            </div>
            <div className="flex flex-col my-2">
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="p-3 outline-none bg-gray-100 rounded"
              />
            </div>
            <div className="flex flex-col my-2">
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="p-3 outline-none bg-gray-100 rounded"
              />
            </div>

            <div className="flex flex-col my-2">
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 outline-none bg-gray-100 rounded"
              />
            </div>

            <div className="flex flex-col my-2">
              <label>Photo</label>
              <input
                required
                type="file"
                onChange={changeImageHandler}
                className="p-3 outline-none bg-gray-100 rounded "
              />
            </div>

            {photoPrev && (
              <img src={photoPrev} alt="New Image" loading="lazy" />
            )}
            <button
              type="submit"
              className="bg-orange-500 w-full px-4 py-2 text-white rounded my-2"
            >
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
