import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SerwistProvider } from "./serwist";
import "@styles/global.css";

export const metadata: Metadata = {
  title: "L'isola dei giochi",
  description: "Giochi educativi per bambini, anche offline.",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Isola giochi",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#7ec8e3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SerwistProvider swUrl="/sw.js" register={process.env.NODE_ENV === "production"}>
          {children}
        </SerwistProvider>
      </body>
    </html>
  );
}