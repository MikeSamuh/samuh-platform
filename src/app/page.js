import { AuthProvider } from "@/lib/AuthContext";
import AuthGate from "@/components/auth/AuthGate";
import AppShell from "@/components/AppShell";

export default function Home() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppShell />
      </AuthGate>
    </AuthProvider>
  );
}
