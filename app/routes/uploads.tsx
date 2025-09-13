import { useState, type FormEvent } from "react"
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar"

const Uploads = () => {
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, isStatusText] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        // Give form Data without relying on state
        const form = event.currentTarget.closest('form')

        if(!form) return


        const formData = new FormData(form)

        const companyName = formData.get('company-name') as string
        const jobTitle = formData.get('job-title') as string
        const jobDescription = formData.get('job-description') as string

        console.log({companyName, jobDescription, jobTitle, file})
    }

    const handleFileSelect = (file : File | null) => {
        setFile(file)
    }

  return (
    <>
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif"></img>
                        </>
                    ): (
                        <h2>Drop your resume for an ATS score and improvement tips.</h2>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" placeholder="Comapny Name" name="company-name" id="company-name"></input>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" placeholder="Enter your job title" name="job-title" id="job-title"></input>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} placeholder="Write a clear and concise job description with responsibilities & expectations."
                                name="job-description" id="job-description"
                                ></textarea>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume here</label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>
                            <button className="primary-button" type="submit">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    </>
  )
}

export default Uploads