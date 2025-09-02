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
                readdir : (path : string) => Promise<FSItem | undefined>,
                upload : (file : File[] | Blob[]) => Promise<FSItem>,
            },
            ai : {
                chat : (
                    prompts : string | ChatMessage[],
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

interface PuterStore {

}

// const usePuterStore = create(set) => {

// }