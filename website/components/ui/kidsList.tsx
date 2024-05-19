import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Props {
    open: boolean;
    onClose: () => void;
    eventId: number | null;
}

interface Kid {
    kid_id: number;
    firstname: string;
    lastname: string;
}

const KidsListDialog: React.FC<Props> = ({ open, onClose, eventId }) => {
    const [kids, setKids] = useState<Kid[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (open && eventId !== null) {
            fetchKids(eventId);
        }
    }, [open, eventId]);

    const fetchKids = async (eventId: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/eventlist/${eventId}/acceptance`);
            setKids(response.data);
        } catch (error) {
            console.error('Error fetching kids:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="kids-list-dialog-title">
            <DialogTitle id="kids-list-dialog-title">Kids List</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <ul>
                        {kids.map((kid) => (
                            <li key={kid.kid_id}>{kid.firstname}{kid.lastname}</li>
                        ))}
                    </ul>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} className="bg-slate-100 text-blue-600 border border-blue-600">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default KidsListDialog;
