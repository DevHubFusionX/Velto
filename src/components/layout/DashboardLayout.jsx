import { useState } from 'react';
import { theme } from '../../theme';
import Sidebar from '../dashboard/Sidebar';

const DashboardLayout = ({ children, activeItem }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: theme.colors.dark }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-20"></div>
            </div>

            <Sidebar activeItem={activeItem} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 p-4 md:p-8 overflow-auto relative z-10 lg:ml-72">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
