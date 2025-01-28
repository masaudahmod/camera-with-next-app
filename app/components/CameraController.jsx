"use client";

import { useEffect, useRef, useState } from "react";

const CameraController = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [filter, setFilter] = useState("none");
  const [zoom, setZoom] = useState(1);
  const [facingMode, setFacingMode] = useState("user"); // 'user' (front) or 'environment' (back)
  const [photo, setPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    startCamera();
  }, [facingMode]);

  // 📷 Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // 📸 Capture Image
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas size to video size
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Apply filter before taking a snapshot
    context.filter = filter;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Save image and open modal
    setPhoto(canvas.toDataURL("image/png"));
    setIsModalOpen(true);
  };

  // 🔄 Flip Camera (Front / Back)
  const flipCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // 💾 Download Image
  const downloadPhoto = () => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = "captured-image.png";
    link.click();
    setIsModalOpen(false); // Close modal after download
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen w-screen bg-gray-900 p-4">
      {/* 📷 Camera Frame (70% screen size) */}
      <div className="w-full lg:w-[70%] h-[70vh] flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full rounded-lg object-cover"
          style={{ filter, transform: `scale(${zoom})` }}
        />
      </div>

      {/* 🎮 Controller Panel */}
      <div className="w-full lg:w-[30%] flex flex-col lg:ml-6 mt-6 lg:mt-0 lg:space-y-4 bg-gray-800 p-4 rounded-lg">
        {/* 🎨 Filters */}
        <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 justify-center">
          {["none", "grayscale(100%)", "sepia(100%)", "invert(100%)"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
            >
              {f === "none" ? "Normal" : f.replace("(100%)", "")}
            </button>
          ))}
        </div>

        {/* 🔍 Zoom Control */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-white">Zoom</label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-32"
          />
        </div>

        {/* 📸 Capture & Flip Buttons */}
        <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 justify-center">
          <button
            onClick={capturePhoto}
            className="px-4 py-2 bg-red-500 text-white rounded-full"
          >
            📸 Capture
          </button>
          <button
            onClick={flipCamera}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            🔄 Flip
          </button>
        </div>
      </div>

      {/* 📷 Modal Preview */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            <img src={photo} alt="Captured" className="rounded-lg max-w-[90%] max-h-[70vh]" />
            <div className="flex space-x-4 mt-4">
              <button onClick={downloadPhoto} className="px-4 py-2 bg-green-500 text-white rounded">
                💾 Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas for Capturing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraController;