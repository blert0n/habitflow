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
import reportWebVitals from './reportWebVitals.ts'
import App from './pages/index.tsx'
import Calendar from './pages/calendar/index.tsx'
import { Provider } from './components/ui/provider.tsx'
import { Layout } from './components/layout/layout.tsx'
import Habits from './pages/habits/index.tsx'
// import { Categories } from './components/habits/categories.tsx'

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
// const categoryRoute = createRoute({
//   getParentRoute: () => appLayoutRoute,
//   path: '/categories',
//   component: Categories,
// })

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    indexRoute,
    calendarRoute,
    habitsRoute,
    // categoryRoute,
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
      <Provider defaultTheme="light">
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
