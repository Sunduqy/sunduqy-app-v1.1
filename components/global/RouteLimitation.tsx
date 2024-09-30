"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import RegistrationModal from '@/components/global/RegistrationModal';

const RouteLimitation = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const secureRoutes = [
            '/account-settings', 
            '/account-settings/my-chats', 
            '/account-settings/my-adds', 
            '/account-settings/orders',
            '/create-post',
            '/create-rocket-post',
        ];

        // Check if the current pathname is a secure route and the user is not authenticated
        if (secureRoutes.includes(window.location.pathname) && !loading && !user) {
            setIsModalOpen(true);
        }
    }, [loading, user]);

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while checking authentication
    }

    if (isModalOpen) {
        // Use window.location instead of router.push
        return <RegistrationModal isOpen={isModalOpen} onClose={() => window.location.href = '/'} />;
    }

    return <>{children}</>;
};

export default RouteLimitation;
