import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full px-4 py-3 bg-gradient-to-r from-purple-100 via-white to-purple-100 shadow-inner flex flex-col items-center gap-1 border-t border-purple-200">
            <div className="logo font-bold text-xl flex items-center gap-1 tracking-wide">
                <span className="text-purple-700">&lt;</span><span>Pass</span>
                <span className="text-purple-700">OP/&gt;</span>
            </div>
            <div className="flex items-center  text-sm gap-1">
                Made with
                <span className="mx-1 animate-pulse">💜</span>
                by <a href="https://github.com/BEAST6869" target="_blank" rel="noopener noreferrer" className=" hover:text-purple-700 underline ml-1">UjjwalTiwari</a>
            </div>
            <div className="text-xs mt-1">
                &copy; {new Date().getFullYear()} PassOP. All rights reserved.
            </div>
        </footer>
    )
}


export default Footer