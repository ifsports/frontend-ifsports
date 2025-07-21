import NavBar from "@/components/layout/nav-bar";
import Header from "@/components/layout/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-[80rem] mx-auto w-full px-[2.5rem]">
            <Header />
            <NavBar />
            {children}
        </div>
    );
}