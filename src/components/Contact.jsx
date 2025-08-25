import React from "react";

const Contact = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
      <p className="text-gray-700 mt-4">
        Have questions? Reach out to us!
      </p>

      <form className="max-w-md mx-auto mt-6 space-y-4">
        <div>
          <label className="block text-gray-700 text-left">Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-left">Email</label>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-left">Message</label>
          <textarea
            placeholder="Your Message"
            className="w-full p-2 border border-gray-300 rounded h-32"
          ></textarea>
        </div>

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;