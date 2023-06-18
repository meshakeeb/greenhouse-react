/**
 * External Dependencies
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
/**
 * Internal Dependencies
 */
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter basename="available-classes">
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</BrowserRouter>
	</React.StrictMode>
)
