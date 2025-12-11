import React from 'react';

const Navbar = ({ user, onLogout }) => {

  const googleLoginUrl = `${import.meta.env.VITE_API_URL}/auth/google`;

  const renderAuthButton = () => {
    switch (user) {
      case null:
        return null;
      case false:
        return (
          <a href={googleLoginUrl} className='border border-black-700 px-4 py-1 rounded-full font-semibold hover:bg-purple-700 hover:text-white transition duration-300 flex items-center gap-2 cursor-pointer mx-2'>
            Login with Google
          </a>
        );
      default:
        return (
          <button onClick={onLogout} className='border border-black-700 px-4 py-1 rounded-full font-semibold hover:bg-purple-700 hover:text-white transition duration-300 flex items-center gap-2 cursor-pointer mx-2'>
            Logout
          </button>
        );
    }
  };

  return (
    <nav className='bg-purple-200 p-2 mx-1 my-1 rounded-lg flex items-center justify-between'>
      <div className='font-bold text-2xl'>
        <span className='text-purple-700'>&lt;</span>
        <span>Pass</span><span className='text-purple-700'>OP/&gt;</span>
      </div>
      {renderAuthButton()}
    </nav>
  );
};

export default Navbar;