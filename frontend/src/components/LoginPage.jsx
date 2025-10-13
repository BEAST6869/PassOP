import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center">
      {/* Updated heading with gradient text */}
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Welcome to PassOP
      </h1>

      {/* Updated subheading with better contrast and size */}
      <p className="mt-4 text-lg text-slate-600">
        Please log in to manage your passwords
      </p>

      {/* The button remains the same */}
      <a
        href="http://localhost:3000/auth/google"
        className="mt-8 px-6 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
      >
        Login With Google
      </a>
    </div>
  );
};

export default LoginPage;