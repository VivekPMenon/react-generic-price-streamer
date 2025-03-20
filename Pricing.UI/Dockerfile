import { useState, useEffect } from 'react';

export default function ScrollableForm() {
  const sections = ['Personal Info', 'Address', 'Payment Details', 'Confirmation'];
  const [activeSection, setActiveSection] = useState(sections[0]);

  // Scroll to section smoothly when clicking a sidebar link
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Detect which section is visible and update the active state
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = sections[0]; // Default to first section

      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div style={{ flex: 1, overflowY: 'scroll', padding: '20px', height: '100vh' }}>
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
    </div>
  );
}
