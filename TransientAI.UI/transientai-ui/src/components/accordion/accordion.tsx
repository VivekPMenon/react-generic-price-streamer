import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { DoubleArrowRightIcon } from '@radix-ui/react-icons'

// Type definition for accordion items
interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
  titleTextStyle?: string;
}

// Accordion component props
interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  type?: 'single' | 'multiple';
}

const Accordion: React.FC<AccordionProps> = ({ 
  items, 
  className = '', 
  type = 'single' 
}) => {
  return (
    <AccordionPrimitive.Root 
      type={type}
      className={`w-full ${className}`}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          className=""
        >
          <AccordionPrimitive.Header className={`flex ${item.titleTextStyle}`}>
            <AccordionPrimitive.Trigger
              className="group flex flex-1 items-center justify-start p-4 text-left 
                         hover:bg-gray-800 focus:outline-none"
            >
               <DoubleArrowRightIcon
                className={`h-5 w-5 mr-2 transition-transform duration-300 
                           group-data-[state=open]:rotate-90 
                          `}
              />
              <span className="text-base font-medium">{item.title}</span>
             
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content
            className="overflow-hidden text-white 
                       data-[state=open]:animate-slideDown 
                       data-[state=closed]:animate-slideUp"
          >
            <div className="py-3">
              {item.content}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};

// Example usage component
const AccordionExample = () => {
  const accordionItems: AccordionItem[] = [
    {
      value: 'item-1',
      title: 'What is an Accordion?',
      content: (
        <p>
          An accordion is a user interface component that expands and collapses 
          to reveal or hide content, typically used to organize and present 
          information in a compact, interactive manner.
        </p>
      )
    },
    {
      value: 'item-2',
      title: 'Accessibility Features',
      content: (
        <div>
          <p>Our accordion supports:</p>
          <ul className="list-disc pl-5">
            <li>Keyboard navigation</li>
            <li>Screen reader compatibility</li>
            <li>ARIA attributes for enhanced accessibility</li>
          </ul>
        </div>
      )
    },
    {
      value: 'item-3',
      title: 'Customization Options',
      content: (
        <p>
          Easily customize the accordion`s appearance and behavior 
          by passing different props and styling classes.
        </p>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto p-4">
      <Accordion 
        items={accordionItems} 
        type="single"
      />
    </div>
  );
};

export { Accordion, AccordionExample };