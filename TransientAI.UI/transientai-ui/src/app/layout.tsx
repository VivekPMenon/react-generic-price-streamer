import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { ChatbotDataContextProvider } from "@/services/chatbot-data";
import { SearchDataContextProvider } from "@/services/search-data";
import {ToastContainer} from "react-toastify";
import {Translation} from '@/components/translation/translation-component';
import "./globals.scss";

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
    <html
        lang="en"
        wm-editor-extension-available="true"
    >
    <head>
        <script src="https://kit.fontawesome.com/f60360a779.js" crossOrigin="anonymous" async></script>
    </head>

    <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans dark`}>
        <Translation>
            <Theme accentColor="teal" className="height-100p">
                <ChatbotDataContextProvider>
                  <SearchDataContextProvider>
                    {children}
                  </SearchDataContextProvider>
                </ChatbotDataContextProvider>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick={true}
                    theme="dark"
                />
            </Theme>
        </Translation>
      </body>
    </html>
  );
}