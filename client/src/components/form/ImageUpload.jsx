import { useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

/**
 * Reusable image upload component with preview
 * @param {string} label - Upload label text
 * @param {string} name - Input name attribute
 * @param {function} onChange - Change handler function
 * @param {string} preview - Preview image URL
 * @param {string} error - Error message to display
 */
const ImageUpload = ({ label, name, onChange, preview, error }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        onClick={handleClick}
        className={`w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-red-400 transition-colors ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-full mx-auto"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FaCloudUploadAlt className="text-3xl mb-1" />
            <p className="text-sm">Click to upload image</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          name={name}
          onChange={onChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
