/**
 * Reusable radio button group component for forms
 * @param {string} label - Group label text
 * @param {string} name - Radio group name
 * @param {string} value - Currently selected value
 * @param {function} onChange - Change handler function
 * @param {Array} options - Array of { value, label } objects
 * @param {string} error - Error message to display
 */
const RadioGroup = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-6 mt-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              className="w-4 h-4 text-gray-100 border-gray-300 focus:ring-red-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default RadioGroup;
