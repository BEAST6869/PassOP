import React, { useEffect } from 'react'
import { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const manager = () => {
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const ref = useRef()
    const passwordRef = useRef()
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setform({ ...form, [name]: value })
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("/eyeclosed.svg")) {
            ref.current.src = "/eyeopen.svg"
            passwordRef.current.type = "text"
        }
        else {
            ref.current.src = "/eyeclosed.svg"
            passwordRef.current.type = "password"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: form.id })
            })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form])
            setform({ site: "", username: "", password: "" })
            toast.success('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            toast.warn('Please provide a valid password/username length!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }

    const deletePassword = async (id) => {
        let c = window.confirm("Are you sure you want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter((item) => item.id !== id))
            let res = await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter((item) => item.id !== id)))
            console.log([...passwordArray, form]);
            toast.success('Password deleted successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const editPassword = (id) => {
        console.log("Editing password with id ", id)
        setform({...passwordArray.filter(i => i.id === id)[0] , id: id})
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const copyText = (text) => {
        toast.success('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigator.clipboard.writeText(text)
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            // transition="Bounce"
            />

            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-8 sm:py-12 md:py-16">
                <h1 className='text-3xl sm:text-4xl font-bold text-center'>
                    <span className='text-purple-700'>&lt;</span>
                    <span></span>Pass<span className='text-purple-700'>OP/&gt;</span>
                </h1>
                <p className='text-base sm:text-lg text-center text-black font-bold '>Your own Password Manager</p>
                <div className='textwhite flex flex-col p-2 sm:p-4 gap-4 sm:gap-5'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='bg-white border border-purple-900 rounded-full px-3 py-1 sm:px-4 sm:py-1' type="text" name="site" id="" />
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 w-full justify-between'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter username' name='username' className='bg-white border border-purple-900 rounded-full px-3 py-1 sm:px-4 sm:py-1 w-full' type="text" />
                        <div className='flex gap-2 w-full relative mt-2 sm:mt-0'>
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' name='password' className='bg-white border border-purple-900 rounded-full px-3 py-1 sm:px-4 sm:py-1 w-full' type="password" />
                            <span className='absolute right-[10px] top-[-4px] mx-auto cursor-pointer' onClick={showPassword}><img ref={ref} src="/eyeclosed.svg" alt="eyeclosed" /></span>
                        </div>
                    </div>
                    <button
                        onClick={savePassword}
                        className='flex justify-center items-center gap-2 bg-purple-500 rounded-full px-6 sm:px-8 py-2 w-fit border border-purple-900 cursor-pointer mx-auto shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 ease-in-out'
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>
                </div>
                <div className="passwords overflow-x-auto">
                    <h2 className='font-bold text-xl sm:text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10 text-xs sm:text-base">
                        <thead className='bg-purple-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-purple-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <a href={item.site} target='_blank'>{item.site}</a>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{item.username}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='justify-center py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>

                            })}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    )
}

export default manager
