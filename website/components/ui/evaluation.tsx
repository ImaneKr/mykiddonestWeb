import React, { useState } from 'react'
import { Slider } from '@mui/material'
type EvaluationProps = {
    id: number;
};
const Evaluation: React.FC<EvaluationProps> = ({ id }) => {
    const colors: string[] = ['text-orange-400', 'text-blue-400', 'text-green-90'];
    const [mark, setMark] = useState({ letters: 0, numbers: 0, art: 0, communication: 0, physicalSkills: 0 })

    const handleSliderChange = (name: string) => (event: Event, value: number | number[]) => {
        setMark((prevMarks) => ({
            ...prevMarks,
            [name]: value as number
        }));
    };

    return (
        <div>
            <div className='flex justify-between mb-3 mx-4'>
                <p className='regular-16 flex w-1/2 from-neutral-950'> Arabic Letters </p>
                <Slider name='letters'  onChange={handleSliderChange('letters')}
                 className={colors[1]} value={mark.letters} step={10} min={0} max={100} />
            </div>
            <div className='flex justify-between mb-3 mx-4'>
                <p className='regular-16 flex w-1/2 from-neutral-950'> Numbers </p>
                <Slider name='numbers'   onChange={handleSliderChange('numbers')}
                 className={colors[2]} defaultValue={30} step={10} min={0} max={100} />
            </div>
            <div className='flex justify-between mb-3 mx-4'>
                <p className='regular-16 flex w-1/2 from-neutral-950'> Art  and Crafts </p>
                <Slider name='art'   onChange={handleSliderChange('art')} 
                className={colors[3]} defaultValue={30} step={10} min={0} max={100} />
            </div>
            <div className='flex justify-between mb-3 mx-4'>
                <p className='regular-16 flex w-1/2 from-neutral-950'> Communiaction </p>
                <Slider name='comunication' onChange={handleSliderChange('communication')}
                 className={colors[1]} defaultValue={30} step={10} min={0} max={100} />
            </div>
            <div className='flex justify-between mb-3 mx-4'>
                <p className='regular-16 flex w-1/2 from-neutral-950'> Physical skils </p>
                <Slider name='physicalSkills'  onChange={handleSliderChange('physicalSkills')}
                className={colors[2]} defaultValue={30} step={10} min={0} max={100} />
            </div>

        </div>
    )
}

export default Evaluation