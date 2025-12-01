import React from "react";
import { useEffect } from "react";
import Navbar from "../../Components/Navbar";

function Showcase() {

      useEffect(() => {
        localStorage.setItem("activelink", "Showcase");
      }, []);
  return (
    <>
      <Navbar />
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Showcase Coming Soon
          </h1>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            I’m currently working on a beautiful project showcase section where
            you’ll be able to explore my best work with live previews, tech
            stacks, and GitHub links.
          </p>
          <p className="mt-4 text-gray-500 text-xs">
            Stay tuned — updates arriving soon!
          </p>
        </div>
      </div>
    </>
  );
}

export default Showcase;
