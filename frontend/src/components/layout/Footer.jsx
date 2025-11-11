import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="text-primary-600 dark:text-primary-400" size={24} />
            <span className="font-semibold text-gray-800 dark:text-gray-200">MindMate</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with <span className="text-primary-600 dark:text-primary-400">♥</span> for LuminHacks 2025
          </p>

          <div className="flex gap-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition text-sm">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
