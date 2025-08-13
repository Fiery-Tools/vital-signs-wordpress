import React, { useEffect, useState } from 'react';
import Vulnerabilities from './components/Vulnerabilities';
import Roadmap from './components/Roadmap';
import CoreFiles from './components/CoreFiles';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Shield,
  Map,
  FileCode,
  Settings,
  BarChart3,
  Users,
  Database,
  Bell,
  Lock,
  Globe,
  Zap,
  Home
} from 'lucide-react';
import Dashboard from './components/Dashboard';

function Foo() {
  return <h2>Foo Component</h2>;
}

export default function App() {
  const [status, setStatus] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState(null);
  const location = useLocation();

  // Define all navigation tabs - easy to add more
  const navigationTabs = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      component: <Dashboard toast={toast} />
    },
    {
      path: '/vulnerabilities',
      label: 'Vulnerabilities',
      icon: Shield,
      component: vulnerabilities ? <Vulnerabilities status={status} data={vulnerabilities} toast={toast} /> : <></>
    },
    {
      path: '/core-files',
      label: 'Core Files',
      icon: FileCode,
      component: <CoreFiles toast={toast} />
    },
    {
      path: '/roadmap',
      label: 'Roadmap',
      icon: Map,
      component: <Roadmap />
    },
    // Placeholder tabs for the 8 additional components you'll add
    // {
    //   path: '/security-scan',
    //   label: 'Security Scan',
    //   icon: Lock,
    //   component: <Foo />
    // },
    // {
    //   path: '/performance',
    //   label: 'Performance',
    //   icon: Zap,
    //   component: <Foo />
    // },
    // {
    //   path: '/analytics',
    //   label: 'Analytics',
    //   icon: BarChart3,
    //   component: <Foo />
    // },
    // {
    //   path: '/users',
    //   label: 'User Management',
    //   icon: Users,
    //   component: <Foo />
    // },
    // {
    //   path: '/database',
    //   label: 'Database',
    //   icon: Database,
    //   component: <Foo />
    // },
    // {
    //   path: '/notifications',
    //   label: 'Notifications',
    //   icon: Bell,
    //   component: <Foo />
    // },
    // {
    //   path: '/network',
    //   label: 'Network',
    //   icon: Globe,
    //   component: <Foo />
    // },
    // {
    //   path: '/settings',
    //   label: 'Settings',
    //   icon: Settings,
    //   component: <Foo />
    // }
  ];

  useEffect(() => {
    fetch(VS_DATA.rest_url + '/status', {
      headers: { 'X-WP-Nonce': VS_DATA.nonce }
    })
    .then(res => res.json())
    .then(setStatus);

    fetch(VS_DATA.rest_url + '/vulnerabilities', {
      headers: { 'X-WP-Nonce': VS_DATA.nonce }
    })
    .then(res => res.json())
    .then(setVulnerabilities);
  }, []);

  if (!status) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  return (
    <div id="vs-app" className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;

              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {navigationTabs.map((tab) => (
            <Route
              key={tab.path}
              path={tab.path}
              element={tab.component}
            />
          ))}
        </Routes>
      </main>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}