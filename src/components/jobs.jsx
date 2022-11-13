/**
 * External Dependencies
 */
import { useFetch } from 'usehooks-ts'

/**
 * Internal Dependencies
 */
import Job from './job'
import { BOARD_ID } from '../constants'

function Jobs({ department, office }) {
	const url = `https://boards-api.greenhouse.io/v1/boards/${BOARD_ID}/jobs?content=true`
	const { data, error } = useFetch(url)

	if ( error ) {
		return <p>There is an error.</p>
	}

	if ( ! data ) {
		return <p>Loading...</p>
	}

	let { jobs } = data
	const hasFilter = -1 !== department || -1 !== office

	if ( hasFilter ) {
		jobs = jobs.filter((job) => {
			const inDepartment = job.departments.some((item) => item.id === department )
			const inOffice = job.offices.some((item) => item.id === office)

			if (-1 !== department && -1 === office) {
				return inDepartment
			}

			if (-1 === department && -1 !== office) {
				return inOffice
			}

			return inDepartment && inOffice
		})
	}

	// Grouping.
	const groups = {}
	jobs.map(( job ) => {
		const date = job.title.split('-').slice(-2, -1)
		const department = job.departments[0].name

		job.date = new Date(date)

		if ( undefined === groups[ department ] ) {
			groups[ department ] = []
		}

		groups[ department ].push( job )
	})

	let count = 0

	return (
		<>
			<div className='mb-8'>
				<div className="font-semibold mb-4 italic float-right text-xl">
					{jobs.length} jobs
				</div>
				<h2 className="font-semibold text-lg mb-2">Jumpstart a Career with BMW STEP.</h2>
				<p className="text-sm max-w-screen-md text-gray-500">BMW-trained technicians are in high demand across our dealerships. BMW STEP is the most comprehensive BMW technician development program in North America, and our graduates are preferred by dealers nationwide. Funded by BMW of North America, LLC, the program chooses the finest talent from post-secondary automotive trade schools and colleges across the country.</p>
			</div>

			<div className="job-list">
				{Object.entries(groups).map(([departmentTitle, jobsInGroup]) => {
					jobsInGroup = jobsInGroup.sort( ( a, b ) => a.date - b.date )

					return (
						<div key={count++} className="pb-6">
							{! hasFilter && <h2 className="pt-6 font-bold text-xl">{departmentTitle}</h2>}
							<div className="space-y-4">
								{jobsInGroup.map((job, index) => <Job item={job} key={index} /> )}
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default Jobs
