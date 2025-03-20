import { useState, useEffect, useRef } from 'react';

export default function ScrollableForm() {
  const sections = ['Personal Info', 'Address', 'Payment Details', 'Confirmation'];
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Simulate HTTP request delay (replace with actual API call)
  useEffect(() => {
    setTimeout(() => {
      setDataLoaded(true);
    }, 2000);
  }, []);

  // Scroll to section smoothly
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: section.offsetTop - scrollContainerRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Attach scroll event only after data is loaded
  useEffect(() => {
    if (!dataLoaded || !scrollContainerRef.current) return;

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      let closestSection = sections[0];
      let closestDistance = Number.MAX_VALUE;

      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          const distanceFromTop = Math.abs(rect.top - containerRect.top);

          if (distanceFromTop < closestDistance) {
            closestDistance = distanceFromTop;
            closestSection = section;
          }
        }
      });

      setActiveSection(closestSection);
    };

    const scrollableDiv = scrollContainerRef.current;
    scrollableDiv.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize active section

    return () => {
      scrollableDiv.removeEventListener('scroll', handleScroll);
    };
  }, [dataLoaded]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', padding: '20px', borderRight: '2px solid #ccc', position: 'sticky', top: 0 }}>
        {sections.map((section) => (
          <div
            key={section}
            onClick={() => scrollToSection(section)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              background: activeSection === section ? 'blue' : 'transparent',
              color: activeSection === section ? '#fff' : '#000',
              borderRadius: '5px',
              marginBottom: '5px'
            }}
          >
            {section}
          </div>
        ))}
      </div>

      {/* Scrollable Sections */}
      {dataLoaded ? (
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            height: '100vh',
            border: '1px solid #ddd'
          }}
        >
          {sections.map((section) => (
            <div
              key={section}
              id={section}
              style={{
                height: '100vh',
                padding: '20px',
                borderBottom: '2px solid #ccc'
              }}
            >
              <h2>{section}</h2>
              <p>Content for {section} section goes here...</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Loading data...</p>
        </div>
      )}
    </div>
  );
}
