"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import styles from "./AuthScreen.module.css";

export default function TeamSetup() {
  const { profile, refreshProfile, signOut } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (teamError) {
      setBusy(false);
      setError(teamError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ team_id: team.id, role: "manager" })
      .eq("id", profile.id);

    if (profileError) {
      setBusy(false);
      setError(profileError.message);
      return;
    }

    // Put the manager on their own roster so they can vote and post like anyone else.
    await supabase.from("members").insert({
      team_id: team.id,
      name: profile.full_name || profile.email,
      email: profile.email,
      user_id: profile.id,
    });

    await supabase.from("team_state").insert({ team_id: team.id });
    await refreshProfile();
    setBusy(false);
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <Image
          src="/samuh-logo.png"
          alt="Samuh"
          width={140}
          height={45}
          className={styles.logo}
          priority
        />
        <div className={styles.title}>Name your team</div>
        <div className={styles.sub}>
          You&apos;re set up as the manager. Create your team, then add members on the
          Prepare step — they&apos;ll join automatically when they sign up with the email
          you list.
        </div>

        <form className={styles.form} onSubmit={handleCreate}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="team-name">
              Team name
            </label>
            <input
              id="team-name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Platform Engineering"
              required
            />
          </div>
          <button type="submit" className={styles.submit} disabled={busy || !name.trim()}>
            {busy ? "Creating…" : "Create team"}
          </button>
        </form>

        <div className={styles.toggle}>
          Signed in as {profile?.email}.{" "}
          <button type="button" className={styles.toggleButton} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
