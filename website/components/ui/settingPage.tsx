import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import ToggleComponent from '../toggle'
import LanguageSelect from '../languageSelect'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { IconButton, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation'
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SettingPage = () => {

    const router = useRouter();

    //get the user id 
    const [userID, setUserID] = useState<string | null>(null)
    useEffect(() => {
        const userId = localStorage.getItem('userID');
        setUserID(userId);
        console.log(userId)
    }, []);
    /// to set the info
    const [values, setValues] = useState({ firstname: '', lastname: '', email: '', phone_number: '', username: '', staff_pic: '', staff_pwd: '' })
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log("Input changed:", name, value); // Add this line for debugging
        setValues({ ...values, [name]: value });
    };

    /// paswsword settings
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }

    //// fetch the staff by id
    useEffect(() => {
        const fetchStaffByID = async () => {

            try {
                const response = await axios.get(`${backendURL}/staff/${userID}`);
                const { firstname, lastname, email, phone_number, username, staff_pic, staff_pwd } = response.data;
                setValues({ firstname, lastname, email, phone_number, username, staff_pic, staff_pwd });
            } catch (error) {
                console.error('Error fetching staff by ID:', error);
            }
        };
        fetchStaffByID();
    }, [userID]);
/// update  the account 
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let staff_id = userID
    try {
      const response = await axios.put(`${backendURL}/staff/${staff_id}`, {
        firstname: values.firstname,
        lastname: values.lastname, 
        username: values.username,
        staff_pwd: values.staff_pwd,
        email: values.email,
        phone_number: values.phone_number,
        
      });

      console.log('staff updated:', response.data);
    } catch (error) {
      console.error('Error updating staff:', error);

    }
  };

  // delete the account 
  const deleteUser = async () => {
  
    let staff_id = userID
    try {
      const response = await axios.delete(`${backendURL}/staff/${staff_id}`);
      console.log('staff deleted:', response.data);
      localStorage.clear();
      router.replace('/login')
    } catch (error) {
      console.error('Error deleting staff:', error);
      // Handle error, such as displaying an error message to the user
    }
  }
    return (
        <div className='bg-white p-3 h-4/5 w-full rounded-md border border-gray-15 shadow-xl'>
            <div className='flex flex-row '>
                <p className='text-2xl font-sans font-medium w-full'>My Account</p>
                <div className='flex w-44  bg-red-10 rounded-xl pt-2 pb-2 '>
                    <button className='flex flex-row gap-3 justify-center items-center'
                    onClick={deleteUser}>
                        <RiDeleteBin6Line className='text-red-90 m-1' />
                        <label className='text-red-90 text-sm'>Delete account</label>
                    </button>
                </div>
            </div>
            <div className='flex flex-row pl-14 pt-2 gap-8 w-full  items-center'>
                <img src='/person-3.png' className='w-14 rounded-full border-2' />
                <div className='justify-center flex rounded-lg bg-blue-90 w-32  pt-1 pb-1 text-white font-sans border border-gray-15 shadow-md'><button> Upload new</button></div>
                <div className='justify-center flex rounded-lg bg-white w-24  pt-1 pb-1 text-black font-sans border border-gray-15 shadow-md'><button>Delete</button></div>
            </div>
            <div className='lg:pl-10 pb-8 flex lg:flex-row flex-col  w-full gap-10  items-center '>
                <div className='flex flex-col lg:w-2/6 w-4/5 '>
                    <label className='mb-2 ml-1'>First name</label>
                    <TextField type='text' name='firstname' label='First name' size='small'
                        value={values.firstname}
                        onChange={handleInputChange}
                        className='  w-[99%]'
                    />
                    <label className='mb-2 ml-1'>Last name</label>
                    <TextField type='text' name='lastname' label='Last name' size='small'
                        value={values.lastname}
                        onChange={handleInputChange}
                        className='  w-[99%]'
                    />
                </div>
                <hr className='w-[80%]' />
                <div className='flex flex-col lg:w-2/6 w-4/5 '>
                    <label className='mb-2 ml-1'>Phone Number</label>
                    <TextField name='phone_number' label='Phone Number' size='small'
                        value={values.phone_number}
                        onChange={handleInputChange}
                        className='  w-[99%]'
                        inputProps={{
                            pattern: '^\\+213(7|5|6)[0-9]{8}$', // Regular expression pattern for Algerian phone number
                            title: 'Please enter a valid Algerian phone number (e.g., +213xxxxxxxxx)', // Error message
                        }}
                    />
                    <label className='mb-2 ml-1'>Email</label>
                    <TextField type='email' name='email' label='Email' size='small'
                        value={values.email}
                        onChange={handleInputChange}
                        className='  w-[99%]'
                    />
                    <label className='mb-2 ml-1'>Phone Number</label>
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        name='staff_pwd'
                        placeholder='password'
                        size='small'
                        className='  w-[99%]'
                        value={values.staff_pwd}
                        onChange={handleInputChange}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </IconButton>
                            ),
                        }}
                    />
                </div>
            </div>
            <div className='flex justify-center items-center'> <hr className=' flex justify-center pb-2 w-[95%] ' />  </div>
            <div className='flex flex-row w-ful pl-10 pr-10 justify-between items-center'>
                <p className='regular-24 '>Other</p>
                <div className='relative gap-4 flex flex-row pt-1.5'> <p className='regular-16'>Appearence</p><ToggleComponent /></div>
            </div>
            <div className='flex flex-col justify-start pl-10 '>
                <p className='regular-12 text-gray-99 pb-5'>Customizing according to your prefereces</p>
                <div className='flex flex-row  gap-4'><p className='regular-14 '>Email notification</p><ToggleComponent /></div>
                <div className='flex flex-row  gap-4 pt-2'><p className='regular-14 pr-3'>Language</p><LanguageSelect /></div>
                <div className='flex flex-row  gap-4 pt-2 justify-end pr-5'>
                    <div className='justify-center flex rounded-lg bg-white w-20 pt-1 pb-1   text-black text-sm font-sans border border-gray-15 shadow-md'><button>Cancel</button></div>
                    <div className='justify-center flex rounded-lg bg-gray-99 w-28 pt-1 pb-1 text-white text-sm font-sans border border-gray-15 shadow-md'><button onClick={handleSubmit}>Save changes</button></div>
                </div>
            </div>
        </div>
    )
}

export default SettingPage