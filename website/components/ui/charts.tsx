
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';

const settings = {
    width: 170,
    height: 170,
    value: 60,
};

export default function Charts() {
    return (
        <div className='flex justify-between'>
            <div className=' ml-8 p-5 border rounded-md' >
                <h3 className='bold-18'>Payment Statistics</h3>
                <p>2024</p>
                <Gauge
                    {...settings}
                    cornerRadius="0%"
                    sx={(theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 30,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#379AE6',
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: '#FEC601',
                        },
                    })}
                />
                <div className='flex justify-between'>
                    <div className='w-3 h-3 rounded-full bg-blue-90 mt-1' />
                    <p className='text-sm'>{settings.value}% have paid the fees </p>
                </div>
                <div className='flex gap-1'>
                    <div className='w-3 h-3 rounded-full bg-yellow-50 mt-1' />
                    <p className='text-sm'>40% has yet to pay </p>
                </div>
            </div>
            <div>
                <LineChart
                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                    series={[
                        {
                            data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
                            showMark: ({ index }) => index % 2 === 0,
                        },
                    ]}
                    width={500}
                    height={300}
                    sx={(theme) => ({
                        '& .MuiLineElement-root': {
                            strokeDasharray: '10 5',
                            strokeWidth: 4,
                        },
                        '& .MuiAreaElement-series-Germany': {
                            fill: "#",
                        },
                    })}
                />
            </div>
        </div>

    );
}