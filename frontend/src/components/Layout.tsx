import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = () => (
  <div className="os-app">
    <Sidebar />
    <div className="os-layout-right">
      <main className="os-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
)

export default Layout
