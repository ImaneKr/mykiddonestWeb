import { Button, Dialog, DialogActions, DialogContent, IconButton, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import Image from 'next/image';
import { TbTrash } from 'react-icons/tb';
import ImagePicker from './imagePicker';
import { profile } from 'console';
import axios from 'axios';
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define the type for row
interface Row {
  id: number;
  profile: string;
  guardian: string;
  kid: string;
  amount:any;
  rdate: string;
  status: 'Paid'|'Unpaid'; 
}

// Define the props for EditUserActionItem
interface EditUserActionItemProps {
  row: Row;
  deleteUser: () => void;
}

// EditUserActionItem component

const PaymentList = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB');
  
  const [rows, setRows] = React.useState<Row[]>([]);

  const deleteUser = React.useCallback(
    (id: number) => () => {
      setTimeout(() => {
        setRows(prevRows => prevRows.filter(row => row.id !== id));
      });
    },
    [],
  );

  const columns = React.useMemo<GridColDef<Row>[]>(
        () =>[
    {
      field:'profile',
      headerName:'',
      headerClassName:' hidden justify-center bold-20',
      width: 60,
      filterable:false,
      sortable:false,
      renderCell:(params: GridCellParams) => (
        <Image src={params.row.profile as string} alt="Profile" width={45} height={45} className='rounded-full' />
      ),
    },
    {
        field:'guardian',
        headerName:'Guardian' ,
        headerClassName:' justify-center bold-20 ',
        width:180,
    },
    {
        field:'kid',
        headerName:'Kid' ,
        headerClassName:' justify-center bold-20 ',
        width:170,
    },
    {
        field:'amount',
        headerName:'Amount',
        
        headerClassName:' justify-center bold-20 ',
        width:160,
    },
{
        field:'rdate',
        headerName:'Regestrated Date',
        headerClassName:' justify-center bold-20 ',
        width:190
    },
    {
        field:'status',
        type:'singleSelect',
        valueOptions:['Paid','Unpaid'],
        headerName:'Status',
        headerClassName:' justify-center bold-20',
        width:130
    },
    
    
],
 [],
)

  return (
    <div className='w-[98%]'>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default PaymentList