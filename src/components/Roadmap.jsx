import React, { useState } from 'react';
import { CheckCircle2 } from '@/lib/icons'; // Import the icon
import TopCard from './TopCard';



// --- The Roadmap Timeline Component ---

const Roadmap = () => {
  // The roadmap data now includes a 'completed' flag for each feature.
  const roadmapPhases = [
    {
      phase: 0,
      title: "Completed Features",
      goal: "The foundational tools that are live and available right now.",
      features: [
        { id: 101, title: "Plugin Vulnerability Scanner", description: "Scans all installed plugins against a vulnerability database to identify known security risks.", completed: true },
        { id: 102, title: "Theme Vulnerability Scanner", description: "Scans active and inactive themes to find known vulnerabilities and security weaknesses.", completed: true },
      ]
    },
    {
      phase: 1,
      title: "The Security & Health Foundation",
      goal: "Solidify the plugin's position as a top-tier security and integrity tool. These features are the most natural next steps from vulnerability scanning.",
      features: [
        { id: 4, title: "Core File Integrity Scanner", description: "Completes the 'code integrity' picture by comparing your WordPress core files against the official versions from WordPress.org, flagging any unauthorized changes." },
        { id: 6, title: "PHP & Server Environment Audit", description: "Audits the very foundation the site is built on, checking for outdated software, insecure settings, and ensuring the server is optimized for WordPress." },
        { id: 8, title: "HTTP Headers Security Audit", description: "Hardens the site against common browser-based attacks like clickjacking by inspecting and recommending improvements for HTTP security headers." }
      ]
    },
    {
      phase: 2,
      title: "Advanced Diagnostics & Auditing",
      goal: "Give users the tools to see what's happening on their site. This moves from static health checks to dynamic, real-time monitoring.",
      features: [
        { id: 7, title: "User Activity & Audit Log", description: "Provides a crucial audit trail for security and debugging by logging important actions like logins, plugin changes, and content edits." },
        { id: 10, title: "Error Log Viewer", description: "Dramatically simplifies troubleshooting by making the PHP error log viewable directly within the WordPress dashboard." },
        { id: 3, title: "WP-Cron & Scheduled Events Monitoring", description: "Brings visibility to WordPress's background task system, helping to spot failing cron jobs that can kill site functionality." }
      ]
    },
    {
      phase: 3,
      title: "The Performance Suite",
      goal: "Introduce powerful performance benchmarking capabilities. With the site now secure and observable, it's time to make it fast.",
      features: [
        { id: 1, title: "Server Response Time & CPU Benchmark", description: "Objectively measures server speed (TTFB) and processing power to determine if the hosting plan is a performance bottleneck." },
        { id: 2, title: "Database Query Analysis", description: "Pinpoints the exact plugins or themes causing slowdowns by logging and analyzing all database queries made on a page load." }
      ]
    },
    {
      phase: 4,
      title: "Holistic Mission Control",
      goal: "Tie all features together into a single, actionable dashboard and complete the 360-degree view of the site's health.",
      features: [
        { id: 9, title: "Site Health & Best Practices Checklist", description: "Acts as a 'virtual consultant,' synthesizing data from all other tools into a single, actionable checklist to guide users." },
        { id: 5, title: "API & External Services Health Check", description: "Completes the picture by monitoring the uptime and response time of critical external services your site relies on." }
      ]
    }

  ];

  return (
    <div className="w-full bg-secondary p-4">
      <TopCard title="Vital Signs | Roadmap" subtitle="A roadmap of our future plans" />
      <div className="space-y-6">
        {roadmapPhases.map((phase) => (
          <div key={phase.phase} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="mt-0 text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">
              {phase.title}
            </h3>
            <p className="italic text-slate-600">{phase.goal}</p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {phase.features.map(feature => (
                <div
                  key={feature.id}
                  className={`p-4 rounded-md border ${feature.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-slate-50 border-slate-200'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {feature.completed && (
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-grow">
                      <h4 className={`mt-0 text-base font-semibold ${feature.completed ? 'text-green-800' : 'text-slate-800'
                        }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${feature.completed ? 'text-green-700' : 'text-slate-600'
                        }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default Roadmap;