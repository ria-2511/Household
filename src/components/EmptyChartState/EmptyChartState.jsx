import './EmptyChartState.scss';


const EmptyChartState = ({ size = 192 }) => (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
           <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 text-xs font-bold">No Data</div>
    </div>
);

export default EmptyChartState;
