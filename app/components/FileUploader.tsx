import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

interface FileUploaderprops{
    onFileSelect? : (file : File | null) => void;
}

const FileUploader = ({ onFileSelect} : FileUploaderprops ) => {

    const onDrop = useCallback((acceptedFiles : File[]) => {

        const file = acceptedFiles[0] || null
        onFileSelect?.(file)  // call only if prop was passed

    }, [onFileSelect])

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple : false,
        accept : { 'application/pdf' : ['.pdf']},
        maxSize : 20 * 1024 * 1024
    })

    const file = acceptedFiles[0] || null



  return (
    <div className="w-full gradient-border">
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className='cursor-pointer space-y-4'>
                <div className='mx-auto w-16 h-16 flex items-center justify-center'>
                    <img src='/icons/info.svg' alt='upload' className='size-20'></img>
                </div>
                {file ? (
                    <div>

                    </div>
                ) : (
                    <div>
                        <p className='text-xl text-gray-500'><b>Click to upload </b> or drag and drop</p>
                        <p className='text-lg text-gray-500'>PDF,PNG or JPG (max. 10MB)</p>
                    </div>
                )}
            </div>
         </div>
    </div>
  )
}

export default FileUploader