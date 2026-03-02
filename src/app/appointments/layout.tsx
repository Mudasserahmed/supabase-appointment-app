import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { createClient } from "@/utils/supabase/server";

export default async function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "";
  const userName = (user?.user_metadata?.name as string) ?? "";

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar userEmail={userEmail} userName={userName} />
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">{children}</main>
    </div>
  );
}
