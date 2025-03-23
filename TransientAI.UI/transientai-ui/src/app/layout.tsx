import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { ChatbotDataContextProvider } from "@/services/chatbot-data";
import { SearchDataContextProvider } from "@/services/search-data";
import {ToastProvider, ToastViewport} from "@radix-ui/react-toast";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';
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

const locale = await getLocale();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang={locale}>
      <head>
        <script src="https://kit.fontawesome.com/9a71b0f99c.js" crossOrigin="anonymous" async></script>
      </head>
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans dark`}>
        <Theme accentColor="teal" className="height-100p">
          <NextIntlClientProvider >
              <ToastProvider>
                <ChatbotDataContextProvider>
                  <SearchDataContextProvider>
                    {children}
                  </SearchDataContextProvider>
                </ChatbotDataContextProvider>
                <ToastViewport />
             </ToastProvider>
         </NextIntlClientProvider>
        </Theme>
      </body>
    </html>
  );
}