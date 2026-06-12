import { Suspense, lazy, useState } from 'react'
import { Outlet, createBrowserRouter } from 'react-router-dom'
import Header from './components/Header.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const AuthPage = lazy(() => import('./pages/AuthPage.jsx'))
const ChannelPage = lazy(() => import('./pages/ChannelPage.jsx'))
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage.jsx'))

function PageLoader() {
  return <p className="page-message">Loading page...</p>
}

function withSuspense(page) {
  return <Suspense fallback={<PageLoader />}>{page}</Suspense>
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Header onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)} />
      <div className="app-shell__body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'watch/:videoId', element: withSuspense(<VideoPlayerPage />) },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'channel/new', element: withSuspense(<ChannelPage />) }],
      },
      { path: 'channel/:channelId', element: withSuspense(<ChannelPage />) },
    ],
  },
  { path: '/auth', element: withSuspense(<AuthPage />) },
  { path: '*', element: <NotFoundPage /> },
])

export default Layout
