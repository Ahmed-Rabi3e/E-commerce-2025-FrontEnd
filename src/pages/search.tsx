import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFilter } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const location = useLocation();
  const { category: paramSearch } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(paramSearch || "");
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const newCategory = location.pathname.split("/").pop() || "";
    if (newCategory !== "search" && newCategory !== category) {
      setCategory(newCategory);
    }
  }, [location, category]);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = searchedData && page < searchedData.totalPage;

  if (isError) toast.error((error as CustomError).data.message);
  if (productIsError) toast.error((productError as CustomError).data.message);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Mobile Filter Button */}
      <div className="flex justify-between items-center md:hidden">
        <h1 className="text-3xl font-bold">Products</h1>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger className="p-4 bg-gray-200 rounded-full">
            <FaFilter className="h-8 w-8 text-orange-500" />
          </DrawerTrigger>
          <DrawerContent className="px-6 py-16 pb-24">
            <DrawerTitle></DrawerTitle>
            <FilterSection
              sort={sort}
              setSort={setSort}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              category={category}
              setCategory={setCategory}
              categoriesResponse={categoriesResponse}
              loadingCategories={loadingCategories}
            />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters (Hidden on mobile) */}
        <aside className="hidden md:flex w-80 shadow-lg p-6 flex-col bg-soft">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <FilterSection
            sort={sort}
            setSort={setSort}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            category={category}
            setCategory={setCategory}
            categoriesResponse={categoriesResponse}
            loadingCategories={loadingCategories}
          />
        </aside>

        {/* Product List */}
        <main className="w-full">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-4 bg-gray-100 w-full outline-none text-black rounded-lg my-4"
          />

          {productLoading ? (
            <Skeleton length={10} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchedData?.products.map((i) => (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                  photo={i.photo}
                  category={i.category}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {searchedData && searchedData.totalPage > 1 && (
            <div className="flex justify-center items-center gap-5 mt-5">
              <button
                className="bg-soft hover:bg-black font-bold px-4 py-2 text-white rounded"
                disabled={!isPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span className="font-bold">
                {page} of {searchedData.totalPage}
              </span>
              <button
                className="bg-soft hover:bg-black font-bold px-4 py-2 text-white rounded"
                disabled={!isNextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const FilterSection = ({
  sort,
  setSort,
  maxPrice,
  setMaxPrice,
  category,
  setCategory,
  categoriesResponse,
  loadingCategories,
}: {
  sort: string;
  setSort: (value: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  categoriesResponse?: { categories: string[] }; // Ensure TypeScript recognizes the categories
  loadingCategories: boolean;
}) => {
  return (
    <>
      <div>
        <h4 className="text-xl font-bold">Sort</h4>
        <select
          className="p-3 bg-salmon w-full mt-2 outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">None</option>
          <option value="asc">Price (Low to High)</option>
          <option value="dsc">Price (High to Low)</option>
        </select>
      </div>

      <div>
        <h4 className="text-xl font-bold mt-6">
          Max Price: <span className="text-black">{maxPrice}</span>
        </h4>
        <input
          type="range"
          min={100}
          max={100000}
          value={maxPrice}
          className="w-full mt-2"
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>

      <div>
        <h4 className="text-xl font-bold mt-6">Category</h4>
        <select
          className="p-3 bg-salmon w-full mt-2 outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">ALL</option>
          {!loadingCategories &&
            categoriesResponse?.categories.map((i: string) => (
              <option key={i} value={i}>
                {i.toUpperCase()}
              </option>
            ))}
        </select>
      </div>
    </>
  );
};
export default Search;
