import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, CheckCircle, Mail } from "lucide-react";
import { supabase, signUp } from "@/lib/supabase";

type SignupStep = "form" | "verification" | "verified";

export default function AdminSignup() {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState<SignupStep>("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check if access code was verified
  const hasAccessVerification = sessionStorage.getItem("admin_access_verified") === "true";

  if (!hasAccessVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You must verify the access code first. Redirecting...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      // Sign up with Supabase
      const { data, error: signupError } = await signUp(formData.email, formData.password);

      if (signupError) {
        setError(signupError.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError("Failed to create account");
        setIsLoading(false);
        return;
      }

      // Move to verification step
      setStep("verification");
      setSuccessMessage("Check your email for the verification code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!verificationCode) {
        setError("Verification code is required");
        setIsLoading(false);
        return;
      }

      // Verify email
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: verificationCode,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code");
        setIsLoading(false);
        return;
      }

      // Register as admin in database
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const response = await fetch("/api/admin/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.user.id}`,
          },
          body: JSON.stringify({
            userId: userData.user.id,
            email: formData.email,
            name: formData.name,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register as admin");
        }
      }

      setStep("verified");
      setSuccessMessage("Admin account created successfully!");

      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        setLocation("/admin-dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
          <CardDescription>Set up your administrator credentials and email</CardDescription>
        </CardHeader>
        <CardContent>
          {step === "form" && (
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Administrator"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500">
                  You'll need to verify this email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          )}

          {step === "verification" && (
            <form onSubmit={handleVerification} className="space-y-4">
              {successMessage && (
                <Alert className="border-blue-500/20 bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700">{successMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                <p className="text-sm font-semibold mb-1">Verify your email</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  A verification code has been sent to <span className="font-mono">{formData.email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="font-semibold">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={isLoading}
                  maxLength={6}
                  className="text-center tracking-widest text-lg font-mono"
                />
                <p className="text-xs text-slate-500">
                  Check your email for the verification code
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email & Create Account"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("form");
                  setError("");
                  setVerificationCode("");
                }}
                disabled={isLoading}
              >
                Back to Form
              </Button>
            </form>
          )}

          {step === "verified" && (
            <div className="space-y-4 text-center py-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Account Verified!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Your admin account has been successfully created and verified.
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  Redirecting to admin dashboard...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
