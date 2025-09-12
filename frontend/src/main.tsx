import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import './styles.css'
import { Box } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import reportWebVitals from './reportWebVitals.ts'
import App from './pages/index.tsx'
import Calendar from './pages/calendar/index.tsx'
import { Provider } from './components/ui/provider.tsx'
import { Layout } from './components/layout/layout.tsx'
import Habits from './pages/habits/index.tsx'
import Notes from './pages/notes/index.tsx'
import Login from './pages/login/index.tsx'
import SignUp from './pages/sign-up/index.tsx'
import { NonAuthenticated } from './components/layout/non-authenticated.tsx'
import ForgotPassword from './pages/forgot-password/index.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import Demo from './pages/demo/index.tsx'
// import { Categories } from './components/habits/categories.tsx'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: () => (
    <Layout>
      <Box padding={4} className="full-width">
        <Outlet />
      </Box>
    </Layout>
  ),
})
const nonAuthenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'non-authenticated',
  component: () => (
    <NonAuthenticated>
      <Box
        padding={4}
        className="full-width"
        height="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Outlet />
      </Box>
    </NonAuthenticated>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: App,
})
const calendarRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/calendar',
  component: Calendar,
})
const habitsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/habits',
  component: Habits,
})
const notesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/notes',
  component: Notes,
})
const loginRoute = createRoute({
  getParentRoute: () => nonAuthenticatedRoute,
  path: '/sign-in',
  component: Login,
})
const signUpRoute = createRoute({
  getParentRoute: () => nonAuthenticatedRoute,
  path: '/sign-up',
  component: SignUp,
})
const forgotPasswordRoute = createRoute({
  getParentRoute: () => nonAuthenticatedRoute,
  path: '/forgot-password',
  component: ForgotPassword,
})

const demoRoute = createRoute({
  getParentRoute: () => nonAuthenticatedRoute,
  path: '/demo',
  component: Demo,
})

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    indexRoute,
    calendarRoute,
    habitsRoute,
    notesRoute,
  ]),
  nonAuthenticatedRoute.addChildren([
    loginRoute,
    signUpRoute,
    forgotPasswordRoute,
    demoRoute,
  ]),
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Provider defaultTheme="light">
            <Toaster />
            <RouterProvider router={router} />
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
