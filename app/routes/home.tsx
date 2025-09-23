import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResumeLens" },
    { name: "description", content: "Smart Feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)

  useEffect(() => {
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
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResume = async () => {
      setLoadingResumes(true)

      const resumes = await kv.list('resume:*', true) as KVItem[]

      const parseResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      console.log(parseResumes)
      setResumes(parseResumes || [])
      setLoadingResumes(false)
    }
    loadResume()
  }, [])


  return (
    <>
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section ">
          <div className="page-heading py-16">
            <h1>Track your Applications & Resume Rating</h1>
            {!loadingResumes && resumes?.length === 0 ?
              (<h2>No resumes found. Upload your first resume to get feedback.</h2>) :
              (
                <h2>Review your submissions and check AI-powered feedback.</h2>

              )
            }
          </div>
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
           {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
        </section>
      </main>
    </>
  )
}
