import Select from 'react-select';

const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937', // bg-gray-800
      borderColor: '#374151', // border-gray-700
      color: 'white',
      fontSize: '12px',
      padding: '0px',
      boxShadow: 'none',
      borderRadius: '8px',
      height: '25px',
      minHeight: '25px',
      '&:hover': {
        borderColor: '#4B5563' // border-gray-600 on hover
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      fontSize: '10px',
      padding: '0',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1f2937', // bg-gray-800
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '12px',
      padding: '0 4px',
      backgroundColor: state.isSelected 
        ? '#4B5563' // bg-gray-600 for selected
        : state.isFocused 
          ? '#374151' // bg-gray-700 for focused
          : '#1f2937', // bg-gray-800 for default
      color: 'white',
      '&:hover': {
        backgroundColor: '#374151', 
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontSize: '12px',
      padding: '0px',
      color: 'white'
    }),
    input: (provided: any) => ({
      ...provided,
      fontSize: '12px',
      padding: '0px',
      color: 'white',
      margin: '0px'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: '12px',
      padding: '0px',
      color: '#9CA3AF'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      fontSize: '12px',
      padding: '0px',
      color: '#9CA3AF', 
      '&:hover': {
        color: 'white'
      }
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none'
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '0px 4px', 
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: '#9CA3AF',
      padding: '0px',
      cursor: 'pointer',
      transform: 'scale(0.8)',
      '&:hover': {
        color: 'white',
      },
    }),
  };

  interface FilterDropDownProps {
    options: { value: string; label: string }[];
    value: { value: any; label: any } | null;
    onChange: (selectedOption: { value: string; label: string } | null) => void;
    placeholder?: string;
    isSearchable?: boolean;
  }

export const FilterDropDown = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    isSearchable = true
}: FilterDropDownProps) => {
    return(
        <Select
            unstyled
            isClearable={true}
            options={options}
            styles={customStyles}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            isSearchable={isSearchable}
            className="text-base"
            classNamePrefix="select"
        />
    )
}