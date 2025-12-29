import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ label, value, subtext, lockedAmount, onAction, actionLabel, variant = 'default' }) => {
    const isPrimary = variant === 'primary';

    return (
        <div
            className={`p-6 md:p-8 rounded-3xl backdrop-blur-md group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden ${isPrimary
                    ? 'bg-gradient-to-br from-[#a3e635]/15 to-[#84cc16]/5 border-[#a3e635]/30'
                    : 'bg-white/5 border-white/10'
                } border`}
        >
            {isPrimary && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            )}

            <div className="relative">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <div className="text-3xl md:text-4xl font-bold mt-2 mb-1 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                    {value}
                </div>

                {lockedAmount && (
                    <div className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest mb-3 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        {lockedAmount} Locked for withdrawal
                    </div>
                )}

                {subtext && (
                    <div className="text-xs font-semibold text-[#a3e635] mb-4">
                        {subtext}
                    </div>
                )}

                {onAction && actionLabel && (
                    <div className="flex gap-3">
                        <button
                            onClick={onAction}
                            className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                        >
                            {actionLabel}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

StatCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subtext: PropTypes.string,
    lockedAmount: PropTypes.string,
    onAction: PropTypes.func,
    actionLabel: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'primary']),
};

export default StatCard;
