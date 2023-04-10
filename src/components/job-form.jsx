/**
 * External Dependencies
 */
import { jsPDF } from 'jspdf'
import { useState } from 'react'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'

const isValidEmail = email =>
	// eslint-disable-next-line no-useless-escape
	/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	)

const allowedFiles = '.pdf,.doc,.docx,.txt,.rtf,.jpeg,.jpg,.png'

function getExtByFileType( type ) {
	const hash = {
		'image/png': 'PNG',
		'image/jpeg': 'JPEG',
		'image/jpg': 'JPG',
	}

	if ( undefined !== hash[ type ] ) {
		return hash[ type ]
	}

	return 'JPEG'
}

const readFileAsText = ( file, key, formData ) => {
	const reader = new FileReader()

	return new Promise( (resolve, reject) => {
		reader.onerror = () => {
			reader.abort()
			reject(new DOMException("Problem parsing input file."))
		}

		reader.onloadend = () => {
			let base64String = reader.result
			const fileName = file.name
				.replace( /jpeg|jpg|png/gi, 'pdf' )

			if( file.type.includes('image')) {
				const doc = new jsPDF({
					unit: 'in',
					compress: true
				})
				doc.addImage(
					base64String,
					getExtByFileType( file.type ),
					0,
					0,
					doc.internal.pageSize.getWidth(),
					doc.internal.pageSize.getHeight()
				)
				base64String = doc.output('datauristring')
			}

			base64String = base64String
				.replace('data:', '')
				.replace(/^.+,/, '')
			formData.append( key + '_content', base64String )
			formData.append( key + '_content_filename', fileName )
			resolve()
		}
		reader.readAsDataURL(file)
	})
}

const onSubmit = async (data, classTitle, reset, setSuccess, setSubmitting, setError) => {
	var formData = new FormData()
	const promises = []
	Object.entries(data).map(async function( [key, value] ) {
		if ( '[object FileList]' === value.toString() ) {
			if ( value[0] ) {
				promises.push( readFileAsText(value[0], key, formData) )
			}
		} else {
			formData.append( key, value )
		}
	})

	Promise.all(promises).then( async () => {
		//https://www.bmwstepconnections.com/
		//https://stepconnections.ext.constellationenv.com
		const response = await fetch('https://www.bmwstepconnections.com/greenhouse/push', {
			method: 'POST',
			body: formData
		})
		const content = await response.json()

		setSubmitting(false)
		if ( 'Candidate saved successfully' === content.success ) {
			reset()
			setSuccess(true)
			if ( window.dataLayer && window.dataLayer.push ) {
				window.dataLayer.push({
					event: 'applicationSubmitted',
					classTitle,
					name: `${data.first_name} ${data.last_name}`,
					email: data.email
				})
			}
		} else {
			setSubmitting(false)
			setError('Something went wrong! The team has been notified. Please submit again.')
		}
	}).catch((error) => {
		setSubmitting(false)
		setError('Something went wrong! The team has been notified. Please submit again.')
	})
}

function FormField({ question, errors, register }) {
	const {
		label,
		description,
		fields: [ field ],
		required
	} = question
	const { name, type, values } = field

	return (
		<div className={ classNames( 'form-control', { 'has-error': errors[name] } ) }>
			<label htmlFor={name}>
				{label}
				{required && <span className="text-red-500 pl-1">*</span> }
			</label>

			{description && (
				<div className="job-description" dangerouslySetInnerHTML={{__html: description }} />
			)}

			{'email' === name && 'input_text' === type && (
				<input type="email" {...register(name, { required, validate: isValidEmail })} id={name} className="text" autoComplete="off" />
			)}

			{'email' !== name && 'input_text' === type && (
				<input type="text" {...register(name, { required })} id={name} className="text" autoComplete="off" />
			)}

			{'input_file' === type && (
				<input type="file" {...register(name, { required })} id={name} accept={allowedFiles} />
			)}

			{'multi_value_single_select' === type && (
				<select {...register(name, { required })} id={name} className="select">
					<option value="">Select Option</option>
					{values.map((option, index) => (
						<option key={`option-${index}`} value={option.value}>{option.label}</option>
					) )}
				</select>
			)}

			{errors[name]?.type === 'required' && <p className="error">{label.split(' - ')[0]} is required</p>}
			{'email' === name && errors.email?.type === 'validate' && <p className="error">Email is invalid</p>}
		</div>
	)
}

export default function JobForm({ jobId, classTitle, questions }) {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors }
	} = useForm({
		mode: 'onBlur'
	})
	const [isSubmitting, setSubmitting] = useState(false)
	const [showSuccess, setSuccess] = useState(false)
	const [error, setError] = useState(false)

	if ( showSuccess ) {
		return (
			<div className="max-w-4xl my-12 mx-auto">
			<h4 className="font-semibold mb-6">Apply for this Class</h4>
			<p>Job application submitted successfully. <NavLink to="/" className="text-blue-600">Go back to class listing</NavLink>.</p>
		</div>
		)
	}

	return (
		<div className="max-w-4xl my-12 mx-auto">
			<h4 className="font-semibold mb-6">Apply for this Class</h4>
			<form className="job-form" onSubmit={handleSubmit( async (data)=> {
				setSubmitting(true)
				setError(false)
				await onSubmit(data, classTitle, reset, setSuccess, setSubmitting, setError)
			})}>

				<input type="hidden" {...register('job_id')} value={jobId} />

				{questions.map((question, index) => <FormField register={register} key={`question-${index}`} errors={errors} question={question} />)}

				{error && <div className="mb-4"><p>{error}</p></div>}

				<div>
					{isSubmitting
						? (
							<button disabled={true}>
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
								Submitting&hellip;
							</button>
						)
						: (<button type="submit">Submit</button>)
					}
				</div>

			</form>
		</div>
	)
}
