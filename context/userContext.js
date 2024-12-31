import { createContext } from "react";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const UserContext = createContext();

export function UserContextProvider({ children, ...props }) {
    const router = useRouter();
    const pathname = router.pathname;

    // Array berisi semua rute yang tidak perlu menjalankan context
    const excludedPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

    // Cek apakah pathname diawali oleh salah satu rute di excludedPaths
    const isExcludedPage = excludedPaths.some((path) => pathname.startsWith(path));

    const { data: userData } = useQueries({
        prefixUrl: "/api/user/me",
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
    });

    // Jangan jalankan context jika di halaman excluded atau token tidak ada
    if (isExcludedPage || !Cookies.get("user_token")) {
        return <>{children}</>; // Render children saja tanpa UserContext
    }

    return (
        <UserContext.Provider value={userData?.data || null} {...props}>
            {children}
        </UserContext.Provider>
    );
}
