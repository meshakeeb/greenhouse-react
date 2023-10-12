/**
 * External Dependencies
 */
import { useFetch } from 'usehooks-ts'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from "react-router-dom"

/**
 * Internal Dependencies
 */
import JobForm from './components/job-form'
import { normalizeTitle } from './helpers'

function JobDetails() {
	const { boardId, jobId } = useParams()
	const url = `https://boards-api.greenhouse.io/v1/boards/${boardId}/jobs/${jobId}?questions=true`
	const { data, error } = useFetch(url)

	if ( error ) {
		return <Navigate to="/" />
	}

	if ( ! data ) {
		return <p className="bg-white p-8">Loading...</p>
	}

	const {
		location,
		questions,
		updated_at
	} = data
	let { title, date } = normalizeTitle( data.title )

	const normalizedQuestions = {}
	const labelKeys = {
		'First Name': 'first_name',
		'Last Name': 'last_name',
		'Email': 'email',
		'Phone': 'phone',
		'Resume/CV': 'resume',
		'Cover Letter': 'cover_letter',
		'Work Portfolio Attachment': 'portfolio',
		'Primary Home Address': 'address',
		'Issuing Driver': 'issuing_state',
		'City': 'city',
		'State': 'state',
		'ZIP': 'zip',
		'Drivers License': 'license',
		'DMVR': 'dmvr',
		'Transcript': 'transcript',
		'ASE One Test Document': 'ase_document',
		'ASE One Test link out': 'ase_link',
		'BMW STEP Recruiter': 'recruiter',
		'learn about BMW STEP': 'know_about',
		'job via SMS.': 'optin',
	}
	const labels = Object.keys(labelKeys)
	questions.map((question) => {
		const key = labels.find( ( label ) => question.label.includes( label ) )
		normalizedQuestions[ labelKeys[ key ] ] = question
	})

	return (
		<section className="application-form-area">
			<div className="container wide">
				<Helmet prioritizeSeoTags>
					<title>{title} - BMW STEP</title>
					<meta property="og:locale" content="en_US" />
					<meta property="og:type" content="article" />
					<meta property="og:title" content={ `${title} - BMW STEP` } />
					<meta property="og:url" content={ window.location.href } />
					<meta property="og:site_name" content="BMW STEP" />
					<meta property="article:modified_time" content={updated_at} />
					<meta name="twitter:card" content="summary" />
				</Helmet>

				<div className="content-text application-text">
					<div className="application-meta">
						<h1 className="h4">{title}</h1>
						<p>{date}</p>

						<p>at BMW Automotive Service Technician Program <span>{location.name}</span></p>
					</div>
				</div>

				<JobForm questions={normalizedQuestions} jobId={ jobId } classTitle={ title } />

			</div>
		</section>
	)
}

export default JobDetails
