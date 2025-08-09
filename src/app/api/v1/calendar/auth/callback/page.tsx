'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { axiosAPI } from '@/lib/axios-api';

export default function CalendarCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                const status = searchParams.get('status');
                const user_email_param = searchParams.get('user_email');
                
                if (status === 'success' && user_email_param) {
                    const savedEventData = localStorage.getItem('pending_calendar_event');

                    if (savedEventData) {
                        const eventData = JSON.parse(savedEventData);
                        eventData.user_email = user_email_param;

                        const response = await axiosAPI({
                            endpoint: '/calendar/events',
                            method: 'POST',
                            data: eventData,
                            withAuth: true
                        });
                        
                        localStorage.removeItem('pending_calendar_event');
                        toast.success('Evento adicionado à sua agenda com sucesso!');
                        
                        setTimeout(() => {
                            router.push('/jogos');
                        }, 1500);
                    } else {
                        toast.info('Autorização concluída! Você pode adicionar eventos ao calendário.');
                        setTimeout(() => {
                            router.push('/jogos');
                        }, 2000);
                    }
                    
                } else {
                    const code = searchParams.get('code');
                    const user_email = searchParams.get('state');

                    if (!code || !user_email) {
                        toast.error('Erro na autorização do calendário');
                        return;
                    }
                    
                    window.location.href = `http://35.215.219.1/api/v1/calendar/auth/callback?code=${code}&state=${user_email}`;
                }
            } catch (error) {
                localStorage.removeItem('pending_calendar_event');
                toast.error('Erro ao processar autorização do calendário');
                setTimeout(() => {
                    router.push('/jogos');
                }, 2000);
            } finally {
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Processando...
                        </h2>
                        <p className="text-gray-600">
                            Finalizando configuração do calendário
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Concluído!
                        </h2>
                        <p className="text-gray-600">
                            Redirecionando você de volta...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}