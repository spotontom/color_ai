import React from "react";

const About = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className="max-w-[40%] text-center p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900">About This App</h1>
      <p className="text-gray-700 mt-4">
        This is an AI-powered image color-changing tool that allows users to upload 
        images and modify their colors dynamically.

        <br />
        We are a family run business that specializes in creative real estate spaces, 
        this tool was designed with the purpose of helping our clients visualize 
        there properties in a new light.
        <br />
        The app uses advanced algorithms to analyze the uploaded images and apply
        various color transformations. Users can choose from a range of color palettes
        and effects to see how their images would look with different color schemes.
      </p>
    </div>
    </div>
    
  );
};

export default About;