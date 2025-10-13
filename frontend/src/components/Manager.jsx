import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api'; // Import our new api client
import { encrypt, decrypt } from '../utils/crypto'; // Import our crypto functions

const Manager = () => {
    const [form, setForm] = useState({ site: "", username: "", password: "", _id: null });
    const [secrets, setSecrets] = useState([]);
    const [masterKey, setMasterKey] = useState(""); // Key for encryption/decryption

    const passwordRef = useRef();
    const eyeRef = useRef();

    useEffect(() => {
        // Prompt for master password once when the component loads
        const key = prompt("Please enter your Master Password. This is used to encrypt/decrypt your data and is never stored.");
        if (key) {
            setMasterKey(key);
        }
    }, []);

    useEffect(() => {
        // Fetch secrets only if the master key is set
        if (masterKey) {
            const getSecrets = async () => {
                try {
                    const { data } = await api.get('/api/secrets');
                    // Decrypt each secret's password before setting state
                    const decryptedSecrets = data.map(secret => {
                        try {
                            const decryptedPassword = decrypt(secret, masterKey);
                            return { ...secret, password: decryptedPassword };
                        } catch (e) {
                            console.error("Decryption failed for a secret:", secret._id);
                            toast.error("Could not decrypt a password. Master key may be incorrect.");
                            return { ...secret, password: "DECRYPTION FAILED" };
                        }
                    });
                    setSecrets(decryptedSecrets);
                } catch (error) {
                    toast.error("Failed to fetch secrets.");
                    console.error("Fetch secrets error:", error);
                }
            };
            getSecrets();
        }
    }, [masterKey]); // Re-run if masterKey changes

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showPassword = () => {
        const isText = passwordRef.current.type === "text";
        passwordRef.current.type = isText ? "password" : "text";
        eyeRef.current.src = isText ? "/eyeclosed.svg" : "/eyeopen.svg";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!masterKey) {
            return toast.error("Master Password is not set. Please refresh and enter it.");
        }
        if (!form.site || !form.username || !form.password) {
            return toast.warn("All fields are required!");
        }

        try {
            // Encrypt the password before sending it to the backend
            const encryptedData = encrypt(form.password, masterKey);
            const payload = {
                site: form.site,
                username: form.username,
                ...encryptedData, // includes ciphertext, iv, salt
            };

            let response;
            if (form._id) {
                // Update existing secret
                response = await api.put(`/api/secrets/${form._id}`, payload);
                setSecrets(secrets.map(s => (s._id === form._id ? { ...response.data, password: form.password } : s)));
                toast.success('Password updated!');
            } else {
                // Create new secret
                response = await api.post('/api/secrets', payload);
                setSecrets([...secrets, { ...response.data, password: form.password }]);
                toast.success('Password saved!');
            }
            setForm({ site: "", username: "", password: "", _id: null });
        } catch (error) {
            toast.error("Failed to save password.");
            console.error("Save password error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this password?")) {
            try {
                await api.delete(`/api/secrets/${id}`);
                setSecrets(secrets.filter((item) => item._id !== id));
                toast.success('Password deleted!');
            } catch (error) {
                toast.error("Failed to delete password.");
                console.error("Delete password error:", error);
            }
        }
    };

    const handleEdit = (secret) => {
        setForm({ site: secret.site, username: secret.username, password: secret.password, _id: secret._id });
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to Clipboard!');
    };

    if (!masterKey) {
        return (
            <div className="text-center p-10">
                <h2 className="font-bold text-xl">Master Password Required</h2>
                <p>Please refresh the page and enter your master password to continue.</p>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-8">
                <h1 className='text-3xl sm:text-4xl font-bold text-center'>
                    <span className='text-purple-700'>&lt;</span>
                    Pass<span className='text-purple-700'>OP/&gt;</span>
                </h1>
                <p className='text-base sm:text-lg text-center text-black font-bold'>Your own Password Manager</p>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className='flex flex-col p-2 sm:p-4 gap-4 sm:gap-5'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='bg-white border border-purple-900 rounded-full px-3 py-1' type="text" name="site" />
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 w-full justify-between'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter username' name='username' className='bg-white border border-purple-900 rounded-full px-3 py-1 w-full' type="text" />
                        <div className='flex gap-2 w-full relative'>
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' name='password' className='bg-white border border-purple-900 rounded-full px-3 py-1 w-full' type="password" />
                            <span className='absolute right-[10px] top-[5px] cursor-pointer' onClick={showPassword}><img ref={eyeRef} width={20} src="/eyeclosed.svg" alt="eye" /></span>
                        </div>
                    </div>
                    <button type="submit" className='flex justify-center items-center gap-2 bg-purple-500 rounded-full px-6 py-2 w-fit border border-purple-900 cursor-pointer mx-auto shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 ease-in-out'>
                        <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        {form._id ? 'Update Password' : 'Save Password'}
                    </button>
                </form>

                {/* Passwords Table Section */}
                <div className="passwords overflow-x-auto">
                    <h2 className='font-bold text-xl sm:text-2xl py-4'>Your Passwords</h2>
                    {secrets.length === 0 && <div> No passwords to show</div>}
                    {secrets.length > 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10 text-xs sm:text-base">
                            <thead className='bg-purple-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-purple-100'>
                                {secrets.map((item) => (
                                    <tr key={item._id}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <a href={item.site} target='_blank' rel="noopener noreferrer">{item.site}</a>
                                                <div className='cursor-pointer' onClick={() => copyText(item.site)}>
                                                    <lord-icon style={{ "width": "20px", "height": "20px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <span>{item.username}</span>
                                                <div className='cursor-pointer' onClick={() => copyText(item.username)}>
                                                    <lord-icon style={{ "width": "20px", "height": "20px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className='cursor-pointer' onClick={() => copyText(item.password)}>
                                                    <lord-icon style={{ "width": "20px", "height": "20px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => handleEdit(item)}>
                                                <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ "width": "25px", "height": "25px" }} />
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => handleDelete(item._id)}>
                                                <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ "width": "25px", "height": "25px" }} />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    );
};

export default Manager;