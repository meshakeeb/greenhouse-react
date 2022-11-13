/**
 * External Dependencies
 */
import { useFetch } from 'usehooks-ts'
import { useParams } from "react-router-dom"
import { Helmet } from 'react-helmet-async'

/**
 * Internal Dependencies
 */
import { BOARD_ID } from './constants'
import JobForm from './components/job-form'
import { normalizeTitle } from './helpers'

function unescapeHtml(unsafe) {
    return unsafe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
}

function JobDetails() {
	const { jobId } = useParams()
	const url = `https://boards-api.greenhouse.io/v1/boards/${BOARD_ID}/jobs/${jobId}?questions=true`
	const { data, error } = useFetch(url)

	if ( error ) {
		return <p className="bg-white p-8">There is an error.</p>
	}

	if ( ! data ) {
		return <p className="bg-white p-8">Loading...</p>
	}

	const {
		content,
		location,
		questions,
		updated_at
	} = data
	let title = normalizeTitle( data.title )

	return (
		<>
			<Helmet prioritizeSeoTags>
				<title>{title} - BMW Step</title>
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={ `${title} - BMW Step` } />
				<meta property="og:url" content={ window.location.href } />
				<meta property="og:site_name" content="BMW Step" />
				<meta property="article:modified_time" content={updated_at} />
				<meta name="twitter:card" content="summary" />
			</Helmet>
			<div className="bg-white">
				<div className="container mx-auto p-8">
					<h1 className="text-blue-800 font-bold text-xl mb-8">
						{title}
						<small className="text-md block font-normal text-gray-600">at BMW Automotive Service Technician Program</small>
						<small className="text-sm pt-1 block font-normal text-gray-500">{location.name}</small>
					</h1>

					<div className="job-description" dangerouslySetInnerHTML={{ __html: unescapeHtml(content) }} />

					<JobForm questions={questions} jobId={ jobId } />
				</div>
			</div>
		</>
	)
}

export default JobDetails