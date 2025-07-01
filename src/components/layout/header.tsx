import logoSVG from "@/assets/logo.svg";
import Image from "next/image";
import {Instagram, Twitter, Youtube} from "lucide-react";
import Link from "next/link";

export default function Header() {
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

            <Link href="/auth/login" className="px-5 py-2 border border-[#848484] rounded-full cursor-pointer text-xs">
                Login
            </Link>
        </header>
    )
}