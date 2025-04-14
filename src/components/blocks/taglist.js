import { useState, useEffect, useRef } from "@wordpress/element";

const predefinedHobbies = [
  "Fishing",
  "Running",
  "Reading",
  "Cooking",
  "Traveling",
  "Gardening",
];

const TagList = ({ hobbies, setHobbies }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredHobbies, setFilteredHobbies] = useState(predefinedHobbies);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Filter predefined hobbies based on the input value
    setFilteredHobbies(
      predefinedHobbies.filter(
        (hobby) =>
          hobby.toLowerCase().includes(inputValue.toLowerCase()) &&
          !hobbies.includes(hobby)
      )
    );
  }, [inputValue, hobbies]);

  useEffect(() => {
    // Close the dropdown if clicking outside
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsDropdownOpen(true);
    setFocusedIndex(-1);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      if (inputValue) {
        setHobbies((prevHobbies) => [
          ...prevHobbies,
          inputValue.charAt(0).toUpperCase() + inputValue.slice(1),
        ]);
        setInputValue("");
        setIsDropdownOpen(false);
      }
      event.preventDefault();
    } else if (event.key === "Backspace") {
      if (inputValue === "" && hobbies.length) {
        setHobbies((prevHobbies) => prevHobbies.slice(0, -1));
      }
    } else if (event.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        Math.min(filteredHobbies.length - 1, prevIndex + 1)
      );
    } else if (event.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => Math.max(-1, prevIndex - 1));
    } else if (event.key === "Enter" && focusedIndex >= 0) {
      setHobbies((prevHobbies) => [
        ...prevHobbies,
        filteredHobbies[focusedIndex],
      ]);
      setInputValue("");
      setIsDropdownOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleTagRemove = (index) => {
    setHobbies((prevHobbies) => prevHobbies.filter((_, i) => i !== index));
  };

  const handleHobbySelect = (hobby) => {
    setHobbies((prevHobbies) => [...prevHobbies, hobby]);
    setInputValue("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="tag-list-container">
      <div className="tag-list">
        {hobbies.map((hobby, index) => (
          <span key={index}>
            {hobby}
            <button
              type="button"
              onClick={() => handleTagRemove(index)}
              aria-label={`Remove ${hobby}`}
            >
              x
            </button>
          </span>
        ))}
      </div>
      <input
        className="tag-list-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Add a hobby"
        ref={inputRef}
        onClick={() => setIsDropdownOpen(true)}
      />
      {isDropdownOpen && filteredHobbies.length > 0 && (
        <ul className="tag-list-dropdown" ref={dropdownRef}>
          {filteredHobbies.map((hobby, index) => (
            <li
              key={index}
              onClick={() => handleHobbySelect(hobby)}
              style={{
                backgroundColor:
                  focusedIndex === index ? "#d0d0d0" : "transparent",
              }}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {hobby}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagList;
