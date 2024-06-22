import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/fireBase.js";
import {
    getStorage,
    ref,
    deleteObject,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";

initializeApp(firebaseConfig)
const storage = getStorage();

export const createFireBaseImg = async (account, file) => {
    //Add Avatar
    let downloadURL = ''
    if (file) {
        const storageRef = ref(
            storage,
            `Account/${account}/${file.originalname}`
        );
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(
            storageRef,
            file.buffer,
            metadata
        );
        downloadURL = await getDownloadURL(snapshot.ref);
    }

    return downloadURL
}