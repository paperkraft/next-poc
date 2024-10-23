import WelcomePage from "./welcome";
import LandingPage from "./landing";
import { checkIsAuthenticated } from "@/lib/isAuth";

export default async function Home() {
  const isAuthenticated = await checkIsAuthenticated();
  return (isAuthenticated ? <WelcomePage /> : <LandingPage />)
}