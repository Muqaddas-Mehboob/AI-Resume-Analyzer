// The lib folder usually stands for “library”.
// Its responsibility depends a little on the type of project, but in general:
// It stores external libraries that your project depends on (for example .jar files in Java, or .dll in C/C++, or custom utility code).
// It can also hold your own helper modules or reusable code that is not part of the main application logic but is still needed.
// The idea is to keep all library-related files in one place so the project stays organized.
// 👉 Example:
// In a Java project → lib/ might have .jar files for frameworks like MySQL Connector or Gson.
// In a Python project → not common (since dependencies are in site-packages), but sometimes projects put custom helper scripts in lib/.
// In a Node.js project → dependencies are usually in node_modules/, but some people create a lib/ folder for their utility functions.

import {create} from "zustand";

// the declare global block doesn’t run anything.
// It just teaches TypeScript about the shape of window.puter, so you can use it safely with autocompletion and error checking.
// the reason we declare it in a separate interface is not because TypeScript doesn’t know window, but because we want to add new custom properties safely.

declare global {
    interface Window {
        puter : {
            auth : {
                signIn: () => Promise<void>,
                isSignedIn : () => Promise<boolean>,
                signOut : () => Promise<void>,
                getUser : () => Promise<PuterUser>,
            },
            fs : {
                write : (
                    path : string,
                    data : string | File | Blob,
                ) => Promise <File | undefined >,
                read : (path : string,) => Promise<Blob>,
                delete : (path: string) => Promise<void>,
                readDir : (path : string) => Promise<FSItem[] | undefined>,
                upload : (file : File[] | Blob[]) => Promise<FSItem>,
            },
            ai : {
                chat : (
                    prompt : string | ChatMessage[],
                    options? : PuterChatOptions,
                    testMode? : boolean,
                    imageUrl? : string | PuterChatOptions,
                ) => Promise<Object>,

                img2txt : (
                    image : string |File | Blob,
                    testMode? : boolean,
                ) => Promise<string>,
            },
            // kv (key-value storage) is responsible for handling small funcstion such as delete, flush, get etc.
            kv : {
                get : (key : string) => Promise<string | null>,
                delete : (key : string) => Promise<boolean>,
                flush : () => Promise<boolean>,
                list : (
                    pattern : string,
                    returnValues? : boolean,
                ) => Promise<string[]>,
                set : (
                    key : string,
                    value : string
                ) => Promise <boolean>,
            },
        }
    }
}

// PuterStore is acting like a central state definition for Zustand.
// It has multiple “modules”:
// auth → Authentication management
// fs → File system
// ai → AI services
// kv → Key-value database
// Plus some global states (isLoading, error, puterReady)
// So, whenever you make a Zustand store with this interface, your app will have a single source of truth for all these functionalities.

interface PuterStore {
    isLoading : boolean,
    puterReady : boolean,
    error : string | null,

    auth : {
        user : PuterUser | null,
        isAuthenticated : boolean,
        signIn : () => Promise<void>,
        signOut : () => Promise<void>,
        refreshUser : () => Promise<void>,
        checkAuthStatus : () => Promise<boolean>,
        getUser : () => PuterUser | null,
    },
    fs : {
        write : (
            path : string,
            data : string | File | Blob
        ) => Promise <File | undefined>,
        read : (path : string,) => Promise<Blob | undefined>,
        delete : (path: string) => Promise<void>,
        readDir : (path : string) => Promise<FSItem[] | undefined>,
        upload : (file : File[] | Blob[]) => Promise<FSItem | undefined>,
    },
    ai : {
        chat : (prompt : string | ChatMessage[],
                options? : PuterChatOptions,
                testMode? : boolean,
                imageUrl? : string | PuterChatOptions,
            ) => Promise <AIResponse | undefined>,
        img2txt : (
            image : string | File | Blob,
            testMode? : boolean
        ) => Promise <string | undefined>,
        feedback : (
            path : string,
            message : string
        ) => Promise<AIResponse | undefined>
    },
    kv : {
        get : (key : string) => Promise<string | null | undefined>,
        set : (key: string, value : string) => Promise<boolean | undefined>,
        delete : (key : string) => Promise <boolean | undefined>,
        list : (
            pattern : string,
            returnValues? : boolean
        ) => Promise<string[] | KVItem[] | undefined> ,
        flush : () => Promise<boolean | undefined>,
    },

    init : () => void, // for initializing the store
    clearError : () => void
}

// if window and puter exists, display puter, or null otherwise.

const getPuter = () : typeof window.puter | null => 
    typeof window !== "undefined" && window.puter ? window.puter : null;


// This code defines a state store for your app.
// setError is a helper that handles errors by resetting authentication and stopping loading.
// The values (error, isLoading, auth methods) are based on your PuterStore interface, 
// but the actual functions (signIn, signOut, etc.) are taken from the existing store state via get().

export const usePuterStore = create<PuterStore>((set, get) => {
    const setError = (msg : string) => {
        set({
            error : msg,
            isLoading : false,
            auth : {
                user : null,
                isAuthenticated : false,
                signIn : get().auth.signIn,
                signOut : get().auth.signOut,
                refreshUser : get().auth.refreshUser,
                checkAuthStatus : get().auth.checkAuthStatus,
                getUser : get().auth.getUser,
            }
        })
    }

    const checkAuthStatus = async  () : Promise<boolean> => {
        const puter = getPuter();
        if(!puter) {
            setError("Puter.js not available right now");
            return false;
        }

        set({isLoading : true, error : null});

        try {
            const isSignedIn = await puter.auth.isSignedIn();
            if(isSignedIn) {
                const user = await puter.auth.getUser();
                set({
                    auth:{
                        user,
                        isAuthenticated : true,
                        signIn : get().auth.signIn,
                        signOut : get().auth.signOut,
                        refreshUser : get().auth.refreshUser,
                        checkAuthStatus : get().auth.checkAuthStatus,
                        getUser : () => user,
                    },
                    isLoading : false
                })
                return true
            }
            else {
                set({
                    auth : {
                        user : null,
                        isAuthenticated : false,
                         signIn : get().auth.signIn,
                        signOut : get().auth.signOut,
                        refreshUser : get().auth.refreshUser,
                        checkAuthStatus : get().auth.checkAuthStatus,
                        getUser : () => null,
                    },
                    isLoading : false
                })
                return false
            }
            
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Failed to check auth status";
            setError(msg)
            return false
        }
    }

    const signIn = async () : Promise<void> => {
        const puter = getPuter();

        if(!puter) {
            setError("Puter.js is not available right now");
            return;
        }

        set({isLoading : true , error : null});

        try {
            await puter.auth.signIn();
            await checkAuthStatus();
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Sign In failed";
            setError(msg)
        }
    }

    const signOut = async () : Promise<void> => {
        const puter = getPuter();

        if(!puter) {
            setError("Puter.js is not available right now");
            return;
        }

        set({isLoading : true , error : null});

        try {
            await puter.auth.signOut();
            set({
                auth: {
                    user : null,
                    signIn : get().auth.signIn,
                    signOut : get().auth.signOut,
                    refreshUser : get().auth.refreshUser,
                    isAuthenticated : false,
                    checkAuthStatus : get().auth.checkAuthStatus,
                    getUser : () => null,
                },
                isLoading : false
            })
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Sign Out failed";
            setError(msg)
        }
    }

    const refreshUser = async () : Promise<void> => {
        const puter = getPuter();

        if(!puter) {
            setError("Puter.js is not available right now");
            return;
        }

        set({isLoading : true , error : null});

        try {
            const user = await puter.auth.getUser();
            set({
                auth : {
                    user,
                    signIn : get().auth.signIn,
                    signOut : get().auth.signOut,
                    refreshUser : get().auth.refreshUser,
                    isAuthenticated : true,
                    checkAuthStatus : get().auth.checkAuthStatus,
                    getUser : () => user,
                },
                isLoading : false,
            })
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Failed to refresh user";
            setError(msg)
        }
    }

    const init = () : void => {
        const puter = getPuter();
        if(puter){
            set({puterReady : true})
            checkAuthStatus()
            return
        }
    }

    // Refresh
    const interval = setInterval(() => {
        if(getPuter()){
            clearInterval(interval)
            set({puterReady: true})
            checkAuthStatus()
        }
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        if(!getPuter()){
            setError("Puter.js failed to load within 10 seconds")
        }
    }, 1000);


    const write = async (path : string , data : string | File | Blob) => {
        const puter = getPuter();
        if(!puter) {
            setError("Puter.js is not available right now");
            return;
        }
        return puter.fs.write(path, data);
    }

    const readDir = async (path : string) => {
        const puter = getPuter();
        if(!puter){
            setError("Puter.js is not available right now")
            return
        }

        return puter.fs.readDir(path);
    }

    const read = async (path : string) => {
        const puter = getPuter();
        if(!puter){
            setError("Puter.js is not available right now")
            return
        }

        return puter.fs.read(path);
    }

    const upload = async (files : File[] | Blob[]) => {
        const puter = getPuter();
        if(!puter){
            setError("Puter.js is not available right now")
            return
        }

        return puter.fs.upload(files);
    }

    const deleteFile = async (path : string) => {
        const puter = getPuter();
        if(!puter){
            setError("Puter.js is not available right now")
            return
        }

        return puter.fs.delete(path);
    }

    const chat = async (
        prompt : string | ChatMessage[],
        options? : PuterChatOptions,
        testMode? : boolean,
        imageUrl? : string| PuterChatOptions 
    ) => {
        const puter = getPuter();

        if(!puter){
            setError("Puter.js is not available right now")
            return
        }
        return puter.ai.chat(prompt, options, testMode, imageUrl) as Promise <AIResponse | undefined>;

    }

    const img2txt = async (
        image : string | File | Blob,
        testMode? : boolean
    ) => {
        const puter = getPuter();

        if(!puter){
            setError("Puter.js is not available right now")
            return
        }

        return puter.ai.img2txt(image, testMode)
    }

    const feedback = async (
        path : string,
        message : string
    ) => {
        const puter = getPuter();

        if(!puter){
            setError("Puter.js is not available right now")
            return
        }

        return puter.ai.chat([
            {
                role : "user",
                content : [
                    {
                        type : "file",
                        puter_path : path
                    },
                    {
                        type : "text",
                        text : message
                    }
                ]
            }
        ],
        {model : 'claude-sonnet-4'}
    ) as Promise <AIResponse | undefined>
    }

    const getKv = async (key : string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.get(key);
    }

    const setKv = async (key : string, value : string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.set(key, value);
    }

    const deleteKv = async (key : string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.delete(key);
    }

    const listKv = async (
        pattern : string,
        returnValues? : boolean,
    ) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        if(returnValues === undefined) returnValues = false;

        return puter.kv.list(pattern, returnValues);
    }

    const flushKv = async () => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.flush();
        
    }

    return {
        isLoading : true,
        error : null,
        puterReady : false,

        auth : {
            user : null,
            isAuthenticated : false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser : () => get().auth.user,
        },
        fs : {
            write : (path : string, data : string | File | Blob) => write(path, data),
            read : (path : string) => read(path),
            delete : (path : string) => deleteFile(path),
            readDir : (path : string) => readDir(path),
            upload : (files: File[] | Blob[]) => upload(files)
        },
        ai : {
            chat : (
                prompt : string | ChatMessage[],
                options? : PuterChatOptions,
                testMode? : boolean,
                imageUrl? : string | PuterChatOptions,
            ) => chat(prompt, options, testMode, imageUrl),
            img2txt : (image : string | File | Blob, testMode) => img2txt(image, testMode),
            feedback : (path : string, message : string) => feedback(path, message),
        },
        kv : {
            get : (key :string) => getKv(key),
            list : (pattern :string, returnValues? : boolean) => listKv(pattern, returnValues),
            delete : (key :string) => deleteKv(key),
            set : (key : string, value : string) => setKv(key, value),
            flush : () => flushKv(),
        },
        init,
        clearError : () => set({error : null})
    }

})