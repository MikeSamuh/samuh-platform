"use client";

import { useAuth } from "@/lib/AuthContext";
import { supabaseConfigured } from "@/lib/supabaseClient";
import AuthScreen from "./AuthScreen";
import TeamSetup from "./TeamSetup";
import styles from "./AuthScreen.module.css";

export default function AuthGate({ children }) {
  const { session, profile, loading, isStaff } = useAuth();

  if (!supabaseConfigured) {
    return (
      <div className={styles.screen}>
        <div className={styles.card}>
          <div className={styles.title}>Not configured</div>
          <div className={styles.sub}>
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. Add
            them to your environment and redeploy.
          </div>
        </div>
      </div>
    );
  }

  if (loading) return null;
  if (!session) return <AuthScreen />;

  // Profile is created by a trigger; briefly absent right after signup.
  if (!profile) return null;

  // Samuh staff work across teams and never belong to one.
  if (!profile.team_id && !isStaff) return <TeamSetup />;

  return children;
}
