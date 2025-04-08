import React, { useState, useEffect, useRef, useDeferredValue, useCallback } from "react";
import DOMPurify from "dompurify";
import i18n, { translateText } from '../../i18n';

export interface EmailViewerProps {
  emailHtml?: string;
  htmlSource?: string;
  title?: string;
  className?: string;
  scrollToSearchTerm?: string;
  hideSearch?: boolean;
  translateTo?: string; // optional language code like 'ja'
}

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
  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src?.startsWith("data:image")) {
      img.setAttribute("data-keep", src);
      img.removeAttribute("src");
    }
  });
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      const regex = new RegExp(`(${term})`, "gi");
      node.textContent = node.textContent.replace(regex, `%%HIGHLIGHT_START%%$1%%HIGHLIGHT_END%%`);
    }
  };
  const walkNodes = (node: Node) => {
    if (!node) return;
    processNode(node);
    node.childNodes.forEach(walkNodes);
  };
  walkNodes(doc.body);
  const highlightedHtml = doc.body.innerHTML
    .replace(/%%HIGHLIGHT_START%%/g, `<span class="highlighted">`)
    .replace(/%%HIGHLIGHT_END%%/g, `</span>`);
  const finalDoc = parser.parseFromString(highlightedHtml, "text/html");
  finalDoc.querySelectorAll("img[data-keep]").forEach((img) => {
    img.setAttribute("src", img.getAttribute("data-keep") || "");
    img.removeAttribute("data-keep");
  });
  return [finalDoc, [...highlightedHtml.matchAll(/<span class=\"highlighted\">/g)].map((_, i) => i)];
};

const sanitizeHtmlWithBase64Images = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src?.startsWith("data:image")) {
      img.setAttribute("data-keep", src);
      img.removeAttribute("src");
    }
  });
  const sanitized = DOMPurify.sanitize(doc.documentElement.innerHTML);
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
    highlightedElements[newIndex].scrollIntoView({ behavior: "smooth", block: "start" });
    highlightedElements[newIndex].classList.add("active-match");
  }
};

const cleanSearchTermEntry = (entry: string): string => {
  return entry ? entry.replace(/[^a-zA-Z0-9\-\/\s:]/g, '') : entry;
};

const EmailViewer = ({ emailHtml, htmlSource, className, scrollToSearchTerm, hideSearch, translateTo }: EmailViewerProps) => {
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [originalHtml, setOriginalHtml] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [matchIndices, setMatchIndices] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  const navigateMatches = useCallback((direction: number, index: number, indices: number[]) => {
    const ele = contentRef.current ? contentRef.current : document.body;
    navigateMatchesCore(ele, direction, index, indices, setCurrentMatchIndex);
  }, []);

  function handleSearchTermChanged(value: string) {
    setSearchTerm(cleanSearchTermEntry(value));
  }

  useEffect(() => {
    const prepareHtml = async () => {
      if (emailHtml) {
        let html = sanitizeHtmlWithBase64Images(emailHtml);
        if (translateTo) {
          try {
            html = await translateText(html, translateTo);
          } catch (e) {
            console.warn('Translation failed, showing original content');
          }
        }
        setSanitizedHtml(html);
        setOriginalHtml(html);
      } else {
        setSanitizedHtml('No Email Content Found');
        setOriginalHtml('No Email Content Found');
      }
    };
    prepareHtml();
  }, [htmlSource, emailHtml, translateTo]);

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
      {!hideSearch && (
        <div className='search-bar'>
          <div className='title'></div>
          <div className='search-toolbar'>
            <input
              type="text"
              placeholder={i18n.t("find")}
              value={searchTerm}
              onChange={(e) => handleSearchTermChanged(e.target.value)}
            />
            <i className={`fa-solid fa-chevron-left ${matchIndices?.length > 0 ? 'active' : ''}`} onClick={() => navigateMatches(-1, currentMatchIndex, matchIndices)}></i>
            <i className={`fa-solid fa-chevron-right ${matchIndices?.length > 0 ? 'active' : ''}`} onClick={() => navigateMatches(1, currentMatchIndex, matchIndices)}></i>
          </div>
        </div>
      )}
      <div ref={contentRef} className={`email-container scrollable-div ${className}`} />
    </div>
  );
};

export default EmailViewer;
