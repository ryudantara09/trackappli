'use client';

import React, { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@/components/ui/Icon';
import { apiClient } from '@/lib/api-client';
import { ApplicationMapper } from '@/lib/data-mappers';
import { FrontendApplication, ApplicationStatus } from '@/types/frontend.types';
import { AsyncContent } from '@/components/ui/AsyncContent';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  positive: boolean;
}

const AnalyticsPage: React.FC = () => {
  const [applications, setApplications] = useState<FrontendApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const apps = await apiClient.getApplications();
        setApplications(apps);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Calculate real stats from applications
  const calculateStats = (): StatCard[] => {
    if (applications.length === 0) {
      return [
        { title: 'Total Applications', value: '0', change: '0%', trend: 'up', positive: true },
        { title: 'Interview Rate', value: '0%', change: '0%', trend: 'up', positive: true },
        { title: 'Offer Rate', value: '0%', change: '0%', trend: 'up', positive: true },
        { title: 'Success Rate', value: '0%', change: '0%', trend: 'up', positive: true },
      ];
    }

    const total = applications.length;
    const interviews = applications.filter(app => 
      app.status === ApplicationStatus.INTERVIEW
    ).length;
    const offers = applications.filter(app => 
      app.status === ApplicationStatus.OFFER
    ).length;
    const rejected = applications.filter(app => 
      app.status === ApplicationStatus.REJECTED
    ).length;

    const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;
    const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;

    return [
      { title: 'Total Applications', value: total.toString(), change: '0%', trend: 'up', positive: true },
      { title: 'Interview Rate', value: `${interviewRate}%`, change: '0%', trend: 'up', positive: true },
      { title: 'Offer Rate', value: `${offerRate}%`, change: '0%', trend: 'up', positive: true },
      { title: 'Success Rate', value: `${successRate}%`, change: '0%', trend: 'up', positive: true },
    ];
  };

  // Get recent activity from applications
  const getRecentActivity = () => {
    return applications
      .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
      .slice(0, 5)
      .map(app => ({
        company: app.company,
        action: `Status: ${app.status}`,
        date: new Date(app.dateApplied).toLocaleDateString(),
        type: app.status === ApplicationStatus.OFFER ? 'success' :
              app.status === ApplicationStatus.REJECTED ? 'error' : 'info'
      }));
  };

  // Get top companies by application count
  const getTopCompanies = () => {
    const companyMap = new Map<string, { applications: number; interviews: number; offers: number }>();
    
    applications.forEach(app => {
      const existing = companyMap.get(app.company) || { applications: 0, interviews: 0, offers: 0 };
      existing.applications++;
      if (app.status === ApplicationStatus.INTERVIEW) existing.interviews++;
      if (app.status === ApplicationStatus.OFFER) existing.offers++;
      companyMap.set(app.company, existing);
    });

    return Array.from(companyMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);
  };

  // Get monthly data
  const getMonthlyData = () => {
    const monthMap = new Map<string, { applied: number; interviews: number; offers: number }>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    applications.forEach(app => {
      const date = new Date(app.dateApplied);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      const existing = monthMap.get(monthKey) || { applied: 0, interviews: 0, offers: 0 };
      existing.applied++;
      if (app.status === ApplicationStatus.INTERVIEW) existing.interviews++;
      if (app.status === ApplicationStatus.OFFER) existing.offers++;
      monthMap.set(monthKey, existing);
    });

    return Array.from(monthMap.entries())
      .map(([month, stats]) => ({ month, ...stats }))
      .slice(-6);
  };

  const stats = calculateStats();
  const recentActivity = getRecentActivity();
  const topCompanies = getTopCompanies();
  const monthlyData = getMonthlyData();
  const maxApplied = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.applied)) : 1;

  return (
    <AsyncContent isLoading={loading} error={error}>
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-text-primary-light">Analytics & Insights</h1>
        <p className="text-neutral-gray mt-2">Track your job search performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-gray font-medium">{stat.title}</span>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Application Trends Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6">
          <h3 className="text-lg font-semibold mb-6">Application Trends (Last 6 Months)</h3>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-gray w-12">{data.month}</span>
                  <div className="flex-1 flex gap-2 items-center">
                    <div className="flex-1 bg-gray-100 dark:bg-neutral-border-dark rounded-full h-8 overflow-hidden relative">
                      <div
                        className="bg-primary-blue h-full rounded-full transition-all"
                        style={{ width: `${(data.applied / maxApplied) * 100}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                        {data.applied}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-gray w-32 flex gap-3">
                      <span className="text-blue-600">📋 {data.interviews}</span>
                      <span className="text-green-600">✓ {data.offers}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-6 text-xs text-neutral-gray">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-blue rounded"></div>
              <span>Applied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📋</span>
              <span>Interviews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Offers</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-text-primary-light dark:text-neutral-text-primary-dark truncate">
                    {activity.company}
                  </p>
                  <p className="text-xs text-neutral-gray">{activity.action}</p>
                  <p className="text-xs text-neutral-gray mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6">
        <h3 className="text-lg font-semibold mb-6">Top Companies Applied To</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-border-light dark:border-neutral-border-dark">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-gray">Company</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-gray">Applications</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-gray">Interviews</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-gray">Offers</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-gray">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border-light dark:divide-neutral-border-dark">
              {topCompanies.map((company) => {
                const successRate = company.applications > 0 
                  ? Math.round((company.offers / company.applications) * 100) 
                  : 0;
                
                return (
                  <tr key={company.name} className="hover:bg-gray-50 dark:hover:bg-neutral-border-dark transition-colors">
                    <td className="py-3 px-4 font-medium text-neutral-text-primary-light dark:text-neutral-text-primary-dark">{company.name}</td>
                    <td className="py-3 px-4 text-right text-neutral-gray">{company.applications}</td>
                    <td className="py-3 px-4 text-right text-neutral-gray">{company.interviews}</td>
                    <td className="py-3 px-4 text-right text-neutral-gray">{company.offers}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        successRate >= 20 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        successRate >= 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {successRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </AsyncContent>
  );
};
export default AnalyticsPage;
