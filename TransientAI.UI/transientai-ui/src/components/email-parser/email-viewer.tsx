import React, { useState, useEffect, useRef, useDeferredValue, useCallback } from "react";
import DOMPurify from "dompurify";
import i18n from '../../i18n';

export interface EmailViewerProps {
  emailHtml?: string;
  htmlSource?: string;
  title?: string;
  className?: string;
  //todo: remove this and its usage. its a hack
  scrollToSearchTerm?: string;
  hideSearch?: boolean;
}

// Debounce Hook for better performance
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const highlightMatches = (originalHtml: string, term: string): null | [Document, number[]] => {
  if (!originalHtml) return null;

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

  return [finalDoc, [...highlightedHtml.matchAll(/<span class="highlighted">/g)].map((_, i) => i)];
};

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

const navigateMatchesCore = (doc: HTMLElement, direction: number, currentMatch: number, matches: number[], onNewMatch: (i: number) => void) => {
  const highlightedElements = doc.querySelectorAll(".highlighted");
  highlightedElements.forEach((el) => el.classList.remove("active-match"));

  if (matches.length === 0) return;

  let newIndex = currentMatch + direction;
  if (newIndex < 0) newIndex = matches.length - 1;
  if (newIndex >= matches.length) newIndex = 0;
  onNewMatch(newIndex);

  if (highlightedElements[newIndex]) {
    highlightedElements[newIndex].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    highlightedElements[newIndex].classList.add("active-match");
  }
};

const cleanSearchTermEntry = (entry: string): string => {
  return entry ? entry.replace(/[^a-zA-Z0-9\-\/\s:]/g, '') : entry;
};

const EmailViewer = ({ emailHtml, htmlSource, className, scrollToSearchTerm, hideSearch }: EmailViewerProps) => {

  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [originalHtml, setOriginalHtml] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [matchIndices, setMatchIndices] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  const navigateMatches = useCallback(
    (direction: number, index: number, indices: number[]) => {
      const ele = contentRef.current ? contentRef.current : document.body;
      navigateMatchesCore(ele, direction, index, indices, setCurrentMatchIndex);
    }, []);

  function handleSearchTermChanged(value: string) {
    setSearchTerm(cleanSearchTermEntry(value));
  }

  useEffect(() => {
    if (emailHtml) {
      const cleanHtml = sanitizeHtmlWithBase64Images(emailHtml);
      setSanitizedHtml(cleanHtml);
      setOriginalHtml(cleanHtml);
    } else {
      setSanitizedHtml('No Email Content Found');
      setOriginalHtml('No Email Content Found');
    }
  }, [htmlSource, emailHtml]);

  useEffect(() => {
    if (!deferredSearchTerm.trim()) {
      setSanitizedHtml(originalHtml);
      setMatchIndices([]);
      setCurrentMatchIndex(0);
      return;
    }

    const result = highlightMatches(originalHtml, deferredSearchTerm);
    if (result) {
      const [finalDoc, matches] = result;
      setSanitizedHtml(finalDoc.documentElement.innerHTML);
      setMatchIndices(matches);
      setCurrentMatchIndex(0);
    }
  }, [deferredSearchTerm, originalHtml, navigateMatches]);

  useEffect(() => {
    if (scrollToSearchTerm) {
      handleSearchTermChanged(scrollToSearchTerm);
    }
  }, [scrollToSearchTerm]);

  useEffect(() => {
    if (contentRef.current) {
      setIsContentLoaded(false);
      contentRef.current.innerHTML = sanitizedHtml;
      setIsContentLoaded(true);
    }
  }, [sanitizedHtml]);

  useEffect(() => {
    if (isContentLoaded) {
      navigateMatches(0, currentMatchIndex, matchIndices);
    }
  }, [currentMatchIndex, isContentLoaded, matchIndices, navigateMatches]);

  return (
    <div className="email-viewer-container">
      {
        !hideSearch &&
        <div className='search-bar'>
          <div className='title'>
            {/* {title} */}
          </div>

          <div className='search-toolbar'>
            <input
              type="text"
              placeholder={i18n.t("find")}
              value={searchTerm}
              onChange={(e) => handleSearchTermChanged(e.target.value)}
            />
            <i className={`fa-solid fa-chevron-left ${matchIndices?.length > 0 ? 'active' : ''}`} onClick={() => navigateMatches(-1, currentMatchIndex, matchIndices)}></i>
            <i className={`fa-solid fa-chevron-right ${matchIndices?.length > 0 ? 'active' : ''}`} onClick={() => navigateMatches(1, currentMatchIndex, matchIndices)}></i>
            {/* <button onClick={() => navigateMatches("next")} disabled={!matches.length}>Next</button> */}
            {/* <button onClick={() => navigateMatches("next")} disabled={!matches.length}>Next</button> */}
            {/* <button onClick={() => setShowSearchBar(false)}>Close</button> */}
          </div>
          {/* 
        <span style={{ marginLeft: "10px" }}>
          {matches.length ? `${currentIndex + 1} / ${matches.length}` : "No matches"}
        </span> */}
        </div>
      }

      <div
        ref={contentRef}
        className={`email-container scrollable-div ${className}`}
      />
    </div>
  );
};

export default EmailViewer;
