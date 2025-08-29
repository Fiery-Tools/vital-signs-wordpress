import { AlertTriangle, Shield, ExternalLink, CheckCircle, Clock, AlertCircle, Loader2 } from '@/lib/icons';


// export const Severity = ({severity}) => {
//   let severityClass = 'text-red-600 bg-red-50'
//   let severityIcon = <AlertTriangle className="w-4 h-4" />

//   switch (severity.toLowerCase()) {
//     case "high": break;
//     case "medium":
//       severityClass = 'text-orange-600 bg-orange-50';
//       severityIcon = <AlertCircle className="w-4 h-4" />
//       break;

//     case "low":
//       severityClass = 'text-yellow-600 bg-yellow-50';
//       severityIcon = <Clock className="w-4 h-4" />
//       break;
//     default:
//       severityClass = 'text-grey-600 bg-grey-50';
//       <Loader2 className="w-4 h-4" />
//   }

//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${severityClass}`}>
//       {severityIcon}
//       {severity}
//     </span>
//   )
// };


export const FullPageLoader = ({ section }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-lg">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    <p className="mt-4 text-lg font-medium text-slate-700">Fetching {section || "core files"}...</p>
    <p className="text-slate-500">Please wait a moment.</p>
  </div>
);

import React from 'react';

const LoadingComponent = ({ message = "Loading", size = "default" }) => {
  // Size variants for different use cases
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <svg
            className="w-full h-full text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

// Example usage component to show different variants
export const MainLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="flex flex-col items-center gap-4">
        <div>
          <svg
            className="text-blue-600 animate-spin"
            style={{ width: '48px', height: '48px' }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0
              5.373 0 12h4zm2 5.291A7.962 7.962
              0 014 12H0c0 3.042 1.135 5.824
              3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Loading WP Vital Signs...
        </p>
      </div>
    </div>
  );
};


