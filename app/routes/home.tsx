import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Smart Feedback for your dream job" },
  ];
}

export default function Home() {
  const {auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(()=>{
      /* The `'/auth?next=/'` is a URL path that is being used for
        redirection after authentication. In this context, it
        seems like it is being used to redirect the user to the
        authentication page (`/auth`) with a query parameter
        `next=/` indicating that the user should be redirected
        back to the home page (`/`) after successful
        authentication. This is a common pattern used in web
        applications to maintain the user's intended destination
        after they have completed a certain action, such as
        logging in. */
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

  return(
    <>
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar/>
      <section className="main-section ">
          <div className="page-heading py-16">
            <h1>Track your Applications & Resume Rating</h1>
            <h2>Review your submissions and check AI-powered feedback.</h2>
          </div>

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume}/>
          ))}
        </div>
      )}
      </section>
    </main>
    </>
  )
}
