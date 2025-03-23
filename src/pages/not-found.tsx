import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-salmon">
      <h1 className="text-9xl font-extrabold text-orange-500 tracking-widest">
        404
      </h1>
      <div className="bg-black px-2 text-sm text-white rounded rotate-12 absolute">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          to="/"
          className="relative inline-block text-sm font-medium text-black group active:text-orange-500 focus:outline-none focus:ring"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-black group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3 bg-white border border-current">
            Go Home
          </span>
        </Link>
      </button>
    </div>
  );
};

export default NotFound;
