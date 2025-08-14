import React, { useEffect, useState } from 'react';
import Vulnerabilities from './components/Vulnerabilities';
import Roadmap from './components/Roadmap';
import CoreFiles from './components/CoreFiles';
import Header from './components/Header';
import InfoPage from './components/Info';
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
  Home,
  Info
} from 'lucide-react';
import Dashboard from './components/Dashboard';


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
      component: <Dashboard status={status} toast={toast} />
    },
    {
      path: '/info',
      label: 'Info',
      icon: Info,
      component: <InfoPage status={status} />
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
    fetch('/wp-json/vital-signs/v1/status', {
      headers: { 'X-WP-Nonce': VS_DATA.nonce }
    })
    .then(res => res.json())
    .then(setStatus);

    fetch('/wp-json/vital-signs/v1/vulnerabilities', {
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
      <Header tabs={navigationTabs} currentPath={location.pathname}/>

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