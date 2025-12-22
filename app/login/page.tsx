import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import LoginForm from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
      <LoginForm />
    </div>
  );
}
