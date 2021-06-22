import { API } from '../../enviroments/enviroment.js';

export class FirebaseService {

    constructor() {
        this.firestore = firebase.initializeApp(API).firestore();
        this.pending = null;
    }

    sendImg(payload) {
        if (this.pending) return;

        this.pending = new Promise((resolve) => resolve(this.firestore.collection('portaria').add(payload)));

        this.pending.then(() => this.pending = null).catch((e)=> console.error(e));
    }
   
}