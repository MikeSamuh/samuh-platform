"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabaseConfigured } from "@/lib/supabaseClient";
import AuthScreen from "./AuthScreen";
import TeamSetup from "./TeamSetup";
import styles from "./AuthScreen.module.css";

function Message({ title, body }) {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>{body}</div>
      </div>
    </div>
  );
}

export default function AuthGate({ children }) {
  const { session, profile, profileMissing, loading, isStaff, signOut } = useAuth();

  // A session whose profile no longer exists (deleted user, wiped database)
  // would otherwise leave the app stuck on a blank screen forever.
  useEffect(() => {
    if (session && profileMissing) signOut();
  }, [session, profileMissing, signOut]);

  if (!supabaseConfigured) {
    return (
      <Message
        title="Not configured"
        body="NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. Add them to your environment and redeploy."
      />
    );
  }

  if (loading) return <Message title="Loading…" body="Getting your team journey ready." />;
  if (!session) return <AuthScreen />;
  if (profileMissing) return <Message title="Signing out…" body="That account no longer exists." />;
  if (!profile) return <Message title="Loading…" body="Getting your team journey ready." />;

  // Samuh staff work across teams and never belong to one.
  if (!profile.team_id && !isStaff) return <TeamSetup />;

  return children;
}
