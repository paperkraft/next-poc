import React from "react";
import LandingPage from "./landing";
import { checkIsAuthenticated } from "@/lib/isAuth";

export default async function Home() {
  const isAuthenticated = await checkIsAuthenticated()
  return(
    <React.Fragment>
      <LandingPage auth={isAuthenticated} />
    </React.Fragment>
  ) 
}