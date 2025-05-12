'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { verifyOtp } from '@/src/api/mutations';

const Verify = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const params = useParams()
    const { email } = params;
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
        // Focus the first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const focusNextInput = (index: number) => {
        if (index < 5) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 0);
        }
    };

    const focusPrevInput = (index: number) => {
        if (index > 0) {
            setTimeout(() => {
                inputRefs.current[index - 1]?.focus();
            }, 0);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow single digit numbers
        if (!/^\d*$/.test(value)) return;

        // Handle paste event
        if (value.length > 1) {
            const pastedValue = value.slice(0, 6).split('');
            const newOtp = [...otp];
            
            pastedValue.forEach((char, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = char;
                }
            });
            
            setOtp(newOtp);
            
            const nextEmptyIndex = newOtp.findIndex((val, i) => i >= index && !val);
            const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
            setTimeout(() => {
                inputRefs.current[focusIndex]?.focus();
            }, 0);
            return;
        }

        // Handle single digit input
        if (value.length === 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // Immediately focus next input
            focusNextInput(index);
        } else if (value.length === 0) {
            // Handle deletion
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent default behavior for non-numeric keys
        if (!/^\d$/.test(e.key) && 
            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                focusPrevInput(index);
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
        
        if (e.key === 'ArrowLeft') {
            focusPrevInput(index);
        }
        if (e.key === 'ArrowRight') {
            focusNextInput(index);
        }

        // Handle Enter key
        if (e.key === 'Enter') {
            if (index < 5) {
                focusNextInput(index);
            } else {
                // If on last field and Enter is pressed, submit the form
                const form = e.currentTarget.form;
                if (form) form.requestSubmit();
            }
        }

        // Handle numeric key press
        if (/^\d$/.test(e.key)) {
            e.preventDefault(); // Prevent default to avoid double input
            const newOtp = [...otp];
            newOtp[index] = e.key;
            setOtp(newOtp);
            focusNextInput(index);
        }
    };
  const verify = verifyOtp()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const otpString = otp.join('');
            // TODO: Add your OTP verification API call here
            // const response = await verifyOtp(otpString);
          const res = verify.mutateAsync({
            email: email as string,
            otp: 'KUAHLI'
          })
            
          console.log(res)
            // For now, just simulate a successful verification
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            // TODO: Add your resend OTP API call here
            await new Promise(resolve => setTimeout(resolve, 1000));
            setError('');
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full space-y-8 p-8 bg-[#121212] rounded-lg shadow-lg border border-[#0f717b] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f717b] via-[#0f8a96] to-[#0f717b]"></div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        We've sent a 6-digit code to your email
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                name={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const pastedData = e.clipboardData.getData('text');
                                    handleOtpChange(index, pastedData);
                                }}
                                className="w-12 h-12 text-center text-2xl font-semibold border-2 border-[#0f717b] rounded-lg focus:border-[#0f8a96] focus:ring-2 focus:ring-[#0f717b]/20 transition-all duration-200 bg-black text-white placeholder-gray-500"
                                maxLength={1}
                                pattern="[0-9]"
                                inputMode="numeric"
                                required
                                autoComplete="one-time-code"
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center bg-red-900/30 py-2 px-4 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || otp.some(digit => !digit)}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0f717b] hover:bg-[#0f8a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f717b] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : 'Verify'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="text-sm text-[#0f8a96] hover:text-[#0f717b] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                        >
                            Didn't receive the code? Resend
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verify;
