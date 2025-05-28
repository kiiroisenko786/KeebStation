import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/shop/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Products from "../../features/shop/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {path: "", element: <HomePage />},
      {path: "/products", element: <Products />},
      {path: "/products/:id", element: <ProductDetails />},
      {path: "/about", element: <AboutPage />},
      {path: "/contact", element: <ContactPage />},
    ]
  }
])