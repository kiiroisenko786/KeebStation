import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ProductDetails from "../../features/shop/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Products from "../../features/shop/Products";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";
import OrdersPage from "../../features/orders/OrdersPage";
import OrderDetailedPage from "../../features/orders/OrderDetailedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Protect the checkout route with RequireAuth
      {element: <RequireAuth />, children: [
        {path: "checkout", element: <CheckoutPage />},
        {path: "checkout/success", element: <CheckoutSuccess />},
        {path: "orders", element: <OrdersPage />},
        {path: "orders/:id", element: <OrderDetailedPage />},
      ]},
      {path: "", element: <HomePage />},
      {path: "products", element: <Products />},
      {path: "products/:id", element: <ProductDetails />},
      {path: "about", element: <AboutPage />},
      {path: "contact", element: <ContactPage />},
      {path: "server-error", element: <ServerError/>},
      {path: "login", element: <LoginForm/>},
      {path: "register", element: <RegisterForm/>},
      {path: "not-found", element: <NotFound />},
      {path: "*", element: <Navigate replace to={"/not-found"} />},
      {path: "basket", element: <BasketPage />},
    ]
  }
])