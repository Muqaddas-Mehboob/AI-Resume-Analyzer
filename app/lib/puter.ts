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
                delete : (kay : string) => Promise<boolean>,
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
        delete : (ley : string) => Promise <boolean>,
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
    typeof window !== undefined && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>((set, get)) => {
    const setError = () => {
        set({
            
        })
    }
}