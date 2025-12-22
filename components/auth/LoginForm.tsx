"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("shopsecure");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid username or password");
      return;
    }

    router.push(result?.url ?? "/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
    >
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
          LiveLike Commerce
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-1 text-sm text-slate-300">
          Use your workspace credentials to continue.
        </p>
      </div>

      <label className="mb-4 block text-sm font-medium text-slate-200">
        Username
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-2 bg-black/40 text-white"
          placeholder="demo"
          autoComplete="username"
        />
      </label>

      <label className="mb-2 block text-sm font-medium text-slate-200">
        Password
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 bg-black/40 text-white"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Continue
      </Button>

      <p className="mt-4 text-center text-xs text-slate-400">
        Demo credentials pre-filled. Replace with your auth backend when ready.
      </p>
    </form>
  );
}
