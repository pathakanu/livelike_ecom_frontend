import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ChatContainer from "@/components/chat/ChatContainer";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <ChatContainer />;
}
