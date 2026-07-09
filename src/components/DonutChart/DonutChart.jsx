import { getCoordinatesForPercent } from '../../helpers';
import './DonutChart.scss';

const DonutChart = ({ data, size = 192, innerLabel = "Top Spend" }) => {
  const cx = 50;
  const cy = 50;
  const radius = 40; 
  
  let currentAngle = 0; 

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {data.map((slice, i) => {
          const pct = Math.max(0, Number(slice.percentage) || 0); 
          if (pct <= 0) return null;
          
          const pctDecimal = pct / 100;
          
          if (pctDecimal >= 0.999) {
             return <circle key={i} cx={cx} cy={cy} r={radius} fill="transparent" stroke={slice.color} strokeWidth="12" />;
          }

          const [startX, startY] = getCoordinatesForPercent(currentAngle, cx, cy, radius);
          currentAngle += pctDecimal;
          const [endX, endY] = getCoordinatesForPercent(currentAngle, cx, cy, radius);

          const largeArcFlag = pctDecimal > 0.5 ? 1 : 0;
          const pathData = [
            `M ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
          ].join(' ');

          return (
            <path
              key={i}
              d={pathData}
              fill="transparent"
              stroke={slice.color}
              strokeWidth="12"
              strokeLinecap="butt"
              className="transition-all duration-500 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-bold text-gray-400">{innerLabel}</span>
        {innerLabel === "Top Spend" && <span className="text-2xl mt-1">{data[0]?.icon}</span>}
      </div>
    </div>
  );
};

export default DonutChart;
