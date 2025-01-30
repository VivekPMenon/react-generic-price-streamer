import ReactMarkdown from 'react-markdown';
import React, { useEffect, useRef, useState } from "react";
import rehypeRaw from "rehype-raw";

export interface SearchableMarkdownProps {
  title?: string;
  className?: string;
  markdownContent?: any;
}

export const SearchableMarkdown = ({ markdownContent, className, title }: SearchableMarkdownProps) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        setShowSearchBar(true);
      }
      if (event.key === "Escape") {
        setShowSearchBar(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Find matches when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setMatches([]);
      setCurrentIndex(0);
      return;
    }
    const regex = new RegExp(searchTerm, "gi");
    const matchArray = [...markdownContent.matchAll(regex)].map((match) => match.index);
    setMatches(matchArray as any);
    setCurrentIndex(0);
  }, [searchTerm, markdownContent]);

  // Highlight matches in Markdown content
  const getMarkdownText = () => {
    if (!searchTerm) return markdownContent;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return markdownContent.replace(
      regex,
      `<mark style="background:yellow;color:black;">$1</mark>`
    );
  };

  const navigateMatches = (direction: any) => {
    if (!matches.length) return;

    setCurrentIndex((prev) =>
      direction === "next"
        ? (prev + 1) % matches.length
        : (prev - 1 + matches.length) % matches.length
    );
  };

  // Auto-scroll to the current match
  useEffect(() => {
    if (matches.length && contentRef.current) {
      const marks = (contentRef.current as any).querySelectorAll("mark");

      if (marks.length > 0) {
        marks[currentIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentIndex, matches]);

  return (
    <div className='markdown'>
      <div className='search-bar'>
        <div className='title'>
          {title}
        </div>

        <div className='search-toolbar'>
          <input
            type="text"
            placeholder="Find..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "150px" }}
          />
          <i className='fa-solid fa-chevron-left' onClick={() => navigateMatches("prev")}></i>
          <i className='fa-solid fa-chevron-right' onClick={() => navigateMatches("next")}></i>
          {/* <button onClick={() => navigateMatches("next")} disabled={!matches.length}>Next</button> */}
          {/* <button onClick={() => navigateMatches("next")} disabled={!matches.length}>Next</button> */}
          {/* <button onClick={() => setShowSearchBar(false)}>Close</button> */}
        </div>
{/* 
        <span style={{ marginLeft: "10px" }}>
          {matches.length ? `${currentIndex + 1} / ${matches.length}` : "No matches"}
        </span> */}
      </div>

      <div ref={contentRef} className={`react-markdown scrollable-div ${className}`}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{getMarkdownText()}</ReactMarkdown>
      </div>
    </div>
  );
};