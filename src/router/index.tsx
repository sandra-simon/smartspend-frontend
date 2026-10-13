import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetLinkSentPage from "../pages/ResetLinkSentPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import TransactionsPage from "../pages/TransactionsPage";
import AddTransactionPage from "../pages/AddTransactionPage";
import TransactionDetailsPage from "../pages/TransactionDetailsPage";
import EditTransactionPage from "../pages/EditTransactionPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/get-started",
    element: <RegisterPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/transactions", element: <TransactionsPage /> },
      { path: "/transactions/new", element: <AddTransactionPage /> },
      { path: "/transactions/:transactionId", element: <TransactionDetailsPage /> },
      { path: "/transactions/:transactionId/edit", element: <EditTransactionPage /> },
    ],
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-link-sent",
    element: <ResetLinkSentPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);

export default router;
