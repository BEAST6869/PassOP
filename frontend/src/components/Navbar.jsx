import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-purple-200  p-2 mx-1 my-1 rounded-lg flex items-center justify-between'>
      <div className='font-bold text-2xl'>
        <span className='text-purple-700'>&lt;</span>
        <span></span>Pass<span className='text-purple-700'>OP/&gt;</span>
      </div>

      <button className='border border-black-700 px-4 py-1 rounded-full font-semibold hover:bg-purple-700 hover:text-white transition duration-300 flex items-center gap-2 cursor-pointer mx-2'>
          <lord-icon
            src="https://cdn.lordicon.com/jjxzcivr.json"
            trigger="hover"
            colors="primary:#121331,secondary:#000000">
          </lord-icon>
        GitHub
      </button>
    </nav>
  )
}

export default Navbar
