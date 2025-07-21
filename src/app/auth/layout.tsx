export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center gap-[8.125rem] bg-[#305D5B] p-8 text-white lg:p-12">
            {children}
        </div>
    );
}