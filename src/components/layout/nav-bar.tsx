"use client"

import Link from "next/link";
import {useSession} from "next-auth/react";
import {SessionType} from "@/types/auth";

export default function NavBar() {
    const { data: session } = useSession() as SessionType;

    return (
        <nav className="flex items-center justify-center gap-8 text-sm py-4 border-b border-[#E2E8F0]">
            <Link href="/" className="hover:text-[#147A02] transition-colors duration-150">Início</Link>
            <Link href="/#competitions-anchor" className="hover:text-[#147A02] transition-colors duration-150">Competições</Link>
            <Link href="/jogos" className="hover:text-[#147A02] transition-colors duration-150">Acompanhar jogos</Link>
            { session && <Link href="/gerenciar-equipes" className="hover:text-[#147A02] transition-colors duration-150">Gerenciar equipes</Link> }
            <Link href="/" className="hover:text-[#147A02] transition-colors duration-150">Regulamento</Link>
        </nav>
    )
}