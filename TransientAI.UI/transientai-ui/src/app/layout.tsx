import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.scss";
import { ChatbotDataContextProvider } from "@/services/chatbot-data";
import { SearchDataContextProvider } from "@/services/search-data";
import {ToastContainer} from "react-toastify";

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
        <script src="https://kit.fontawesome.com/9a71b0f99c.js" crossOrigin="anonymous" async></script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans dark`}>
        <div id="google_translate_element"></div>
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

        <script
            dangerouslySetInnerHTML={{
              __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
              }
            `,
            }}
        />
        <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

      </body>
    </html>
  );
}