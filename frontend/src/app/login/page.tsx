"use client";

import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // API call would go here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-glow rounded-full mix-blend-screen filter blur-3xl animate-glowPulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent rounded-full mix-blend-screen filter blur-3xl animate-glowPulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="border-border-active/30">
          <CardHeader className="space-y-6 text-center">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-glow rounded-xs flex items-center justify-center shadow-lg shadow-accent-glow/30">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl mb-2">BlackTube</CardTitle>
              <p className="text-text-secondary text-sm">
                Plataforma de Mineração e Criação de Narrativas
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
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

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
                  />
                  <span className="text-text-secondary">Lembrar-me</span>
                </label>
                <Link
                  href="#"
                  className="text-accent hover:text-accent-glow transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="accent"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-surface text-text-muted">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Button variant="ghost" className="w-full">
              <Link href="#" className="w-full text-center">
                Criar nova conta
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-text-muted mt-6">
          BlackTube © 2024 — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
