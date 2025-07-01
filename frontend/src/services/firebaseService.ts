import { ref, uploadBytes, getDownloadURL, deleteObject } from '../firebase';
import { getStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage();

//upload an image file to Firebase Storage and return its download URL
export const uploadImageToFirebase = async (file: File): Promise<string> => {
  try {
    //validate file presence and type
    if (!file) throw new Error('No file provided');
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) { 
      throw new Error('File size must be less than 5MB');
    }
//generate a unique file name and reference in the 'products' folder
    const storage = getStorage();
    const fileExtension = file.name.split('.').pop();
    const fileName = `products/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    const metadata = {
      contentType: file.type,
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteImageFromFirebase = async (url: string): Promise<void> => {
  try {
    //extract the storage path from the download URL
    const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};