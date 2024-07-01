import React, { useEffect, useState } from "react";
import { db } from "./db";
export default function CachingImage(props) {
  const [source, setSource] = useState("");

  useEffect(() => {
    loadImage(props.src);
  }, [props.src]);
  async function fetchImageAsDataURL(imageUrl) {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl);

      // Ensure the fetch was successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a FileReader to read the Blob as a Data URL
      const reader = new FileReader();

      // Return a promise that resolves with the Data URL
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching and converting image:", error);
    }
  }

  const loadImage = (src) => {
    let image = db.images.where({sourceUrl: src}).image;
    if (image) {
      
      setSource(image);
    } else {
      
      // fetchImageAsDataURL(src).then((DataUrl) => {
      //   localStorage.setItem(src, DataUrl);
      //   setSource(DataUrl);
      // });
      fetchImageAsDataURL(src).then((DataUrl) => {
          db.images.add({sourceUrl:src,image:DataUrl});
          setSource(DataUrl);
        });
    }
  };

  return (
    <>
      <img {...props} src={source}></img>
    </>
  );
}
