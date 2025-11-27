'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', apps: 2 },
    { name: 'Tue', apps: 5 },
    { name: 'Wed', apps: 3 },
    { name: 'Thu', apps: 8 },
    { name: 'Fri', apps: 12 },
    { name: 'Sat', apps: 4 },
    { name: 'Sun', apps: 6 },
];

export const ActivityChart = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-surface-dark p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none h-[300px] w-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Weekly Activity</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Applications sent over the last 7 days</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm font-medium text-green-500">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        +12% vs last week
                    </span>
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                color: '#111827',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#111827' }}
                            cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="apps"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorApps)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
