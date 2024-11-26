import { Inter } from "next/font/google";
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Switchgear Thermal Monitoring",
  description: "Application for Monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider className="light text-foreground bg-background">
          <NextThemesProvider attribute="class" defaultTheme="light">
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
