import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, LogIn, Eye, EyeOff, Sparkles, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = await login(email, password);
    if (success) {
      if (email.toLowerCase() === "bhavyacode12@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/events");
      }
    } else {
      setError("Invalid credentials or unverified email. Please check your email for a verification link.");
      setShowResend(true);
    }
  };

  const handleResend = async () => {
    setResending(true);
    await resendVerification(email);
    setResending(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - rich visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-accent/5 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-primary-foreground/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full border border-primary-foreground/[0.03]" />
        </div>

        <div className="relative z-10 max-w-md text-primary-foreground">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-accent-foreground" />
            </div>
            <span className="text-2xl font-heading">Campus Events</span>
          </div>

          <h1 className="text-4xl font-heading mb-4 leading-tight">
            Your gateway to<br />
            <span className="text-accent">campus life</span>
          </h1>
          <p className="text-lg opacity-70 font-body mb-10 leading-relaxed">
            Discover events, connect with peers, and make the most of your college experience.
          </p>

          <div className="space-y-4">
            {[
              { icon: Calendar, text: "Browse & register for events" },
              { icon: Users, text: "Connect with your community" },
              { icon: Sparkles, text: "Never miss what matters" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-primary-foreground/70">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-heading text-foreground">Campus Events</span>
          </div>

          <h2 className="text-2xl font-heading text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to continue to your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-sm font-medium">
              <LogIn className="h-4 w-4 mr-2" /> Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              Create one
            </Link>
          </p>

          {showResend && (
            <div className="mt-4 pt-4 border-t border-border text-center flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Didn't receive your verification link?</p>
              <Button 
                variant="outline" 
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
