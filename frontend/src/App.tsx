import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import LandingPage from "./Landing/LandingPage";
import DashboardPage from "./Dashboard/DashboardPage";
import AuthPage from "./Auth/AuthPage";
import type { UserProfile } from "./Auth/AuthPage";

export type PageView = "landing" | "auth" | "dashboard";

function getPageFromHash(): PageView {
  const hash = window.location.hash.toLowerCase();
  if (hash.includes("dashboard")) {
    return "dashboard";
  }
  if (hash.includes("auth") || hash.includes("login") || hash.includes("signin")) {
    return "auth";
  }
  return "landing";
}

const DEFAULT_USER: UserProfile = {
  name: "Rakshana",
  email: "rakshana.authority@nera.gov.in",
  role: "Authority / Analyst"
};

export default function App() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const [currentPage, setCurrentPage] = useState<PageView>(() => getPageFromHash());
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("nera_auth_user");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  // Sync Clerk authenticated user with application user state
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      const displayName = clerkUser.fullName || clerkUser.firstName || user.name;
      const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || user.email;
      const role = (clerkUser.publicMetadata?.role as string) || user.role || "Authority / Analyst";

      const updatedUser: UserProfile = {
        name: displayName,
        email: primaryEmail,
        role
      };
      setUser(updatedUser);
      try {
        localStorage.setItem("nera_auth_user", JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
    }
  }, [isSignedIn, clerkUser]);

  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.location.hash = page === "dashboard" ? "#/dashboard" : page === "auth" ? "#/auth" : "#/";
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem("nera_auth_user", JSON.stringify(authenticatedUser));
    } catch {
      // ignore
    }
    navigateTo("dashboard");
  };

  const handleUpdateUser = (updated: { name: string; email?: string; role?: string }) => {
    setUser((prev) => {
      const next = {
        ...prev,
        name: updated.name || prev.name,
        email: updated.email || prev.email,
        role: updated.role || prev.role
      };
      try {
        localStorage.setItem("nera_auth_user", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem("nera_auth_user");
    navigateTo("landing");
  };

  // Route Protection: Protect Dashboard route with Clerk authentication
  if (currentPage === "dashboard") {
    if (isLoaded && !isSignedIn && !localStorage.getItem("nera_auth_user")) {
      return (
        <AuthPage
          initialUser={user}
          onSuccess={handleAuthSuccess}
          onBackToHome={() => navigateTo("landing")}
        />
      );
    }

    return (
      <DashboardPage
        userName={user.name}
        userEmail={user.email}
        userRole={user.role}
        onUpdateUser={handleUpdateUser}
        onBackToHome={handleSignOut}
      />
    );
  }

  if (currentPage === "auth") {
    return (
      <AuthPage
        initialUser={user}
        onSuccess={handleAuthSuccess}
        onBackToHome={() => navigateTo("landing")}
      />
    );
  }

  return <LandingPage onGetStarted={() => navigateTo(isSignedIn ? "dashboard" : "auth")} />;
}