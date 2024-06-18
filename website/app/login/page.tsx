'use client';
import Image from 'next/image'
import React, { useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { HiOutlineLockClosed } from 'react-icons/hi'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const Page = () => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL; // Provide a default value if NEXT_PUBLIC_BACKEND_URL is undefined
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendURL}/auth/staff`, {
                username: username,
                staff_pwd: password
            });
            console.log(response.data.token)
            const Role = response.data.staff.role
            console.log(response.data.staff.staff_id)

            // Retrieve the user's role from localStorage
            localStorage.setItem('userRole', response.data.staff.role);
            localStorage.setItem('userID', response.data.staff.staff_id);
            localStorage.setItem('Token',response.data.token)
            // If login is successful, redirect to dashboard
            if (response.data.token) {
                console.log("Login successful")
                if (Role === 'admin' || Role === 'secretary') {
                    router.push('/dashboard/home');
                } else {
                    router.push('/dashboard/children');
                }
            } else {
                // Handle login error
                setLoginError('Username or password incorrect');
            }
        } catch (error) {
            // Handle login error
            console.error(error);
            setLoginError('Error logging in');
        }
    };
    return (
        <div className='bg-gray-10  p-[10%] lg:p-[25%] lg:pt-32 h-screen items-center overflow-y-scroll'>
            <div className='border-2 relative lg:w-[90%] h-96  bg-white flex flex-1 flex-row rounded-xl '>
                <div className=' hidden lg:flex w-2/5 rounded-lg'>
                    <Image src='/login.jpg' alt='school pic' width={380} height={500} className='rounded-l-lg' />
                </div>
                <div className='flex  flexCenter  flex-col flex-1  lg:w-3/5'>
                    <p className='w-full font-mono regular-24  flexCenter pb-6'>
                        Log in to continue
                    </p>
                    <form className='flex flex-col items-center justify-center gap-4 relative' onSubmit={handleLogin}>
                        <input
                            name='username'
                            type='text'
                            placeholder='Enter Your Username'
                            onChange={(e) => setUsername(e.target.value)}
                            className='border-2 p-3 pl-8 rounded-2xl group focus:outline-none focus:border-orange-300'
                        />
                        <BsPerson className='absolute  left-1 top-1 translate-x-1.5 translate-y-3 w-auto h-auto' style={{ color: '#BBBBBB' }} />
                        <input
                            name='password'
                            type='password'
                            placeholder='Enter Your Password'
                            onChange={(e) => setPassword(e.target.value)}
                            className='border-2 p-3 pl-8 rounded-2xl group focus:outline-none focus:border-orange-300'
                        />
                        <HiOutlineLockClosed className='absolute left-1  translate-x-1.5 bottom-36 w-auto h-auto' style={{ color: '#BBBBBB' }} />
                        {loginError && <p className="text-red-500">{loginError}</p>}
                        <div className='flex flex-row justify-end w-full lg:pr-10 pb-5 pr-24'>
                            <Button className='bg-white group focus:bg-white text-black regular-12 normal-case'>Forget password?</Button>
                        </div>
                        <Button
                            type='submit'
                            className='text-white regular-16 normal-case rounded-2xl bg-orange-70 px-6 group focus:bg-orange-70 hover:bg-orange-70'
                        >
                            Log in
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Page;
