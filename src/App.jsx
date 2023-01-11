/**
 * External Dependencies
 */
import { Route, Routes } from 'react-router-dom'

/**
 * Internal Dependencies
 */
import Home from './Home'
import Layout from './Layout'
import JobDetails from './SingleJob'

function App() {
	return(
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="/class/:jobId" element={<JobDetails />} />
			</Route>
		</Routes>
	)
}

export default App
