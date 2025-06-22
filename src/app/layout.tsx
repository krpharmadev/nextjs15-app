import { Outfit } from "next/font/public";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "QuickCart - GreatStack",
  description: "E-Commerce with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SessionProvider>
          <AppContextProvider>
            <Toaster />
            {children}
          </AppContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
