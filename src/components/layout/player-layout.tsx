import Header from "@/components/layout/header";
import NavBar from "@/components/layout/nav-bar";

interface PlayerLayoutProps {
    children: React.ReactNode;
}

export default function PlayerLayout({ children }: PlayerLayoutProps){
    return (
        <div className="max-w-[80rem] mx-auto w-full px-[2.5rem]">
            <Header/>
            <NavBar/>
            {children}
        </div>
    )
}