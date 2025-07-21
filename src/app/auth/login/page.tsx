'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import {useEffect, useState} from 'react';
import { z } from 'zod';
import { signInSchema, type SignInData } from '@/lib/schemas/auth-schema';
import {toast} from "sonner";

import loginImg from "@/assets/login.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {SessionType} from "@/types/auth";

export default function LoginPage() {
    const { data: session, status } = useSession() as SessionType;
    const router = useRouter();
    const [credentials, setCredentials] = useState<SignInData>({
        matricula: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<SignInData>>({});

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session]);

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
            } else {
                toast("Autenticado com sucesso!")
                router.push("/")
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

    const handleLogout = () => {
        signOut({ redirect: false });
    };

    if (status === 'loading') {
        return <div className="p-4">Carregando...</div>;
    }

    const handleSuapLoginRedirect = () => {
        window.location.href = "https://suap.ifrn.edu.br/accounts/login/?next=/o/authorize/%3Fclient_id%3DAcFNXdcMNZhtDKI3LMYhrtzC5xTeisjKmq41opDR%26response_type%3Dcode%26scope%3Didentificacao%2520email%2520documentos_pessoais";
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

                <button onClick={handleLogout}>
                    Sair
                </button>

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