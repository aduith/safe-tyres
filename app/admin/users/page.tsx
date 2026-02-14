'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import adminService, { User } from '@/services/adminService';
import { toast } from 'sonner';

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            await adminService.updateUserRole(userId, newRole);
            toast.success('User role updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">User Management</h1>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>All Users ({users.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {users.map((user) => (
                                        <div key={user._id} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                {user.phone && (
                                                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                                {user.role === 'user' ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleRoleUpdate(user._id, 'admin')}
                                                    >
                                                        Make Admin
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRoleUpdate(user._id, 'user')}
                                                    >
                                                        Remove Admin
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserManagement;
