import { decodeAccessToken, type CustomSession } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useCampusCode() {
  const { data: session } = useSession();
  const [campusCode, setCampusCode] = useState<string | null>(null);

  useEffect(() => {

  const customSession = session as unknown as CustomSession;
  if (customSession?.accessToken) {
    const decoded = decodeAccessToken(customSession.accessToken);

    setCampusCode(decoded?.campus || null);
  } else {
    console.warn("Access token ausente da sessão");
  }
}, [session]);

  return campusCode;
}