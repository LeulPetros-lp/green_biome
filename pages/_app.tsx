// pages/_app.tsx
import type { AppProps } from "next/app";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// Import Google Fonts
import { Playfair_Display, Quicksand, Poppins } from "next/font/google";
import "@/styles/globals.css";

// Import AuthProvider and useAuth
import { AuthProvider } from "@/config/context/AuthContext";

// Import the LoadingSpinner component
import LoadingSpinner from "../components/Loading";

// Configure Google Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Existing fonts from "@/config/fonts"
import { fontSans, fontMono } from "@/config/fonts";

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);  // Loading state
  const router = useRouter();

  // Listen for route change events
  useEffect(() => {
    const handleStart = () => setLoading(true);  // Set loading to true on route change start
    const handleComplete = () => setLoading(false);  // Set loading to false on route change complete
    const handleError = () => setLoading(false);  // Handle route change error

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    // Cleanup event listeners on unmount
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  return (
    <div
      className={`${playfair.variable} ${quicksand.variable} ${poppins.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      {/* Wrap the whole application with AuthProvider */}
      <AuthProvider>
        {/* Wrap your app with HeroUIProvider and NextThemesProvider */}
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider>
            {loading ? (
              <LoadingSpinner />  // Display loading spinner when loading is true
            ) : (
              <Component {...pageProps} />  // Render the page component otherwise
            )}
          </NextThemesProvider>
        </HeroUIProvider>
      </AuthProvider>
    </div>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
  playfair: playfair.style.fontFamily,
  quicksand: quicksand.style.fontFamily,
  poppins: poppins.style.fontFamily,
};
