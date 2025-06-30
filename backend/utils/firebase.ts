//order image upload handling via firebase
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadImageToFirebase = async (file: Express.Multer.File): Promise<string> => {
  const fileRef = ref(storage, `product-images/${Date.now()}-${file.originalname}`);
  await uploadBytes(fileRef, file.buffer);
  return await getDownloadURL(fileRef);
};

export const uploadCustomOrderImageToFirebase = async (file: Express.Multer.File): Promise<string> => {
  const fileRef = ref(storage, `custom-order-images/${Date.now()}-${file.originalname}`);
  await uploadBytes(fileRef, file.buffer);
  return await getDownloadURL(fileRef);
};