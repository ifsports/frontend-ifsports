"use client"

import logoSVG from "@/assets/logo.svg";
import Image from "next/image";
import {Instagram, LogOut, Twitter, Youtube} from "lucide-react";
import Link from "next/link";
import {SessionType} from "@/types/auth";
import {signOut, useSession} from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
    const { data: session } = useSession() as SessionType;

    return (
        <header className="py-5 flex items-center justify-between">
            <div className="flex gap-8 items-end max-w-[32rem] w-full">
                <Image src={logoSVG} alt="Logo" />
                <p className="text-xs text-[#848484]">Educação, Ciência, Cultura e Tecnologia em
                    todo o Rio Grande do Norte</p>
            </div>

            <div className="flex items-center gap-8">
                <a href="#">
                    <Instagram size={20} className="text-[#848484]" />
                </a>
                <a href="#">
                    <Twitter size={20} className="text-[#848484]"/>
                </a>
                <a href="#">
                    <Youtube size={20} className="text-[#848484]"/>
                </a>
            </div>

            { session ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                        <Avatar>
                            <AvatarImage src={session?.user.image || undefined} alt="Minha foto" />
                            <AvatarFallback>{session?.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut({ redirect: false })}>
                            <LogOut className="text-red-500" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/auth/login" className="px-5 py-2 border border-[#848484] rounded-full cursor-pointer text-xs">
                    Login
                </Link>
            )}
        </header>
    )
}