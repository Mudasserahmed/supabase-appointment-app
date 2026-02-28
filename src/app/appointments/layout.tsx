import Navbar from "../components/Navbar";
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
    <div className="min-h-screen bg-muted/20">
      <Navbar userEmail={userEmail} userName={userName} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
    </div>
  );
}
