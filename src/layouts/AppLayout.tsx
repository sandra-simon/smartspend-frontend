import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/organisms/AppHeader";
import { fetchCurrentUser } from "../services/transactionsService";

function AppLayout() {
  const [username, setUsername] = useState("My Account");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;

    fetchCurrentUser()
      .then((profile) => {
        if (!active) return;
        setUsername(profile.username?.trim() || profile.email || "My Account");
        setEmail(profile.email || "");
      })
      .catch(() => {
        // Keep fallback account details if profile loading fails.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <AppHeader username={username} email={email} />
      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
