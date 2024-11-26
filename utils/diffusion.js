import axios from 'axios';
import FormData from "form-data";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebaseConfig';

export async function removeBg(base64Image) {
  try {
    if (base64Image.startsWith('data:')) {
      base64Image = base64Image.split(',')[1];
    }

    // Convert the base64 image into a blob for API upload
    const formData = new FormData();
    formData.append("image_file_b64", base64Image);
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": process.env.EXPO_PUBLIC_REMOVE_BG_API_KEY },
      body: formData,
    });

    if (response.ok) {
      console.log("Background removed successfully");
      const removedBgImage = response.arrayBuffer();
      return removedBgImage;
    } else {
      const errorText = await response.text();
      console.error(`${response.status}: ${errorText}`);
    }
  } catch (errors) {
    console.error("Failed to remove background", errors);
  }
}

export async function generateImage(prompt) {
  const payload = {
    prompt: prompt,
    output_format: 'png',
    seed: 227468720,
    cfg_scale: 3.5,
  };

  const apiKey = process.env.EXPO_PUBLIC_STABILITY_AI_API_KEY;

  try {
    console.log('Generating image...');
    const response = await axios.postForm(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json', // image as base64 encoded JSON.
        },
        responseType: "json",
      }
    );

    if (response.status === 200) {
      const base64Image = response.data.image; // Adjust the key based on your API response
      console.log('Image generated successfully');
      return base64Image;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

export async function uploadImageToFirebase(base64Image, filePath) {
  const storageRef = ref(storage, filePath);

  try {
    // Convert base64 string to a Blob
    const response = await fetch(`data:image/png;base64,${base64Image}`);
    const blob = await response.blob();

    // Upload the Blob to Firebase Storage
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Image uploaded to Firebase:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw error;
  }
}