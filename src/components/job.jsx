/**
 * External Dependencies
 */
import { NavLink } from 'react-router-dom'

/**
 * Internal Dependencies
 */
import { normalizeTitle } from '../helpers'
import { BOARD_ID } from '../constants'

function Job({ item }) {
	const { title, date } = normalizeTitle(item.title)
	return (
		<div className="job">
			<NavLink to={`/class/${BOARD_ID}/${item.id}`} className="text-blue-800 text-lg font-semibold">
				{title} - {date}
			</NavLink>
			, <label className="block text-gray-500">{item.location.name}</label>
		</div>
	)
}

export default Job
