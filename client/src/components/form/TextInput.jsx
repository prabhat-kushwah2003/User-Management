/**
 * Reusable text input component for forms
 * @param {string} label - Input label text
 * @param {string} name - Input name attribute
 * @param {string} type - Input type (text, email, etc.)
 * @param {string} value - Current input value
 * @param {function} onChange - Change handler function
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display
 */
const TextInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextInput;
