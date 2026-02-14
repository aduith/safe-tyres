'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import adminService, { User } from '@/services/adminService';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

    const handleDeleteUser = async (userId: string) => {
        try {
            await adminService.deleteUser(userId);
            toast.success('User deleted successfully');
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            toast.error('Failed to delete user');
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
                        <div className="space-y-4">
                            {users.map((user) => (
                                <Card key={user._id}>
                                    <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-4">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{user.name}</h3>
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground">{user.email}</p>
                                            {user.phone && (
                                                <p className="text-muted-foreground text-sm">{user.phone}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto">
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

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the user
                                                            account for <strong>{user.name}</strong> and remove their data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            Delete User
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {users.length === 0 && (
                                <p className="text-center text-muted-foreground py-12">No users found.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserManagement;
