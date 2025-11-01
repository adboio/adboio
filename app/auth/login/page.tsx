import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen font-mono -my-12 sm:-my-24 -mx-6">
      <div className="w-full max-w-md px-6">
        <LoginForm />
      </div>
    </main>
  );
}
