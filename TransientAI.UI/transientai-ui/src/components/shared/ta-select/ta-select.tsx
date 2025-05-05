'use client';
import React from 'react';
import Select from 'react-select';

export interface DropdownOption<T> {
  value: string | number;
  label: string;
  data: T;
}

interface SharedDropdownProps<T> {
  options: DropdownOption<T>[];
  value: DropdownOption<T> | null;
  onChange: (selected: DropdownOption<T> | null) => void;
  isLoading?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  noOptionsMessage?: () => string;
  darkMode?: boolean;
}

const SharedDropdown = <T,>({
  options,
  value,
  onChange,
  isLoading = false,
  placeholder = "Select an option",
  isSearchable = true,
  className = "text-base",
  noOptionsMessage = () => "No options found",
  darkMode = true,
}: SharedDropdownProps<T>) => {
  
  // Custom styles for react-select to match your theme
  const darkStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937', // bg-gray-800
      width: '200px',
      borderColor: '#374151', // border-gray-700
      color: 'white',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#4B5563' // border-gray-600 on hover
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937', // bg-gray-800
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#4B5563' // bg-gray-600 for selected
        : state.isFocused 
          ? '#374151' // bg-gray-700 for focused
          : '#1f2937', // bg-gray-800 for default
      color: 'white',
      '&:hover': {
        backgroundColor: '#374151', // bg-gray-700 on hover
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white'
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white',
      boxShadow: 'none'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9CA3AF' // text-gray-400
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#9CA3AF', // text-gray-400
      '&:hover': {
        color: 'white'
      }
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: '#4B5563' // bg-gray-600
    }),
  };

  const lightStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: '#e5e7eb', // border-gray-200
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#d1d5db' // border-gray-300 on hover
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#e5e7eb' // bg-gray-200 for selected
        : state.isFocused 
          ? '#f3f4f6' // bg-gray-100 for focused
          : 'white', // default
    }),
  };

  const customStyles = darkMode ? darkStyles : lightStyles;

  const handleChange = (selectedOption: any) => {
    onChange(selectedOption || null);
  };

  return (
    <div className="flex-grow">
      <Select
        isLoading={isLoading}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={className}
        classNamePrefix="select"
        isSearchable={isSearchable}
        noOptionsMessage={() => noOptionsMessage()}
      />
    </div>
  );
};

export default SharedDropdown;