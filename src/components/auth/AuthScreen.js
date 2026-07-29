"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import styles from "./AuthScreen.module.css";

export default function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const signingUp = mode === "signup";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    const { error: authError, data } = signingUp
      ? await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setBusy(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    // Projects with email confirmation on return a user but no session.
    if (signingUp && !data.session) {
      setNotice("Check your email to confirm your account, then sign in.");
      setMode("signin");
    }
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
        <div className={styles.title}>{signingUp ? "Create your account" : "Sign in"}</div>
        <div className={styles.sub}>
          {signingUp
            ? "If your manager has already added your email to a team, you'll join it automatically."
            : "Welcome back to your team journey."}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          {notice && <div className={styles.notice}>{notice}</div>}

          {signingUp && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-name">
                Full name
              </label>
              <input
                id="auth-name"
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={signingUp ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={busy}>
            {busy ? "Working…" : signingUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className={styles.toggle}>
          {signingUp ? "Already have an account? " : "Need an account? "}
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => {
              setMode(signingUp ? "signin" : "signup");
              setError(null);
              setNotice(null);
            }}
          >
            {signingUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
