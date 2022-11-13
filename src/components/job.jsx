import { NavLink } from "react-router-dom"

import { normalizeTitle } from '../helpers'

function Job({ item }) {
	return (
		<div className="job">
			<NavLink to={`/job/${item.id}`} className="text-blue-800 text-lg font-semibold">
				{normalizeTitle(item.title)}
			</NavLink>
			<label className="block text-gray-500">{item.location.name}</label>
		</div>
	)
}

export default Job
