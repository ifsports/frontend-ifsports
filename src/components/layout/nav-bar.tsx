"use client"

import Link from "next/link";
import {useSession} from "next-auth/react";
import {SessionType} from "@/types/auth";

export default function NavBar() {
    const { data: session } = useSession() as SessionType;

    return (
        <nav className="flex items-center justify-center gap-8 text-sm py-4 border-b border-[#E2E8F0]">
            <Link href="/" className="hover:text-[#147A02] transition-colors duration-150">Início</Link>
            <a href="#" className="hover:text-[#147A02] transition-colors duration-150">Competições</a>
            <a href="#" className="hover:text-[#147A02] transition-colors duration-150">Acompanhar jogos</a>
            { session && <a href="#" className="hover:text-[#147A02] transition-colors duration-150">Gerenciar equipes</a> }
            <a href="#" className="hover:text-[#147A02] transition-colors duration-150">Regulamento</a>
        </nav>
    )
}