import { useEffect, useState } from "react";
import { readEml } from "eml-parse-js"; // Import the parser
// import DOMPurify from "dompurify"; // To sanitize HTML content

export default function EmlViewer() {
  const [email, setEmail] = useState<any>(null);

  useEffect(() => {
    const loadEmlFile = async () => {
      try {
        // Fetch the EML file stored in the `public/` folder
        const response = await fetch("/emails/sample.eml");
        const emlText = await response.text();

        // Parse the EML file using `eml-parse-js`
        readEml(emlText, (err, emlJson) => {
          setEmail({
            subject: emlJson?.subject || "No Subject",
            from: emlJson?.from || "Unknown Sender",
            to: emlJson?.to || "Unknown Recipient",
            date: emlJson?.date || "Unknown Date",
            html: emlJson?.html  || "No Content",
          });
        });
      } catch (error) {
        console.error("Error loading EML file:", error);
      }
    };

    loadEmlFile();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1724] text-white p-6">
      <h1 className="text-2xl font-bold">Stored EML Viewer</h1>

      {email ? (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{email.subject}</h2>
          <p className="text-sm text-gray-400">
            {/* <strong>From:</strong> {email.from} <br />
            <strong>To:</strong> {email.to} <br />
            <strong>Date:</strong> {email.date} */}
          </p>
          <div className="mt-4 border-t border-gray-600 pt-4">
            {/* Render email HTML safely */}
            <div dangerouslySetInnerHTML={{ __html: email.html }} />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-400">Loading email...</p>
      )}
    </div>
  );
}
