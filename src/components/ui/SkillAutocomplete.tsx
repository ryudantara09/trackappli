import React, { useState, useEffect, useRef } from 'react';

interface Skill {
  id: string;
  name: string;
  category?: string;
}

interface SkillAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function SkillAutocomplete({ value, onChange, placeholder, className, required }: SkillAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/skills/search?query=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (skill: Skill) => {
    setQuery(skill.name);
    onChange(skill.name);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className={className}
        required={required}
      />
      {showSuggestions && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-surface-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-md shadow-lg max-h-60 overflow-auto">
          {loading && <div className="p-2 text-sm text-neutral-gray">Loading...</div>}
          {!loading && suggestions.length > 0 && suggestions.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => handleSelectSuggestion(skill)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-bg-light dark:hover:bg-neutral-bg-dark transition-colors"
            >
              {skill.name}
            </button>
          ))}
          {!loading && suggestions.length === 0 && (
             <div className="p-2 text-sm text-neutral-gray italic">No existing skills found. A new one will be created.</div>
          )}
        </div>
      )}
    </div>
  );
}
