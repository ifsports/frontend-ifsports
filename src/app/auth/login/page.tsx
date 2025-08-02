'use client';

import { signIn, useSession } from 'next-auth/react';
import {useEffect, useState} from 'react';
import { z } from 'zod';
import { signInSchema, type SignInData } from '@/lib/schemas/auth-schema';
import {toast} from "sonner";

import loginImg from "@/assets/login.png";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [credentials, setCredentials] = useState<SignInData>({
        matricula: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<SignInData>>({});

    const redirectBasedOnRole = (userRole: string, fallbackUrl: string = '/') => {
        switch (userRole) {
            case 'Organizador':
                if (fallbackUrl.startsWith('/organizador/')) {
                    router.push(fallbackUrl);
                } else {
                    router.push('/organizador/modalidades');
                }
                break;
            case 'Jogador':
                if (fallbackUrl.startsWith('/gerenciar-equipes') || fallbackUrl.startsWith('/registrar-equipe')) {
                    router.push(fallbackUrl);
                } else {
                    router.push('/');
                }
                break;
            default:
                router.push(fallbackUrl);
        }
    };

    useEffect(() => {
        console.log("Session no useEffect:", session); 
        if (session?.user) {
            if (session.user.role) {
                console.log("Role encontrada na sessão:", session.user.role); 
                redirectBasedOnRole(session.user.role, callbackUrl);
            } else {
                if (session.accessToken) {
                    try {
                        const jwt = require('jsonwebtoken');
                        const decodedToken = jwt.decode(session.accessToken);

                        let userRole;
                        
                        if (decodedToken?.groups && Array.isArray(decodedToken.groups) && decodedToken.groups.length > 0) {
                            userRole = decodedToken.groups[0]; 
                        } else {
                            userRole = decodedToken?.role || decodedToken?.cargo;
                        }
                        
                        if (userRole) {
                            redirectBasedOnRole(userRole, callbackUrl);
                        } else {
                            router.push(callbackUrl);
                        }
                    } catch (error) {
                        router.push(callbackUrl);
                    }
                } else {
                    router.push(callbackUrl);
                }
            }
        }
    }, [session, callbackUrl, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const validatedData = signInSchema.parse(credentials);

            const result = await signIn('credentials-db', {
                matricula: validatedData.matricula,
                password: validatedData.password,
                redirect: false,
            });

            if (result?.error) {
                toast(result.error)
            } else if (result?.ok) {
                toast("Autenticado com sucesso!")
            } else {
                toast("Erro inesperado durante o login");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<SignInData> = {};
                error.issues.forEach((issue) => {
                    const field = issue.path[0] as keyof SignInData;
                    fieldErrors[field] = issue.message;
                });
                setErrors(fieldErrors);
                toast("Erros de validação")
            } else {
                toast('Erro durante o login');
            }
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className="p-4">Carregando...</div>;
    }

    const handleSuapLoginRedirect = () => {
        const suapUrl = "https://suap.ifrn.edu.br/accounts/login/?next=/o/authorize/%3Fclient_id%3DAcFNXdcMNZhtDKI3LMYhrtzC5xTeisjKmq41opDR%26response_type%3Dcode%26scope%3Didentificacao%2520email%2520documentos_pessoais";
        
        if (callbackUrl !== '/') {
            localStorage.setItem('suap_callback_url', callbackUrl);
        }
        
        window.location.href = suapUrl;
    };

    return (
        <>
            <Image
                src={loginImg}
                alt="Ilustração de pessoas interagindo com gráficos"
                width={493}
                height={487}
                className="hidden max-w-[30.813rem] xl:block"
            />

            <div className="w-full max-w-[545px] rounded-lg bg-[#274d4b] p-8 lg:p-12">
                <div className="flex flex-col gap-2 text-center xl:text-left">
                    <h2 className="font-title text-4xl font-bold">LOGIN</h2>
                    <h3 className="font-title text-2xl">Acesse o sistema do IFSports</h3>
                </div>

                <form onSubmit={handleLogin} className="mt-12 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="login-enrollment" className="font-title text-xl font-bold">
                            Usuário
                        </label>
                        <input
                            type="text"
                            value={credentials.matricula}
                            onChange={(e) => setCredentials(prev => ({
                                ...prev,
                                matricula: e.target.value
                            }))}
                            className={`rounded-lg border-0 focus:outline-none focus:ring-0 p-4 bg-[#EEEEEE] text-black placeholder:text-[#666666] ${
                                errors.matricula && 'border-red-500 bg-red-50'
                            }`}
                            placeholder="Seu usuário"
                        />
                        {errors.matricula && (
                            <p className="text-red-500 text-sm mt-1">{errors.matricula}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="login-password" className="font-title text-xl font-bold">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            className={`rounded-lg border-0 focus:outline-none focus:ring-0 p-4 bg-[#EEEEEE] text-black placeholder:text-[#666666] ${
                                errors.password && 'border-red-500 bg-red-50'
                            }`}
                            placeholder="Sua senha"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 cursor-pointer rounded-lg border-0 bg-[#4CAF50] py-4 font-semibold text-white transition-colors hover:bg-[#3D8D40] disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-6">
                    <div className="flex w-full items-center gap-2.5">
                        <hr className="flex-1 border-t border-gray-400" />
                        <p className="text-sm text-gray-200">ou</p>
                        <hr className="flex-1 border-t border-gray-400" />
                    </div>

                    <div className="flex w-full items-center flex-col gap-1">
                        <p className="font-title text-lg font-semibold">É aluno?</p>
                        <button
                            onClick={handleSuapLoginRedirect}
                            className="mt-4 w-full cursor-pointer rounded-lg border-0 bg-[#4CAF50] py-4 font-semibold text-white transition-colors hover:bg-[#3D8D40]"
                        >
                            Login com SUAP
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}