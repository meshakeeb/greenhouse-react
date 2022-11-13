/**
 * External Dependencies
 */
import { useFetch } from 'usehooks-ts'

/**
 * Internal Dependencies
 */
import { BOARD_ID } from '../constants'

function Offices({ onChange }) {
	const url = `https://boards-api.greenhouse.io/v1/boards/${BOARD_ID}/offices?render_as=list`

	const { data, error } = useFetch(url)

	return(
		<div className="filter">
			<label htmlFor="offices" className="block font-semibold pl-1 text-sm pb-1">Offices</label>
			{ error && <p>There is an error.</p> }
			{ ! data && <p>Loading...</p> }
			{ data && (
				<select
					className="border border-gray-100 shadow rounded px-2 py-1"
					name="offices"
					id="offices"
					onChange={(event) => {
						onChange(parseInt(event.target.value))
					}}
				>
					<option value="-1">All</option>
					{ data.offices.map(function( option, index ) {
						return (
							<option key={index} value={option.id}>{option.name}</option>
						)
					})}
				</select>
			)}
		</div>
	)
}

export default Offices
