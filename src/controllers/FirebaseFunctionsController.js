import { fbFunctions } from '@/firebase'
import {
    httpsCallable,
} from 'firebase/functions'

export class FirebaseFunctionsController {
    constructor() { }

    /**
    * Calls a Firebase Function according to the given name and data.
    *
    * @param { string } functionName the function that will be called.
    * @param { unknown } data any data that might be passed to the function.
    * @returns a promise that awaits for the function return.
    */
    static async callHttpsCallableFunction(functionName, data) {
        const f = httpsCallable(fbFunctions, functionName)
        return f(data)
    }

}