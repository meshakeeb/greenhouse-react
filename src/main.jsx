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
import './assets/css/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter basename="available-classes">
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</BrowserRouter>
	</React.StrictMode>
)
