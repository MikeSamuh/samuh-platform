"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { demoAccounts } from "@/lib/demoAccounts";
import styles from "./RoleSwitcher.module.css";

export default function RoleSwitcher({ currentRole }) {
  const [busy, setBusy] = useState(false);

  async function switchTo(role) {
    const account = demoAccounts[role];
    if (!account || role === currentRole) return;
    setBusy(true);
    // Signing in while signed in simply replaces the session — no signOut,
    // so the auto-login in AuthGate can't race this.
    await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    });
    setBusy(false);
  }

  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Viewing as</span>
      <select
        className={styles.select}
        value={currentRole || ""}
        onChange={(e) => switchTo(e.target.value)}
        disabled={busy}
      >
        {Object.entries(demoAccounts).map(([role, account]) => (
          <option key={role} value={role}>
            {account.label}
          </option>
        ))}
      </select>
    </label>
  );
}
