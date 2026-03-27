"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Once the session is confirmed client-side, do a full-page navigation so
  // the server always receives the cookie and renders the dashboard immediately.
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('auth.login.invalidCredentials'));
        setIsLoading(false);
      } else if (result?.ok) {
        // Credentials accepted — show a full-screen spinner and wait for
        // NextAuth to confirm the session (useEffect above) before navigating.
        setRedirecting(true);
      }
    } catch {
      setError(t('auth.login.genericError'));
      setIsLoading(false);
    }
  };

  if (status === "loading" || redirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto"></div>
          <p className="mt-4 text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface shadow-2xl shadow-black/50 rounded-lg px-5 pt-6 pb-8 sm:px-8 border border-border">
          <h1 className="text-3xl font-bold text-center mb-2 text-gradient-primary">
            {t('auth.login.title')}
          </h1>
          <p className="text-center text-text-secondary mb-8 text-sm">
            {t('auth.login.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('common.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent text-text-primary placeholder-text-muted"
                placeholder={t('auth.fields.emailPlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('common.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent text-text-primary placeholder-text-muted"
                placeholder={t('auth.fields.passwordPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-magenta text-white font-medium rounded-lg shadow-sm hover:bg-magenta/90 transition focus:outline-none focus:ring-2 focus:ring-magenta focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
            </button>
          </form>

          <p className="text-center text-text-muted text-xs mt-6">
            {t('auth.login.legal')}
          </p>
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              {t('auth.login.noAccount')}{" "}
              <Link
                href="/register"
                className="text-magenta hover:text-cyan transition font-medium"
              >
                {t('auth.login.signUpLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
