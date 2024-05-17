import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup, TextField, colors } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ImagePicker from './imagePicker';
import { profile } from 'console';
import StaffField from '../staffField';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define the type for row
interface Row {
  id: number;
  staff_pic: string;
  name: string;
  phone_number: string;
  role: 'sacretary' | 'teacher';
  email: string;
  username: string;
  staff_pwd: string;
  registration_date: string;
  salary: any;
  firstname: string;
  lastname: string;

}

// Define the props for EditUserActionItem
interface EditUserActionItemProps {
  row: Row;
  deleteUser: () => void;
}

// EditUserActionItem component
const EditUserActionItem: React.FC<EditUserActionItemProps> = ({ row, deleteUser }) => {
  const [open, setOpen] = React.useState(false);

  const handleEdit = () => {
    setOpen(true);
    // You can also pass 'row' to your dialog form here.
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [selectedImagePath, setSelectedImagePath] = useState<string>('');

  // fetching the staff 
  const [fetchedStaff, setFetchedStaff] = React.useState<Row | null>(null);

  useEffect(() => {
    const fetchStaffByID = async () => {
      let staff_id = row.id
      try {
        const response = await axios.get(`${backendURL}/staff/${staff_id}`);
        setFetchedStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff by ID:', error);
      }
    };

    if (open) {
      fetchStaffByID();
    }
  }, [open, row.id]);

  const [formValues, setFormValues] = useState({
    firstname: '', lastname: '', role: '', email: '', phone_number: '', username: '', staff_pic: '', staff_pwd: '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Add this line for debugging
    setFormValues({ ...formValues, [name]: value });
  };


  //edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let staff_id = row.id
    try {
      const response = await axios.put(`${backendURL}/staff/${staff_id}`, {
        firstname: formValues.firstname.split(' ')[0], // Split name into first and last name
        lastname: formValues.firstname.split(' ')[1], // Split name into first and last name
        role: formValues.role,
        username: formValues.username,
        staff_pwd: formValues.staff_pwd,
        email: formValues.email,
        phone_number: formValues.phone_number,
        acc_pic: selectedImagePath,
      });
      console.log('staff updated:', response.data);
      // You can add additional logic here, such as updating the UI or showing a success message
    } catch (error) {
      console.error('Error updating staff:', error);
      // Handle error, such as displaying an error message to the user
    }
    setOpen(false);

  };
  useEffect(() => {
    if (fetchedStaff) {
      setFormValues({
        firstname: fetchedStaff.firstname,
        lastname: fetchedStaff.lastname,
        role: fetchedStaff.role,
        email: fetchedStaff.email,
        phone_number: fetchedStaff.phone_number,
        username: fetchedStaff.username,
        staff_pic: fetchedStaff.staff_pic,
        staff_pwd: fetchedStaff.staff_pwd,
      });
    }
  }, [fetchedStaff]);

  const [isChangingAllowed, setIsChangingAllowed] = useState(false);
  const allowChanges = () => {
    setIsChangingAllowed(!isChangingAllowed);
  };

  let name = `${formValues.firstname} ${formValues.lastname}`

  return (
    <>
      <Button onClick={handleEdit}>
        <FiEdit3 className=' text-gray-30 size-6' />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='sm'
        fullWidth={true}
      >
        <DialogContent >
          <div className='flex flex-row justify-between items-center lg:pr-10 lg:pl-5 pr-3'>
            <div className='flex h-30 w-30'> <ImagePicker onImageSelected={setSelectedImagePath} disabled={false} isProfilePic={true} profilePic={formValues.staff_pic} /></div>
            <div className='flex flex-row justify-start lg:gap-10 gap-4 lg:pr-28 items-center'> <p className='text-3xl font-semibold font-sans'>{name}</p>
            </div>
          </div>
          <hr className='m-2.5' />
          <div className='block justify-center items-center  mb-4 px-8'>
            <TextField type='text' className='  w-[99%]' name='firstname' size='small' label='Full Name' value={formValues.firstname} onChange={handleInputChange} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>
            <TextField type='text' className='  w-[99%]' name='phone_number' size='small' label='Phone number' value={formValues.phone_number} onChange={handleInputChange} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>
            <TextField type='text' className='  w-[99%]' name='email' size='small' label='Email' value={formValues.email} onChange={handleInputChange} />
          </div>
          <div className='flex   justify-between items-center gap-20 mb-4 px-8'>
            <label className='regular-14 pl-2  pb-1'>Role</label>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={formValues.role}
              name="role">
              <FormControlLabel value="secretary" control={<Radio />} label="Sacretary" />
              <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />

            </RadioGroup>
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>
            <TextField type='text' className='  w-[99%]' name='username' size='small' label='Username' value={formValues.username} onChange={handleInputChange} />
          </div>
          <div className='block justify-center items-center  mb-4 px-8'>
            <TextField type='text' className='  w-[99%]' name='staff_pwd' size='small' label='Passsword' value={formValues.staff_pwd} onChange={handleInputChange} />
          </div>
        </DialogContent>
        <DialogActions  >
          <Button className='flex flex-row gap-2 justify-center items-center bg-red-10' onClick={() => {
            setOpen(false);
            deleteUser();
          }} >
            <RiDeleteBin6Line className='text-red-90 m-1' />
            <label className='text-red-90 text-sm'>Delete</label>
          </Button>
          <div className='flex flex-row gap-3'>
            <Button onClick={() => setOpen(false)} className='bg-slate-100 text-blue-600 border border-blue-600'>Cancel</Button>
            <Button onClick={handleSubmit} className='bg-blue-700 text-white px-2  regular-12 mr-7' > Save changes </Button></div>
        </DialogActions>
      </Dialog>
    </>
  );
};

const StaffList = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');



  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${backendURL}/staff`);
        // Map fetched data to include id property
        const updatedRows = response.data.map((row: any) => ({
          id: row.staff_id,
          acc_pic: row.staff_pic,
          name: `${row.firstname} ${row.lastname}`, // Combine firstname and lastname as name
          phone: row.phone_number,
          rdate: new Date(row.registration_date).toLocaleDateString(),
          role: row.role,
          salary: row.salary
        }));
        setRows(updatedRows);
      } catch (error) {
        console.error('Error fetching staffs:', error);
      }
    };


    fetchStaff();
  }, []);
  const [rows, setRows] = React.useState<Row[]>([]);

  const deleteUser = async (id: number) => {

    try {
      const response = await axios.delete(`${backendURL}/staff/${id}`);
      console.log('staff deleted:', response.data);
      // Remove the deleted row from the state
      setRows(prevRows => prevRows.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
      // Handle error, such as displaying an error message to the user
    }
  }

  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'profile',
        headerName: '',
        headerClassName: ' hidden justify-center bold-20',
        width: 60,
        filterable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => (
          <Image src={params.row.profile as string} alt="Profile" width={45} height={45} className='rounded-full' />
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        headerClassName: ' justify-center bold-20 ',

        flex: 1,
      },
      {
        field: 'phone',
        headerName: 'Phone',

        headerClassName: ' justify-center bold-20 ',

        flex: 1,

      },
      {
        field: 'role',
        type: 'singleSelect',
        valueOptions: ['sacretary', 'teacher'],
        headerName: 'Role',
        headerClassName: ' justify-center bold-20',

        flex: 1,

      },
      {
        field: 'salary',
        headerName: 'salary',
        headerClassName: ' justify-center bold-20 ',

        flex: 1,

      }, {
        field: 'rdate',
        headerName: 'Regestrated Date',
        headerClassName: ' justify-center bold-20 ',
        flex: 1,
      },
      {
        field: 'Action',
        type: 'actions',
        headerClassName: '',
        getActions: (params: GridCellParams<Row>) => [
          <EditUserActionItem key={1} row={params.row} deleteUser={() => deleteUser(Number(params.id))} />,
        ]
      }
    ],
    [deleteUser],
  )

  return (
    <div className='w-[98%]'>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default StaffList