import React from 'react';

import PropTypes from 'prop-types';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`}></div>
);

Skeleton.propTypes = {
    className: PropTypes.string,
};

const DashboardSkeleton = () => {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-12" />
                    <Skeleton className="h-12 w-12" />
                </div>
            </div>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Products Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-64" />
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
