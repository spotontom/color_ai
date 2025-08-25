import React, { useState, useRef, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { applyColorTransfer } from "../apiservice"; // Import API function
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [tokens, setTokens] = useState(0);
  const inputRef = useRef(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchTokens = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setTokens(userSnap.data().tokens);
        }
      }
    };
    fetchTokens();
  }, [auth]);

  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !selectedArea || !selectedColor) {
      setError("Please select an area and enter a color.");
      return;
    }
    
    setLoading(true);
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setError("User data not found.");
      setLoading(false);
      return;
    }

    const userData = userSnap.data();
    if (userData.tokens <= 0) {
      setError("You have no tokens left. Please purchase more.");
      setLoading(false);
      return;
    }

    try {
      // Deduct one token and update Firestore
      await updateDoc(userRef, { tokens: userData.tokens - 1 });
      setTokens(userData.tokens - 1);

      const imageUrl = selectedImage; // Use actual uploaded image URL in production
      const response = await applyColorTransfer(imageUrl, selectedArea, selectedColor);
      setProcessedImage(response.data);
    } catch (err) {
      setError("Failed to process image. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 mt-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Image</h1>
        <p className="text-gray-600">Upload an image to start modifying its colors</p>
      </div>

      <div className="relative border-2 border-dashed rounded-lg p-8">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

        {selectedImage ? (
          <div className="space-y-4">
            <img src={selectedImage} alt="Preview" className="max-h-96 mx-auto rounded-lg shadow-lg" />
            <div className="flex justify-center">
              <button onClick={() => setSelectedImage(null)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => inputRef.current?.click()}>
            <UploadCloud className="w-16 h-16 text-blue-600 mb-4" />
            <p className="text-lg text-gray-700 mb-2">Drag and drop your image here</p>
            <p className="text-sm text-gray-500">or click to select a file</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="mt-4">
          <label className="block text-gray-700">Select Area:</label>
          <select
            className="block w-full p-2 border rounded"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">-- Select an Area --</option>
            <option value="wall">Wall</option>
            <option value="floor">Floor</option>
            <option value="ceiling">Ceiling</option>
          </select>
        </div>
      )}

      {selectedImage && (
        <div className="mt-4">
          <label className="block text-gray-700">Select Color:</label>
          <input
            type="text"
            className="block w-full p-2 border rounded"
            placeholder="Enter a color (e.g., sky blue)"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>
      )}

      {selectedImage && (
        <div className="mt-8 text-center">
          <button onClick={handleEdit} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={loading}>
            {loading ? "Processing..." : "Start Editing"}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {processedImage && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edited Image</h2>
          <img src={processedImage} alt="Processed" className="max-h-96 mx-auto rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
