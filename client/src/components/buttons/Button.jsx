/**
 * Reusable button component
 * @param {string} type - Button type (button, submit)
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Button style variant (primary, success, danger, secondary)
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Whether button is disabled
 */
const Button = ({
  type = "button",
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-red-950 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-red-950 text-white hover:bg-red-950 focus:ring-red-950",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
