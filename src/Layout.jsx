import { Outlet } from "react-router-dom"

function Layout() {
	return(
		<div className="wrap bg-orange-50">
			<header className="px-8 py-4 flex items-center space-x-4 shadow-md relative hidden">
				<img src="https://www.bmwstep.com/wp-content/uploads/2022/09/Z_BMW-Grey-Logo2.png" alt="" className="w-16 rounded-lg" />
				<h1 className="logo text-2xl font-semibold">BMW Automotive Service Technician Program</h1>
			</header>
			<div className="content">
				<Outlet />
			</div>
		</div>
	)
}

export default Layout
