import React from 'react';
import BrandUpload from '../brand/components/BrandUpload'; // Adjust path if needed

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Sidebar navigation would go here */}
            <header className="bg-white shadow-sm p-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Enterprise Dashboard</h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-medium mb-4">Verification Center</h2>
                            <BrandUpload />
                        </section>
                    </div>

                    {/* Sidebar / Stats Area */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Status Overview</h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">Pending</p>
                            <p className="text-xs text-gray-400 mt-1">Your brand is being analyzed by our AI engine.</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default DashboardPage;