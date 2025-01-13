import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function ChartGrafic() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15,16,17,18,19,20] }]}
      series={[
        {
          data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8, 4, 6, 1, 6, 8, 2, 7],
          showMark: ({ index }) => index % 2 === 0,
        },
      ]}
      width={1000}
      height={250}
    />
  );
}
