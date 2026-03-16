import React, { useState, useEffect } from 'react';
import { Mail, Lock, Key, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { forgotPassword, resetPassword, verifyRegistration, resendRegistrationOtp } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input, Button, Card } from '../../components/ui';

import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();

    // Parse query params
    const queryParams = new URLSearchParams(location.search);
    const initialEmail = queryParams.get('email') || '';
    const initialAction = queryParams.get('action') || 'reset'; // 'reset' or 'register'

    const [step, setStep] = useState(initialAction === 'register' ? 2 : 1);
    const [action, setAction] = useState(initialAction);
    const [email, setEmail] = useState(initialEmail);
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialAction === 'register' && initialEmail) {
            setStep(2);
            setAction('register');
            setEmail(initialEmail);
        }
    }, [initialAction, initialEmail]);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await forgotPassword(email);
            toast.success('Password reset code sent to your email.');
            setStep(2);
            setAction('reset');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send reset code. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (action === 'reset') {
            await handleResetPassword();
        } else {
            await handleVerifyRegistration();
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password must contain upper, lower, special character and min 8 chars.');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            await resetPassword(email, otpCode, newPassword);
            toast.success('Password reset successfully! You can now log in.');
            navigate('/auth');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to reset password. Invalid OTP or expired.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyRegistration = async () => {
        if (otpCode.length !== 6) {
            setError('Please enter a 6-digit code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await verifyRegistration(email, otpCode);
            await login(data, data.token);
            toast.success('Account verified successfully! Welcome to Kuizu.');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError('');
        try {
            if (action === 'register') {
                await resendRegistrationOtp(email);
            } else {
                await forgotPassword(email);
            }
            toast.success('New 6-digit code sent to your email.');
            setOtpCode('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to resend code. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <Card className="forgot-password-card">
                <div className="back-link">
                    <Link to="/auth">
                        <ArrowLeft size={18} /> Back to login
                    </Link>
                </div>
                
                {step === 1 ? (
                    <div className="fp-content">
                        <div className="fp-header">
                            <div className="fp-icon-wrapper">
                                <Key size={32} />
                            </div>
                            <h2>Forgot Password?</h2>
                            <p>Enter your email address to receive a 6-digit reset code.</p>
                        </div>
                        
                        <form onSubmit={handleRequestOtp} className="auth-form">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail size={18} />}
                                required
                            />
                            
                            {error && <p className="error-text">{error}</p>}
                            
                            <Button type="submit" isLoading={loading} className="w-full mt-6">
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="fp-content">
                        <div className="fp-header">
                            <div className="fp-icon-wrapper">
                                {action === 'reset' ? <Lock size={32} /> : <Mail size={32} />}
                            </div>
                            <h2>{action === 'reset' ? 'Reset Password' : 'Verify Your Email'}</h2>
                            <p>
                                {action === 'reset' 
                                    ? `We sent a 6-digit code to reset your password.` 
                                    : `Please enter the 6-digit code we sent to verify your account.`}
                                <br /><strong>{email}</strong>
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="auth-form">
                            <Input
                                label="6-Digit OTP"
                                placeholder="Enter code"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                className="otp-input"
                                required
                            />
                            
                            {action === 'reset' && (
                                <>
                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="Min 8 chars, 1 upper, 1 lower, 1 special"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        leftIcon={<Lock size={18} />}
                                        required
                                    />
                                    
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="Retype new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        leftIcon={<Lock size={18} />}
                                        required
                                    />
                                </>
                            )}
                            
                            {error && <p className="error-text">{error}</p>}
                            
                            <Button type="submit" isLoading={loading} className="w-full mt-6">
                                {loading ? 'Processing...' : (action === 'reset' ? 'Reset Password' : 'Verify Account')}
                            </Button>

                            <Button variant="ghost" type="button" className="w-full mt-4" onClick={handleResendOtp} disabled={loading}>
                                Didn't get a code? Resend
                            </Button>
                        </form>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
