import React, { useState } from "react";

const RenderInputTag = ({ label, id, type = "text", value, onChange }) => {

  
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== "");

  return (
    <div className="relative w-full ">
      <input
        type={type}
        id={id}
        className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-300 ${
          isFocused || value
            ? "text-xs text-blue-500 -top-2 bg-blue-50 px-1"
            : "text-gray-500 top-2"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default RenderInputTag;
