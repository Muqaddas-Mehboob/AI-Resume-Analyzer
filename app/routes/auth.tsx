import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => ([
    {title : "ResumeLens | Auth"},
    {content : "Log in to your account"}
])


const Auth = () => {
    const {isLoading, auth} = usePuterStore();

    /* This code snippet is handling the redirection logic after a user logs in. Here's a breakdown of
    what each part is doing: */
    const loaction = useLocation();
    const next = loaction.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(()=>{
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1>Welcome back</h1>
                    <h2>Log in to Continue Your Job Journey</h2>
                </div>
                <div>
                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>Signing you in...</p>
                        </button>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}>
                                    <p>Log out</p>
                                </button>
                            ):(
                                <button className="auth-button" onClick={auth.signIn}>
                                    <p>Log in</p>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    </main>
  )
}

export default Auth