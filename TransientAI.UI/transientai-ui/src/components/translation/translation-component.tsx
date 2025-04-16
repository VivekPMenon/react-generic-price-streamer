import Script from "next/script";

export function Translation({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>
            <div id="google_translate_element"></div>
            {children}
            <Script id="google-translate-init" strategy="afterInteractive">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'auto',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
              }
            `}
            </Script>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
        </>
    );
}