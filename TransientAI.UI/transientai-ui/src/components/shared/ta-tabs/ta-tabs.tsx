import React, {ReactNode} from 'react';
import * as Tabs from '@radix-ui/react-tabs';

interface TabItem {
  value: string;
  label: string;
  content?: ReactNode;
}

interface TabsComponentProps {
  tabs: TabItem[];
  defaultTab?: string;
  value?: string;
  activeColor?: string;
  className?: string;
  onTabChange?: (value: string) => void;
}

export const TaTabs: React.FC<TabsComponentProps> = ({ 
  tabs = [], 
  defaultTab = "", 
  activeColor = "",
  className = "",
  value,  
  onTabChange
}) => {
  // If no defaultTab is specified, use the first tab's value
  const defaultValue = defaultTab || (tabs.length > 0 ? tabs[0].value : "");
  
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs.Root
      className={className}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleTabChange}
    >
      <Tabs.List className="flex border border-[#202325] bg-transparent">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            className={`px-2 py-1 text-xs font-medium focus:outline-none 
                data-[state=active]:bg-[#0b6157]
                data-[state=active]:${activeColor} 
                data-[state=active]:text-white 
                data-[state=inactive]:text-gray-400 
                data-[state=inactive]:hover:text-gray-300 
                text-nowrap cursor-pointer`}
            value={tab.value}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      
      {/* {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
        >
          {tab.content}
        </Tabs.Content>
      ))} */}
    </Tabs.Root>
  );
};