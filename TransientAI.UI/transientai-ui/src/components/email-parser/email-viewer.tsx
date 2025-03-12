import React, { useState, useEffect, useRef, useDeferredValue, useCallback } from "react";
import DOMPurify from "dompurify";
import {executeAsync} from "@/lib/utility-functions/async";

export interface EmailViewerProps {
  emailHtml?: string;
  htmlSource?: string;
  title?: string;
  className?: string;
  //todo: remove this and its usage. its a hack
  scrollToSearchTerm?: string;
}

// Debounce Hook for better performance
// const useDebounce = (value: string, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//
//   return debouncedValue;
// };

const EmailViewer = ({ emailHtml, htmlSource, className, scrollToSearchTerm }: EmailViewerProps) => {
  
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [originalHtml, setOriginalHtml] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [matchIndices, setMatchIndices] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // const extractBodyContent = (htmlString: any) => {
  //   const match = htmlString.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  //   return match ? match[1] : htmlString; // Return body content or fallback to full string
  // };

  const sanitizeHtmlWithBase64Images = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Process each image separately and mark base64 images
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src?.startsWith("data:image")) {
        img.setAttribute("data-keep", src); // Temporarily store base64 src
        img.removeAttribute("src"); // Remove it from sanitization
      }
    });

    // Sanitize the HTML (excluding the base64 images)
    const sanitized = DOMPurify.sanitize(doc.documentElement.innerHTML);

    // Restore base64 images
    const sanitizedDoc = parser.parseFromString(sanitized, "text/html");
    sanitizedDoc.querySelectorAll("img[data-keep]").forEach((img) => {
      img.setAttribute("src", img.getAttribute("data-keep") || "");
      img.removeAttribute("data-keep");
    });

    return sanitizedDoc.documentElement.innerHTML;
  };

  const navigateMatches = useCallback((direction: number) => {
    if (matchIndices.length === 0) return;

    let newIndex = currentMatchIndex + direction;
    if (newIndex < 0) newIndex = matchIndices.length - 1;
    if (newIndex >= matchIndices.length) newIndex = 0;
    setCurrentMatchIndex(newIndex);

    const highlightedElements = document.querySelectorAll(".highlighted");
    if (highlightedElements[newIndex]) {
      highlightedElements[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      highlightedElements.forEach((el) => el.classList.remove("active-match"));
      highlightedElements[newIndex].classList.add("active-match");
    }
  }, []);

  useEffect(() => {
    if (emailHtml) {
      const cleanHtml = sanitizeHtmlWithBase64Images(emailHtml);
      setSanitizedHtml(cleanHtml);
      setOriginalHtml(cleanHtml);
    } else {
      setSanitizedHtml('No Email Content Found');
      setOriginalHtml('No Email Content Found');
    }

    // todo.. let us figure out if we really need a html file based fetch
    // fetch(htmlSource!)
    //   .then((res) => res.text())
    //   .then((html) => {
    //     const cleanHtml = sanitizeHtmlWithBase64Images(html);
    //     setSanitizedHtml(cleanHtml);
    //     setOriginalHtml(cleanHtml);
    //   });
  }, [htmlSource, emailHtml]);

  useEffect(() => {
    const resetHighlighting = () => {
      setSanitizedHtml(originalHtml);
      setMatchIndices([]);
      setCurrentMatchIndex(0);
    };

    const highlightMatches = (term: string) => {
      if (!originalHtml) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(originalHtml, "text/html");

      // Avoid altering base64 images inside <img> tags
      doc.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        if (src?.startsWith("data:image")) {
          img.setAttribute("data-keep", src); // Store base64 separately
          img.removeAttribute("src"); // Temporarily remove it from HTML
        }
      });

      // Process only visible text nodes, excluding image src attributes
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          const regex = new RegExp(`(${term})`, "gi");
          node.textContent = node.textContent.replace(
              regex,
              `%%HIGHLIGHT_START%%$1%%HIGHLIGHT_END%%`
          );
        }
      };

      const walkNodes = (node: Node) => {
        if (!node) return;
        processNode(node);
        node.childNodes.forEach(walkNodes);
      };

      walkNodes(doc.body);

      // Convert placeholders to actual highlight spans
      const highlightedHtml = doc.body.innerHTML
          .replace(/%%HIGHLIGHT_START%%/g, `<span class="highlighted">`)
          .replace(/%%HIGHLIGHT_END%%/g, `</span>`);

      // Restore base64 images
      const finalDoc = parser.parseFromString(highlightedHtml, "text/html");
      finalDoc.querySelectorAll("img[data-keep]").forEach((img) => {
        img.setAttribute("src", img.getAttribute("data-keep") || "");
        img.removeAttribute("data-keep");
      });

      setSanitizedHtml(finalDoc.documentElement.innerHTML);
      setMatchIndices([...highlightedHtml.matchAll(/<span class="highlighted">/g)].map((_, i) => i));
      setCurrentMatchIndex(0);
    };

    if (!deferredSearchTerm.trim()) {
      resetHighlighting();
      return;
    }
    highlightMatches(deferredSearchTerm);
  }, [deferredSearchTerm, navigateMatches, originalHtml, scrollToSearchTerm]);

  useEffect(() => {
    if (scrollToSearchTerm) {
      setSearchTerm(scrollToSearchTerm);
      executeAsync(() => {
        navigateMatches(1);
      }, 350);
    }
  }, [scrollToSearchTerm]);

  return (
    <div className="email-viewer-container">
      <div className='search-bar'>
        <div className='title'>
          {/* {title} */}
        </div>

        <div className='search-toolbar'>
          <input
            type="text"
            placeholder="Find..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className={`fa-solid fa-chevron-left ${matchIndices?.length > 0 ? 'active' : ''}`} onClick={() => navigateMatches(-1)}></i>
          <i className={`fa-solid fa-chevron-right ${matchIndices?.length > 0 ? 'active' : ''}`} onClick={() => navigateMatches(1)}></i>
          {/* <button onClick={() => navigateMatches("next")} disabled={!matches.length}>Next</button> */}
          {/* <button onClick={() => navigateMatches("next")} disabled={!matches.length}>Next</button> */}
          {/* <button onClick={() => setShowSearchBar(false)}>Close</button> */}
        </div>
        {/* 
        <span style={{ marginLeft: "10px" }}>
          {matches.length ? `${currentIndex + 1} / ${matches.length}` : "No matches"}
        </span> */}
      </div>

      <div
        ref={contentRef}
        className={`email-container scrollable-div ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};

export default EmailViewer;
