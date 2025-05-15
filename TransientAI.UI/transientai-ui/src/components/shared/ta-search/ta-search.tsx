'use client'

import { useState, useEffect } from 'react'

interface SearchComponentProps {
  /** Placeholder text for the search input */
  placeholder?: string
  /** Callback function that receives the search query */
  onSearch?: (query: string) => void
  /** Initial search value */
  initialValue?: string
  /** Debounce time in milliseconds */
  debounceTime?: number
  /** Additional CSS classes for the container */
  className?: string
}

const SearchComponent = ({
  placeholder = 'Search',
  onSearch,
  initialValue = '',
  debounceTime = 300,
  className = ''
}: SearchComponentProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  // Debounce search input to prevent excessive callbacks
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery)
      }
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch, debounceTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length >= 3) {
      //Fetch user search value
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        className={`
        relative flex items-center w-full rounded-xl border 
        ${isFocused ? 'border-gray-500' : 'border-gray-700'}
        bg-gray-900 overflow-hidden transition-all duration-200
      `}
      >
        <div className='flex items-center justify-center px-3 text-gray-400'>
          <i className='fa-light fa-magnifying-glass'></i>
        </div>
        <input
          type='text'
          value={searchQuery}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className='w-full py-2 px-2 text-white focus:!shadow-none !bg-transparent placeholder-gray-400'
        />
        <button
          onClick={handleClear}
          className={`px-3 text-gray-400 hover:text-gray-200 focus:outline-none ${
            !searchQuery && `invisible`
          }`}
          aria-label='Clear search'
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default SearchComponent
