import { Link } from "react-router-dom";

const Header = ({tabs, currentPath}) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center px-4 py-4 space-x-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Header;