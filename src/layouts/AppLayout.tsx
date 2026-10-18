import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AppHeader from "../components/organisms/AppHeader";
import { fetchCurrentUser } from "../services/transactionsService";

interface AppLayoutProps {
  children: ReactNode;
  username?: string;
  email?: string;
  wide?: boolean;
}

function AppLayout({
  children,
  username: initialUsername,
  email: initialEmail,
  wide = false,
}: AppLayoutProps) {
  const [username, setUsername] = useState(initialUsername ?? "My Account");
  const [email, setEmail] = useState(initialEmail ?? "");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await fetchCurrentUser();

        if (active) {
          setUsername(
            profile.username?.trim() || profile.email || "My Account",
          );
          setEmail(profile.email || "");
        }
      } catch {
        // Keep the fallback account details if the profile request fails.
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <AppHeader username={username} email={email} />

      <main
        className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${
          wide ? "max-w-[1400px]" : "max-w-7xl"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
