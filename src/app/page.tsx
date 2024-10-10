import { redirect } from "next/navigation";
import WelcomePage from "./welcome";
import { checkIsAuthenticated } from "@/lib/isAuth";


export default async function Home() {
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect('/signin')
  } else {
    return <WelcomePage />
  }
}
