import React from 'react'

const Navbar = () => {
    return (
        <>
            <nav className='flex sticky top-0 justify-between bg-[#1f1f1f] text-white p-2 '>
                <div className="logo">
                    <span className='font-bold text-xl mx-8'>TaskReaper</span>
                </div>
                <ul className='flex gap-8 mx-9'>
                    <li className='cursor-pointer hover:underline transition-all'>Home</li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar
