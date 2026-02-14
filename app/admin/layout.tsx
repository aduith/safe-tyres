'use client';

import AdminRoute from '@/components/AdminRoute';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminRoute>
            <div className="min-h-screen flex flex-col">
                <AdminNavbar />
                <main className="flex-1 pt-20">
                    {children}
                </main>
            </div>
        </AdminRoute>
    );
}
