import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "Testify AI | AI Test Automation Agent",
  description: "AI Test Automation Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body style={{ margin: 0, padding: 0 }}>
          <Provider>
            {children}

          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
