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
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const scope = searchParams.get('scope');

                if (!code || !state) {
                    toast.error('Parâmetros de autorização inválidos');
                    setTimeout(() => router.push('/jogos'), 2000);
                    return;
                }

                const backendUrl = `http://localhost:3000/api/v1/calendar/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
                console.log('🔗 URL do proxy:', backendUrl);

                const authResponse = await fetch(backendUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (authResponse.status === 200) {
                    const savedEventData = localStorage.getItem('pending_calendar_event');
                    
                    if (savedEventData) {
                        const eventData = JSON.parse(savedEventData);
                        
                        const eventResponse = await axiosAPI({
                            endpoint: '/calendar/events/',
                            method: 'POST',
                            data: eventData,
                            withAuth: true
                        });

                        localStorage.removeItem('pending_calendar_event');
                        toast.success('Evento adicionado à sua agenda com sucesso!');
                    } else {
                        toast.info('Autorização concluída! Você pode adicionar eventos ao calendário.');
                    }

                    setTimeout(() => {
                        router.push('/jogos');
                    }, 2000);
                    
                } else {
                    throw new Error(`Backend retornou erro: ${authResponse.status}`);
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