import Select from 'react-select';

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'transparent', 
    borderColor: '#202325', 
    borderWidth: '0.5px',             
    borderStyle: 'solid',
    color: 'white',
    fontSize: '12px',
    padding: '2px 4px',
    cursor: 'pointer',
    borderRadius: '0',
    boxShadow: 'none',
    width: '100%',
    minHeight: '24px',
    '&:hover': {
      borderColor: '#4b5055',
    },
    '&:focus': {
      borderColor: '#202325',
    }
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1a1a1a',
    borderRadius: '0',
    cursor: 'pointer',
    marginTop: '2px',
     borderColor: '#4b5055',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: 'pointer',
    backgroundColor: state.isSelected 
      ? '#333333'
      : state.isFocused 
        ? '#2a2a2a'
        : '#1a1a1a',
    color: 'white',
    fontSize: '12px',
    padding: '6px 10px',
    '&:hover': {
      backgroundColor: '#2a2a2a',
    }
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
    display: 'flex',
    fontSize: '12px',
    fontWeight: '500',
    margin: '0',
    padding: '0'
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 4px',
    display: 'flex'
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
    margin: '0',
    padding: '0'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'white',
    fontSize: '12px'
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#666',
    padding: '0 4px',
    '&:hover': {
      color: '#999'
    }
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  container: (provided: any) => ({
    ...provided,
    borderRadius: '0'
  })
};

interface TaDropDown {
  options: { value: string; label: string }[];
  value: { value: any; label: any } | null;
  onChange: (selectedOption: { value: string; label: string } | null) => void;
  placeholder?: string;
  isSearchable?: boolean;
  prefix?: string;
}

export const TaDropDown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  isSearchable = false,
  prefix
}: TaDropDown) => {

const formatSelectedLabel = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {prefix && <span style={{ marginRight: '4px' }}>{prefix}:</span>}
        <span>{label}</span>
    </div>
    );

  return (
      <Select
        unstyled
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isSearchable={isSearchable}
        formatOptionLabel={(option, { context }) => {
            if (context === 'value') {
              return formatSelectedLabel(option);
            }
            return option.label;
          }}
        classNamePrefix="select"
        components={{
          IndicatorSeparator: () => null
        }}
      />
  );
};