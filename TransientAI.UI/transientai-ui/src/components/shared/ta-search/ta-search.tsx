'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface SearchItem {
  id: number
  title: string
}

interface SearchComponentProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onSelect?: (item: SearchItem) => void
  initialValue?: string
  debounceTime?: number
  className?: string
  fetchSuggestions: (query: string) => Promise<SearchItem[]>
  minCharsForSuggestions?: number
}

const SearchComponent = ({
  placeholder = 'Search',
  onSearch,
  onSelect,
  initialValue = '',
  debounceTime = 300,
  className = '',
  fetchSuggestions,
  minCharsForSuggestions = 3
}: SearchComponentProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [selectedValue, setSelectedValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>( null)

  // Handle search with debounce
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (searchQuery.length >= minCharsForSuggestions) {
      timerRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const results = await fetchSuggestions(searchQuery)
          setSuggestions(results)
          setShowDropdown(results.length > 0)
          onSearch?.(searchQuery)
        } catch (error) {
          console.error('Search failed:', error)
          setSuggestions([])
          setShowDropdown(false)
        } finally {
          setIsLoading(false)
        }
      }, debounceTime)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [searchQuery, debounceTime, fetchSuggestions, minCharsForSuggestions, onSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSelectItem = (item: SearchItem) => {
    setSearchQuery('');
    setSelectedValue(item.title);
    setShowDropdown(false)
    onSelect?.(item)
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedValue('');
    setShowDropdown(false)
    onSelect?.({} as SearchItem);
    onSearch?.('')
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative flex items-center w-full rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
        <div className="px-3 text-gray-400">
          {isLoading ? (
            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          ) : (
            <i className="fa-light fa-magnifying-glass"></i>
          )}
        </div>
        <input
          type="text"
          value={searchQuery || selectedValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-2 px-2 text-white !bg-transparent placeholder-gray-400 outline-none !shadow-none"
          autoComplete="off"
        />
        {(searchQuery || selectedValue) && (
          <button
            onClick={handleClear}
            className="px-3 text-gray-400 hover:text-gray-200"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-b-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="px-4 py-3 cursor-pointer hover:bg-gray-800 text-gray-300 border-b border-gray-800 last:border-b-0"
              onClick={() => handleSelectItem(item)}
            >
              <div className="text-sm truncate">{item.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchComponent