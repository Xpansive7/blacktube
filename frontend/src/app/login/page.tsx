"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("lucas@xpansive.com");
  const [password, setPassword] = useState("black777");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel entrar agora."
      );
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-20 top-20 h-72 w-72 animate-glowPulse rounded-full bg-accent-glow blur-3xl" />
        <div
          className="absolute bottom-20 right-20 h-72 w-72 animate-glowPulse rounded-full bg-accent blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="border-border-active/30">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xs bg-gradient-to-br from-accent to-accent-glow shadow-lg shadow-accent-glow/30">
                <span className="text-2xl font-bold text-white">B</span>
              </div>
            </div>

            <div>
              <CardTitle className="mb-2 text-3xl">BlackTube</CardTitle>
              <p className="text-sm text-text-secondary">
                Plataforma de mineracao e criacao de narrativas
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <Input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-3 py-2 text-sm text-status-danger">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded-xs border border-border bg-bg-surface accent-accent"
                    defaultChecked
                  />
                  <span className="text-text-secondary">Lembrar-me</span>
                </label>
                <Link
                  href="#"
                  className="text-accent transition-colors hover:text-accent-glow"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                variant="accent"
                className="mt-6 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-bg-surface px-2 text-text-muted">
                  Nao tem uma conta?
                </span>
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              <Link href="#" className="w-full text-center">
                Criar nova conta
              </Link>
            </Button>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-text-muted">
          BlackTube © 2024 — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
