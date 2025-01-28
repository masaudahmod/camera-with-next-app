import Image from "next/image";
import CameraController from "./components/CameraController";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <CameraController />
      </div>
    </>
  );
}
