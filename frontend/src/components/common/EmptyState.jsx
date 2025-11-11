import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon className="text-gray-400 dark:text-gray-500" size={48} />}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
