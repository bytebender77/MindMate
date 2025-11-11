const Card = ({ children, className = '', gradient = false, hover = false }) => {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300';
  const gradientStyles = gradient ? 'bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800' : '';
  const hoverStyles = hover ? 'hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1' : '';

  return (
    <div className={`${baseStyles} ${gradientStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
