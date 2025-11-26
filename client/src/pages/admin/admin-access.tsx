import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertTriangle } from "lucide-react";

export default function AdminAccess() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Verify the access code
      if (code !== "20203030") {
        setError("Invalid access code. Please try again.");
        setCode("");
        setIsLoading(false);
        return;
      }

      // Store in session/local storage that access code was verified
      sessionStorage.setItem("admin_access_verified", "true");
      sessionStorage.setItem("admin_access_time", new Date().toISOString());

      // Redirect to admin signup
      setLocation("/admin/signup");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 mx-auto mb-2">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Access Portal</CardTitle>
          <CardDescription className="text-center">
            This is a restricted area. Enter the access code to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="code" className="font-semibold">
                Access Code
              </Label>
              <Input
                id="code"
                type="password"
                placeholder="Enter access code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
                className="text-center tracking-widest text-lg font-mono"
                maxLength={8}
              />
              <p className="text-xs text-slate-500">
                You need a valid access code to create an admin account
              </p>
            </div>

            <Button type="submit" disabled={isLoading || code.length === 0} className="w-full">
              {isLoading ? "Verifying..." : "Verify Access Code"}
            </Button>

            <div className="pt-4 border-t space-y-2">
              <p className="text-xs text-slate-500 text-center mb-2">
                Don't have an access code?{" "}
                <span className="text-slate-400">Contact the system administrator.</span>
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/admin/login")}
              >
                Already have an account? Log In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="fixed bottom-4 right-4 text-xs text-slate-400 max-w-xs text-right hidden md:block">
        <p>🔒 Secure Admin Portal</p>
        <p>All access attempts are logged</p>
      </div>
    </div>
  );
}
