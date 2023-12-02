import React from 'react'
import { TitleProps } from '@refinedev/core'
import { Button } from '@mui/material'
import { logo, yariga } from '@/assets'
import { Link } from 'react-router-dom'

export const Title: React.FC<TitleProps> = ({ collapsed }) => {

  return (
    <Button fullWidth variant='text' disableRipple>
      <Link to='/'>
        {collapsed ? (
          <img src={logo} alt='Yariga' width='28px' />
        ) : (
          <img src={yariga} alt='Refine' width='140px' />
        )}
      </Link>
    </Button>
  )
}
