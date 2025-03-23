import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/e-commerce-logo.svg";

const Footer = () => {
  return (
    <footer className="bg-soft text-black pt-16 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/">
              <img src={logo} alt="logo" loading="lazy" className="w-64" />
            </Link>
            <p className="text-black">Excited? Us too. Let's get moving.</p>
            <button className="bg-salmon text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-all">
              Home Page
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-white transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#insights"
                  className="hover:text-white transition-colors"
                >
                  Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 text-black">
            <h3 className="text-2xl font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-black">
              <li>Email: ahmedrabie54524@gmail.com</li>
              <li>Phone: +201099216165</li>
              <li>Address: 1234 St, Winterfell</li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#twitter"
                className="bg-salmon p-3 rounded-full hover:bg-blue-500 transition-all"
              >
                <FaTwitter className="text-xl text-black hover:text-white" />
              </a>
              <a
                href="#linkedin"
                className="bg-salmon p-3 rounded-full hover:bg-blue-700 transition-all"
              >
                <FaLinkedin className="text-xl text-black hover:text-white" />
              </a>
              <a
                href="#facebook"
                className="bg-salmon p-3 rounded-full hover:bg-black transition-all"
              >
                <FaGithub className="text-xl text-black hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-lg text-black">
          <span className="block md:inline md:mr-4">
            © {new Date().getFullYear()} E-Commerce
          </span>
        </div>
      </div>

      {/* Glassmorphism Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-transparent opacity-10 pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
