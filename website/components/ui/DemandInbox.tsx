import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { LuInbox } from 'react-icons/lu';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Demands {
    prof_pic: string;
    fullname: string;
}

interface KidInfo {
    id: number;
    prof_pic: string;
    name: string;
    age: number;
    gender: string;
    guardian: string;
    category: string;
    syndromes: string;
    allergies: string;
}

const DemandInbox = () => {
    const [showInbox, setShowInbox] = useState(false);
    const [demands, setDemands] = useState<Demands[]>([]);
    const [kids, setKids] = useState<KidInfo[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedKid, setSelectedKid] = useState<KidInfo | null>(null);

    const fetchGuardianName = async (guardianId: number) => {
        try {
            const response = await axios.get(`${backendURL}/guardian/${guardianId}`);
            return response.data.firstname + ' ' + response.data.lastname;
        } catch (error) {
            console.error(`Error fetching guardian name for guardian ID ${guardianId}:`, error);
            return 'Unknown Guardian';
        }
    };

    const fetchCategoryName = async (categoryId: number) => {
        try {
            const response = await axios.get(`${backendURL}/category/${categoryId}`);
            return response.data.category_name;
        } catch (error) {
            console.error(`Error fetching category name for category ID ${categoryId}:`, error);
            return 'Unknown Category';
        }
    };

    const fetchKids = async () => {
        try {
            const response = await axios.get(`${backendURL}/kid`, { params: { Status: 'pending' } });
            const data = response.data;
            console.log(data);
            const formattedRows = await Promise.all(data.map(async (row: any) => {
                const guardianName = await fetchGuardianName(row.guardian_id);
                const categoryName = await fetchCategoryName(row.category_id);
                return {
                    id: row.kid_id,
                    prof_pic: row.prof_pic,
                    name: `${row.firstname} ${row.lastname}`,
                    age: row.age,
                    gender: row.gender,
                    guardian: guardianName,
                    category: categoryName,
                    syndromes: row.syndromes,
                    allergies: row.allergies
                };
            }));
            setKids(formattedRows);
            const minimalDemands = data.map((row: any) => ({
                prof_pic: row.prof_pic,
                fullname: `${row.firstname} ${row.lastname}`
            }));
            setDemands(minimalDemands);
        } catch (error) {
            console.error('Error fetching kid profiles:', error);
        }
    };

    const toggleInbox = () => {
        if (!showInbox) {
            fetchKids();
        }
        setShowInbox(!showInbox);
    };

    const handleKidClick = (kid: KidInfo) => {
        setSelectedKid(kid);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedKid(null);
    };

    const handleApproval = async () => {
        try {
            if (selectedKid) {
                const response = await axios.put(`${backendURL}/kid/approve/${selectedKid.id}`);
                if (response.status === 200) {
                    // Handle successful approval
                    console.log('Kid approved');
                    alert("Approved successfully");
                    handleCloseDialog();
                } else {
                    // Handle approval failure
                    console.error('Failed to approve kid');
                }
            }
        } catch (error) {
            console.error('Error approving kid:', error);
        }
    };

    const handleRejection = async () => {
        try {
            if (selectedKid) {
                const response = await axios.delete(`${backendURL}/kid/reject/${selectedKid.id}`);
                if (response.status === 200) {
                    console.log('Kid rejected');
                    alert("Rejected successfully");
                    handleCloseDialog();
                } else {
                    // Handle rejection failure
                    console.error('Failed to reject kid');
                }
            }
        } catch (error) {
            console.error('Error rejecting kid:', error);
        }
    };

    return (
        <div className='flex items-center ml-10'>
            <Button className='rounded-full' onClick={toggleInbox}>
                <LuInbox className='text-white size-6'/>
            </Button>
            {showInbox && (
                <div className="absolute z-50 top-10 w-auto cursor-pointer right-36 p-4 bg-white shadow-md rounded-md">
                    <p className='text-black'>You received new kids demands</p>
                    {demands.map((demand: Demands, index: number) => (
                        <div key={index} className='p-2 m-1 rounded-md shadow-md w-full flex gap-[5%] items-center'
                            onClick={() => handleKidClick(kids[index])}>
                            <img src='/girl.jpg' width={24} height={24} className='rounded-full' alt="Kid profile" />
                            <h3 className='text-black'>{demand.fullname}</h3>
                        </div>
                    ))}
                </div>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                {selectedKid && (
                    <>
                        <DialogTitle>{selectedKid.name}</DialogTitle>
                        <DialogContent>
                            <img src='/girl.jpg' alt={`${selectedKid.name}'s profile`} className="rounded-full" width={50} height={20} />
                            <p>Age: {selectedKid.age}</p>
                            <p>Gender: {selectedKid.gender}</p>
                            <p>Guardian: {selectedKid.guardian}</p>
                            <p>Category: {selectedKid.category}</p>
                            <p>Syndromes: {selectedKid.syndromes}</p>
                            <p>Allergies: {selectedKid.allergies}</p>
                        </DialogContent>
                        <DialogActions className='flex items-center'>
                            <button className='mr-20 text-blue-600' onClick={handleCloseDialog}>Close</button>
                            <button className='text-red-700 mr-2' onClick={handleRejection}>Reject</button>
                            <button className='text-green-700' onClick={handleApproval}>Approve</button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default DemandInbox;
