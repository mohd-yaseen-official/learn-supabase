"use client";

import { User, Mail, AtSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setUserData({
                    fullName: profile.full_name,
                    username: profile.username,
                    email: session.user.email,
                    createdAt: profile.created_at
                });
            }

            setLoading(false);
        };

        fetchUserData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                router.push('/login');
            }
        });

        return () => subscription?.unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!userData) {
        router.push('/login')
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Your Profile
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your account information
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center mb-2">
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </span>
                                </div>
                                <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-base">
                                    {userData.fullName || "Not provided"}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-2">
                                    <AtSign className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Username
                                    </span>
                                </div>
                                <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-base">
                                    @{userData.username || "Not provided"}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-2">
                                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </span>
                                </div>
                                <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-base">
                                    {userData.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
                                Member since {formatDate(userData.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}