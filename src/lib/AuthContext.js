"use client";

import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, team_id")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data || null);
    setProfileMissing(!data);
    return data || null;
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!active) return;
      setSession(next);
      if (next) {
        await loadProfile(next.user.id);
      } else {
        setProfile(null);
        setProfileMissing(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = {
    session,
    profile,
    profileMissing,
    loading,
    user: session?.user || null,
    isStaff: profile?.role === "samuh_admin",
    isManager: profile?.role === "manager",
    refreshProfile: () => (session ? loadProfile(session.user.id) : Promise.resolve(null)),
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
