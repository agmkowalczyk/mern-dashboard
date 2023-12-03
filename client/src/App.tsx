import { AuthBindings, Authenticated, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from '@refinedev/mui'

import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6'
import dataProvider from '@refinedev/simple-rest'
import axios, { AxiosRequestConfig } from 'axios'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { ColorModeContextProvider } from './contexts/color-mode'
import { CredentialResponse } from './interfaces/google'
import { parseJwt } from './utils/parse-jwt'
import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  Dashboard,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from '@mui/icons-material'
import { Header, Sider, Title } from './components'
import {
  Login,
  Home,
  Agents,
  AgentProfilePage,
  MyProfile,
  AllProperties,
  PropertyDetails,
  CreateProperty,
  EditProperty,
} from './pages'

const axiosInstance = axios.create()
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (request.headers) {
    request.headers['Authorization'] = `Bearer ${token}`
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  return request
})

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const SERVER_API = import.meta.env.VITE_SERVER_API

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null

      if (profileObj) {
        const response = await fetch(`${SERVER_URL}${SERVER_API}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          }),
        })

        const data = await response.json()

        if (response.status === 200) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            })
          )
        } else {
          return Promise.reject()
        }

        localStorage.setItem('token', `${credential}`)

        return {
          success: true,
          redirectTo: '/',
        }
      }

      return {
        success: false,
      }
    },
    logout: async () => {
      const token = localStorage.getItem('token')

      if (token && typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        axios.defaults.headers.common = {}
        window.google?.accounts.id.revoke(token, () => {
          return {}
        })
      }

      return {
        success: true,
        redirectTo: '/login',
      }
    },
    onError: async (error) => {
      console.error(error)
      return { error }
    },
    check: async () => {
      const token = localStorage.getItem('token')

      if (token) {
        return {
          authenticated: true,
        }
      }

      return {
        authenticated: false,
        error: {
          message: 'Check failed',
          name: 'Token not found',
        },
        logout: true,
        redirectTo: '/login',
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem('user')
      if (user) {
        return JSON.parse(user)
      }

      return null
    },
  }

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider(`${SERVER_URL}${SERVER_API}`)}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: {
                    label: 'Dashboard',
                    icon: <Dashboard />,
                  },
                },
                {
                  name: 'properties',
                  list: 'properties',
                  create: 'properties/create',
                  edit: 'properties/edit/:id',
                  show: 'properties/show/:id',
                  meta: { icon: <VillaOutlined /> },
                },
                {
                  name: 'agent',
                  list: 'agents',
                  show: 'agents/show/:id',
                  meta: { icon: <PeopleAltOutlined /> },
                },
                {
                  name: 'review',
                  list: 'reviews',
                  meta: { icon: <StarOutlineRounded /> },
                },
                {
                  name: 'message',
                  list: 'messages',
                  meta: { icon: <ChatBubbleOutline /> },
                },
                {
                  name: 'my-profile',
                  meta: {
                    label: 'My Profile',
                    icon: <AccountCircleOutlined />,
                  },
                  list: 'my-profile',
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: 'NFCF6h-eaiEFJ-kAj4Nn',
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key='authenticated-inner'
                      fallback={<CatchAllNavigate to='/login' />}
                    >
                      <ThemedLayoutV2
                        Sider={Sider}
                        Title={Title}
                        Header={Header}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path='/properties'>
                    <Route index element={<AllProperties />} />
                    <Route path='create' element={<CreateProperty />} />
                    <Route path='edit/:id' element={<EditProperty />} />
                    <Route path='show/:id' element={<PropertyDetails />} />
                  </Route>
                  <Route path='/agents'>
                    <Route index element={<Agents />} />
                    <Route path='show/:id' element={<AgentProfilePage />} />
                  </Route>
                  <Route path='/reviews'>
                    <Route index element={<Home />} />
                  </Route>
                  <Route path='/messages'>
                    <Route index element={<Home />} />
                  </Route>
                  <Route path='/my-profile'>
                    <Route index element={<MyProfile />} />
                  </Route>
                  <Route path='*' element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key='authenticated-outer'
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path='/login' element={<Login />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App
