function Button({ text, icon, variant = "default", onClick }) {
  let baseStyle =
    "flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg font-medium transition duration-200";

  let styles = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    google: "border border-gray-300 bg-white text-black hover:bg-gray-100",
    email: "border border-gray-300 bg-white text-black hover:bg-gray-100",
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${styles[variant]}`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {text}
    </button>
  );
}

export default Button;