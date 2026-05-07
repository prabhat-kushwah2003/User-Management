/**
 * Reusable select/dropdown component for forms
 * @param {string} label - Select label text
 * @param {string} name - Select name attribute
 * @param {string} value - Current selected value
 * @param {function} onChange - Change handler function
 * @param {Array} options - Array of { value, label } objects
 * @param {string} error - Error message to display
 */
const SelectInput = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectInput;
