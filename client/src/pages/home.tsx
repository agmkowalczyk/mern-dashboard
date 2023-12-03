import { useList } from '@refinedev/core'
import { Box, Stack, Typography } from '@mui/material'

import {
  PieChart,
  PropertyReferrals,
  TotalRevenue,
  PropertyCard,
  TopAgent,
} from '../components'
import { pieChartData } from '../constants'

const home = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700}>
        Dashboard
      </Typography>

      <Box mt='20px' display='flex' flexWrap='wrap' gap={4}>
        {pieChartData.map((chartData) => (
          <PieChart key={chartData.title} {...chartData} />
        ))}
      </Box>

      <Stack
        mt='25px'
        width='100%'
        direction={{ xs: 'column', lg: 'row' }}
        gap={4}
      >
        <TotalRevenue />
        <PropertyReferrals />
      </Stack>
    </Box>
  )
}

export default home
