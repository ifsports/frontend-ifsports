'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {toast} from "sonner";

export default function HandleTokenPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refresh_token');
        const userId = searchParams.get('userId');
        const userName = searchParams.get('userName');
        const userEmail = searchParams.get('userEmail');
        const userImage = searchParams.get('userImage');

        if (token && userId) {
            signIn('suap-sso', {
                token: token,
                refreshToken: refreshToken,
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                userImage: userImage,
                redirect: false,
            })
                .then(result => {
                    if (result?.ok) {
                        toast("Autenticado com sucesso!");
                        router.push('/');
                    } else {
                        toast(result?.error);
                        router.push('/auth/login?error=suap_auth_failed');
                    }
                })
                .catch(error => {
                    toast("Erro inesperado durante o processo de login SUAP: ", error)
                    router.push('/auth/login?error=suap_sso_error');
                });
        } else {
            toast("Tokens SUAP ou User ID ausentes na URL de callback.")
            router.push('/auth/login?error=invalid_sso_callback');
        }
    }, [searchParams, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Processando login via SUAP...</p>
        </div>
    );
}