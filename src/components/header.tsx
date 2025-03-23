import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import logo from "../assets/e-commerce-logo.svg";
import { auth } from "../firebase";
import { useCategoriesQuery } from "../redux/api/productAPI";
import { User } from "../types/types";

interface PropsType {
  user: User | null;
}
interface HeaderProps extends PropsType {
  isOpen2: boolean;
  setIsOpen2: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header = ({ user }: HeaderProps) => {
  const params = useParams();
  const { data: categoriesResponse, isLoading: loadingCategories } =
    useCategoriesQuery("");

  const categories = categoriesResponse?.categories;
  const topCategories = categories?.slice(0, 7);

  const [isFirstDropdownOpen, setIsFirstDropdownOpen] =
    useState<boolean>(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] =
    useState<boolean>(false);

  const firstDropdownRef = useRef<HTMLDivElement | null>(null);
  const secondDropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleFirstDropdown = () => {
    setIsFirstDropdownOpen(!isFirstDropdownOpen);
  };

  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen(!isSecondDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      firstDropdownRef.current &&
      !firstDropdownRef.current.contains(event.target as Node)
    ) {
      setIsFirstDropdownOpen(false);
    }
    if (
      secondDropdownRef.current &&
      !secondDropdownRef.current.contains(event.target as Node)
    ) {
      setIsSecondDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsSecondDropdownOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };
  if ("admin" in params) {
    return null;
  }

  return (
    <header className="bg-salmon text-white p-4 h-[70px] flex justify-between items-center shadow-md">
      <Link to="/">
        <img src={logo} alt="logo" loading="lazy" className="w-64" />
      </Link>

      <nav className="flex gap-4 items-center">
        <div className="relative" ref={firstDropdownRef}>
          <button
            onClick={toggleFirstDropdown}
            className="bg-soft hover:bg-orange-500/75 font-bold px-5 py-3 rounded hidden md:block"
          >
            Categories
          </button>
          {isFirstDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-20">
              {!loadingCategories &&
                topCategories?.map((i) => (
                  <div key={i}>
                    <Link
                      to={`/search/category/${i.toLowerCase()}`}
                      onClick={() => setIsFirstDropdownOpen(false)}
                      className="block px-4 py-2 text-center hover:bg-gray-200"
                    >
                      {i.toUpperCase()}
                    </Link>
                  </div>
                ))}
              <Link
                to={`/search`}
                className="block px-4 py-2 font-bold text-center hover:bg-gray-200"
                onClick={() => setIsFirstDropdownOpen(false)}
              >
                More
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Link className="" to="/search">
            <FaSearch size={25} />
          </Link>
          <Link to={"/cart"}>
            <FaCartShopping size={30} />
          </Link>
        </div>

        <div className="relative flex items-center" ref={secondDropdownRef}>
          {user?._id ? (
            <button
              onClick={toggleSecondDropdown}
              className="px-4 py-2 rounded"
            >
              <img
                src={typeof user.photo === "string" ? user.photo : undefined}
                alt="user logged in"
                loading="lazy"
                className={`w-14 h-14 rounded-full ${
                  isSecondDropdownOpen &&
                  "outline outline-4 outline-neutral-400"
                }`}
              />
            </button>
          ) : (
            <Link to={"/login"} className="mr-4">
              <LuLogOut size={25} />
            </Link>
          )}

          {isSecondDropdownOpen && (
            <div className="absolute top-[60px] right-0 mt-2 w-60 h-52 bg-white text-black text-2xl flex flex-col justify-center rounded shadow-lg z-20">
              {user?._id && (
                <div>
                  {user.role === "admin" && (
                    <Link
                      onClick={() => setIsSecondDropdownOpen(false)}
                      to="/admin/dashboard"
                      className="block px-4 py-4 text-center hover:bg-gray-200"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    onClick={() => setIsSecondDropdownOpen(false)}
                    to="/orders"
                    className="block px-4 py-4 text-center hover:bg-gray-200"
                  >
                    Orders
                  </Link>
                  <button
                    className="block w-full px-4 py-4 text-center hover:bg-red-500 hover:text-white"
                    onClick={logoutHandler}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
