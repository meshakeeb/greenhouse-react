/**
 * External Dependencies
 */
import { useFetch } from 'usehooks-ts'

/**
 * Internal Dependencies
 */
import { BOARD_ID } from '../constants'

function Departments({ onChange }) {
	const url = `https://boards-api.greenhouse.io/v1/boards/${BOARD_ID}/departments?render_as=list`
	const { data, error } = useFetch(url)

	return(
		<div className="filter">
			<label htmlFor="departments" className="block font-semibold pl-1 text-sm pb-1">Departments</label>
			{ error && <p>There is an error.</p> }
			{ ! data && <p>Loading...</p> }
			{ data && (
				<select
					className="border border-gray-100 shadow rounded px-2 py-1"
					name="departments"
					id="departments"
					onChange={(event) => {
						console.log( event.target.value )
						onChange(parseInt(event.target.value))
					}}
				>
					<option value="-1">All</option>
					{ data.departments.map(function( option, index ) {
						return (
							<option key={index} value={option.id}>{option.name}</option>
						)
					})}
				</select>
			)}
		</div>
	)
}

export default Departments
