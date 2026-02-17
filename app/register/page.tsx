'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema, RegisterFormData } from '@/validators/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';

const Register = () => {
    const router = useRouter();
    const { register: registerUser, verifyOTP, resendOTP } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showOTPDialog, setShowOTPDialog] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await registerUser(data.name, data.email, data.password, data.phone);

            if (response.otpSent) {
                setUserEmail(data.email);
                setShowOTPDialog(true);
                toast.success('Verification code sent to your email!');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otpValue.length !== 4) {
            toast.error('Please enter a 4-digit code');
            return;
        }

        try {
            setIsVerifying(true);
            await verifyOTP(userEmail, otpValue);
            toast.success('Email verified successfully!');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid or expired code');
            setOtpValue('');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setIsResending(true);
            await resendOTP(userEmail);
            toast.success('New verification code sent!');
            setOtpValue('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend code');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4 max-w-md">
                    <Card className="shadow-card">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                Create Account
                            </CardTitle>
                            <CardDescription className="text-center">
                                Join SafeTyres today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your Full Name"
                                        {...register('name')}
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        {...register('email')}
                                        className={errors.email ? 'border-destructive' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+12 34567890"
                                        {...register('phone')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className={errors.password ? 'border-destructive' : ''}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('confirmPassword')}
                                        className={errors.confirmPassword ? 'border-destructive' : ''}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating account...' : 'Register'}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-primary hover:underline">
                                        Login here
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
                <DialogContent className="sm:max-w-md border-primary/20 bg-card/95 backdrop-blur-md">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-center">Verify Your Email</DialogTitle>
                        <DialogDescription className="text-center text-base">
                            We've sent a 4-digit verification code to <br />
                            <span className="font-semibold text-primary">{userEmail}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center space-y-8 py-6">
                        <InputOTP
                            maxLength={4}
                            value={otpValue}
                            onChange={(value) => setOtpValue(value)}
                        >
                            <InputOTPGroup className="gap-4">
                                <InputOTPSlot index={0} className="w-14 h-16 text-2xl border-2 rounded-xl focus:ring-primary h-14 w-14" />
                                <InputOTPSlot index={1} className="w-14 h-16 text-2xl border-2 rounded-xl focus:ring-primary h-14 w-14" />
                                <InputOTPSlot index={2} className="w-14 h-16 text-2xl border-2 rounded-xl focus:ring-primary h-14 w-14" />
                                <InputOTPSlot index={3} className="w-14 h-16 text-2xl border-2 rounded-xl focus:ring-primary h-14 w-14" />
                            </InputOTPGroup>
                        </InputOTP>

                        <div className="w-full space-y-4">
                            <Button
                                className="w-full h-12 text-lg font-semibold"
                                onClick={handleVerifyOTP}
                                disabled={isVerifying || otpValue.length < 4}
                            >
                                {isVerifying ? 'Verifying...' : 'Complete Registration'}
                            </Button>

                            <div className="text-center">
                                <button
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline disabled:opacity-50"
                                >
                                    {isResending ? 'Resending...' : "Didn't receive the code? Resend"}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Register;
