/**
 * External Dependencies
 */
import { useState } from "react"

/**
 * Internal Dependencies
 */
import Jobs from "./components/jobs"
import Offices from "./components/offices"
import Departments from "./components/departments"

function Home() {
	const [office, setOffice] = useState(-1)
	const [department, setDepartment] = useState(-1)

	return(
		<>
			<div className="bg-gray-100">
				<div className="container mx-auto">
					<div className="filters flex py-6 space-x-6">
						<Departments onChange={setDepartment} />
						<Offices onChange={setOffice} />
					</div>
				</div>
			</div>
			<div className="bg-white p-8">
				<div className="container mx-auto">
					<Jobs department={department} office={office} />
				</div>
			</div>
		</>
	)
}

export default Home
