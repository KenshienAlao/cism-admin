import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { APP_NAME } from "@/config/app.config";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#000',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: '16px',
              },
            }}
          />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
