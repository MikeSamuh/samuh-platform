"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";
import { demoAccounts, DEFAULT_ROLE } from "@/lib/demoAccounts";
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

// TESTING MODE: no login screen. Visitors are signed into a demo account
// automatically; the header dropdown switches between user types.
export default function AuthGate({ children }) {
  const { session, profile, profileMissing, loading, isStaff, signOut } = useAuth();
  const [autoError, setAutoError] = useState(null);

  useEffect(() => {
    if (!supabaseConfigured || loading || session) return;
    const account = demoAccounts[DEFAULT_ROLE];
    supabase.auth
      .signInWithPassword({ email: account.email, password: account.password })
      .then(({ error }) => {
        if (error) setAutoError(error.message);
      });
  }, [loading, session]);

  // A session whose profile no longer exists (deleted user, wiped database)
  // would otherwise leave the app stuck; sign out and let auto-login retry.
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

  if (autoError) {
    return (
      <Message
        title="Couldn't start the demo session"
        body={`Automatic sign-in failed: ${autoError}`}
      />
    );
  }

  if (loading || !session || !profile) {
    return <Message title="Loading…" body="Getting your team journey ready." />;
  }

  // Samuh staff work across teams and never belong to one.
  if (!profile.team_id && !isStaff) return <TeamSetup />;

  return children;
}
