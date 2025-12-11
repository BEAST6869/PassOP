import React from 'react';

const LoginPage = () => {
  const googleLoginUrl = `${import.meta.env.VITE_API_URL}/auth/google`;

  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Welcome to PassOP
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Please log in to manage your passwords
      </p>

      <a
        href={googleLoginUrl}
        className="mt-8 px-6 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
      >
        Login With Google
      </a>
    </div>
  );
};

export default LoginPage;