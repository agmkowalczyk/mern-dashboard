import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List as MuiList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Button,
  IconButton,
} from '@mui/material'
import { Sider as DefaultSider } from '@refinedev/mui'
import {
  ListOutlined,
  Logout,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  MenuRounded,
} from '@mui/icons-material'
import {
  CanAccess,
  ITreeMenu,
  useIsExistAuthentication,
  useLogout,
  useTitle,
  useTranslate,
  useRouterContext,
  useMenu,
} from '@refinedev/core'

import { Title as DefaultTitle } from '../title'

export const Sider: typeof DefaultSider = ({ render }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [opened, setOpened] = useState(false)

  const drawerWidth = () => {
    if (collapsed) return 64
    return 200
  }

  const t = useTranslate()
  const { Link } = useRouterContext()
  const translate = useTranslate()

  const { menuItems, selectedKey, defaultOpenKeys } = useMenu()
  const isExistAuthentication = useIsExistAuthentication()
  const { mutate: mutateLogout } = useLogout()
  const Title = useTitle()

  const [open, setOpen] = useState<{ [k: string]: any }>({})

  React.useEffect(() => {
    setOpen((previousOpen) => {
      const previousOpenKeys: string[] = Object.keys(previousOpen)
      const uniqueKeys = new Set([...previousOpenKeys, ...defaultOpenKeys])
      const uniqueKeysRecord = Object.fromEntries(
        Array.from(uniqueKeys.values()).map((key) => [key, true])
      )
      return uniqueKeysRecord
    })
  }, [defaultOpenKeys])

  const RenderToTitle = Title ?? DefaultTitle

  const handleClick = (key: string) => {
    setOpen({ ...open, [key]: !open[key] })
  }

  const renderTreeView = (tree: ITreeMenu[], selectedKey: string) => {
    return tree.map((item: ITreeMenu) => {
      const { icon, label, route, name, children, parentName } = item
      const isOpen = open[route || ''] || false

      const isSelected = route === selectedKey
      const isNested = !(parentName === undefined)

      if (children.length > 0) {
        return (
          <CanAccess
            key={route}
            resource={name.toLowerCase()}
            action='list'
            params={{
              resource: item,
            }}
          >
            <div key={route}>
              <Tooltip
                title={label ?? name}
                placement='right'
                disableHoverListener={!collapsed}
                arrow
              >
                <ListItemButton
                  component={Link}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false)
                      if (!isOpen) {
                        handleClick(route || '')
                      }
                    } else {
                      handleClick(route || '')
                    }
                  }}
                  sx={{
                    pl: isNested ? 4 : 2,
                    justifyContent: 'center',
                    '&.Mui-selected': {
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      justifyContent: 'center',
                      minWidth: 36,
                      color: 'primary.contrastText',
                    }}
                  >
                    {icon ?? <ListOutlined />}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: '16px',
                      fontWeight: isSelected ? 'bold' : 'normal',
                    }}
                  />
                  {!collapsed && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </Tooltip>
              {!collapsed && (
                <Collapse in={open[route || '']} timeout='auto' unmountOnExit>
                  <MuiList component='div' disablePadding>
                    {renderTreeView(children, selectedKey)}
                  </MuiList>
                </Collapse>
              )}
            </div>
          </CanAccess>
        )
      }

      return (
        <CanAccess
          key={route}
          resource={name.toLowerCase()}
          action='list'
          params={{ resource: item }}
        >
          <Tooltip
            title={label ?? name}
            placement='right'
            disableHoverListener={!collapsed}
            arrow
          >
            <ListItemButton
              component='a'
              href={route}
              selected={isSelected}
              onClick={() => {
                setOpened(false)
              }}
              sx={{
                pl: isNested ? 4 : 2,
                py: isNested ? 1.25 : 1,
                '&.Mui-selected': {
                  '&:hover': {
                    backgroundColor: isSelected ? '#1e36e8' : 'transparent',
                  },
                  backgroundColor: isSelected ? '#475be8' : 'transparent',
                },
                margin: '10px auto',
                borderRadius: '12px',
                minHeight: '56px',
                width: '90%',
                justifyContent: 'center',
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: 'center',
                  minWidth: 36,
                  color: isSelected ? '#fff' : '#808191',
                }}
              >
                {icon ?? <ListOutlined />}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: '16px',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  color: isSelected ? '#fff' : 'unset',
                  marginLeft: '10px',
                }}
              />
            </ListItemButton>
          </Tooltip>
        </CanAccess>
      )
    })
  }

  const logout = isExistAuthentication && (
    <Tooltip
      title={t('buttons.logout', 'Logout')}
      placement='right'
      disableHoverListener={!collapsed}
      arrow
    >
      <ListItemButton
        key='logout'
        onClick={() => mutateLogout()}
        sx={{
          justifyContent: 'center',
          margin: '10px auto',
          borderRadius: '12px',
          minHeight: '56px',
          width: '90%',
        }}
      >
        <ListItemIcon
          sx={{
            justifyContent: 'center',
            minWidth: 36,
            color: '#808191',
          }}
        >
          <Logout />
        </ListItemIcon>
        <ListItemText
          primary={t('buttons.logout', 'Logout')}
          primaryTypographyProps={{
            noWrap: true,
            fontSize: '16px',
          }}
        />
      </ListItemButton>
    </Tooltip>
  )

  const items = renderTreeView(menuItems, selectedKey)
  const dashboard = null

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        logout,
        items,
        collapsed,
      })
    }
    return (
      <>
        {dashboard}
        {items}
        {logout}
      </>
    )
  }

  const drawer = (
    <MuiList disablePadding sx={{ mt: 1 }}>
      {renderSider()}
    </MuiList>
  )

  return (
    <>
      <Box
        sx={{
          width: { xs: drawerWidth() },
          display: {
            xs: 'none',
            md: 'block',
          },
          transition: 'width 0.3s ease',
        }}
      />
      <Box
        component='nav'
        sx={{
          position: 'fixed',
          zIndex: 1101,
          width: { sm: drawerWidth() },
          display: 'flex',
        }}
      >
        <Drawer
          variant='temporary'
          open={opened}
          onClose={() => setOpened(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 256,
            },
          }}
        >
          <Box
            sx={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RenderToTitle collapsed={false} />
          </Box>
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          PaperProps={{ elevation: 0 }}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              overflow: 'hidden',
              transition: 'width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            },
          }}
          open
        >
          <Box
            sx={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RenderToTitle collapsed={collapsed} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            {drawer}
          </Box>
          <Button
            sx={{
              background: '#475BE8',
              color: 'primary.contrastText',
              textAlign: 'center',
              borderRadius: 0,
              borderTop: '1px solid #ffffff1a',
              '&:hover': {
                background: '#1e36e8',
              },
            }}
            fullWidth
            size='large'
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </Drawer>
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            top: '64px',
            left: '0px',
            borderRadius: '0 6px 6px 0',
            bgcolor: '#475be8',
            zIndex: 1199,
            width: '36px',
          }}
        >
          <IconButton
            sx={{ color: '#fff', width: '36px' }}
            onClick={() => setOpened((prev) => !prev)}
          >
            <MenuRounded />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}
