import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.scss";
import { ChatbotDataContextProvider } from "@/services/chatbot-data";
import { SearchDataContextProvider } from "@/services/search-data";
import {ToastProvider, ToastViewport} from "@radix-ui/react-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Transient AI",
//   description: "AI Solution for your trading activities",
// };

export const metadata: Metadata = {
  title: "Hurricane Capital",
  description: "AI Solution for your trading activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/9a71b0f99c.js" crossOrigin="anonymous" async></script>
      </head>
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans dark`}>
        <Theme accentColor="teal" className="height-100p">
          <ToastProvider>
            <ChatbotDataContextProvider>
              <SearchDataContextProvider>
                {children}
              </SearchDataContextProvider>
            </ChatbotDataContextProvider>
            <ToastViewport />
         </ToastProvider>
        </Theme>
      </body>
    </html>
  );
}