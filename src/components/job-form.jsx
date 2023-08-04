/**
 * External Dependencies
 */
import { jsPDF } from 'jspdf'
import { useState } from 'react'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import CustomSelect from './custom-select'

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

function FormField({ question, errors, register, setValue }) {
	const {
		label,
		fields: [ field ],
		required
	} = question
	const { name, type } = field

	return (
		<li className={ classNames( { 'has-error': errors[name] } ) }>
			<label htmlFor={name}>
				{label}
				{required && <span>*</span> }
			</label>

			{'email' === name && 'input_text' === type && (
				<input type="email" {...register(name, { required, validate: isValidEmail })} id={name} className="text" autoComplete="off" />
			)}

			{'email' !== name && 'input_text' === type && (
				<input type="text" {...register(name, { required })} id={name} className="text" autoComplete="off" />
			)}

			{'input_file' === type && (
				<div className="upload-btn-wrapper">
					<button className="f_btn">
						<span>Attach, Dropbox, or enter manually</span>
						(File types: pdf, doc, docx, txt, rtf)
					</button>
					<input type="file" {...register(name, { required })} id={name} accept={allowedFiles} />
					<small className="file-name"></small>
				</div>
			)}

			{'multi_value_single_select' === type && (
				<CustomSelect register={register} errors={errors} question={question} setValue={setValue} />
			)}

			{errors[name]?.type === 'required' && <p className="error">{label.split(' - ')[0]} is required</p>}
			{'email' === name && errors.email?.type === 'validate' && <p className="error">Email is invalid</p>}
		</li>
	)
}

export default function JobForm({ jobId, classTitle, questions }) {
	const {
		register,
		reset,
		setValue,
		handleSubmit,
		formState: { errors }
	} = useForm({
		mode: 'onBlur'
	})
	const [isSubmitting, setSubmitting] = useState(false)
	const [showSuccess, setSuccess] = useState(false)
	const [error, setError] = useState(false)

	if ( showSuccess ) {
		setTimeout(() => {
			// 👇️ redirects to an external URL
			window.location.replace(window.applicationRedirect)
		}, 100)
		return 'Redirecting'
	}

	const step1Fields = [ 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'license', 'issuing_state' ]
	const step2Fields = [ 'resume', 'cover_letter', 'portfolio', 'dmvr', 'transcript', 'ase_document', 'ase_link' ]
	const step3Fields = [ 'recruiter', 'know_about', 'optin' ]
	const loopQuestions = ( fields ) => {
		return fields.map((question) => {
			if (undefined === questions[question]) {
				return null
			}

			return <FormField register={register} key={`question-${question}`} errors={errors} question={questions[question]} setValue={setValue} />
		})
	}

	return (
		<form className="job-form" onSubmit={handleSubmit( async (data)=> {
			setSubmitting(true)
			setError(false)
			await onSubmit(data, classTitle, reset, setSuccess, setSubmitting, setError)
		})}>

            <ul className="steps">
                <li className="steps_1"><span>1</span><span className="text">Personal Info</span></li>
                <li className="steps_2"><span>2</span><span className="text">Documents</span></li>
                <li className="steps_3"><span>3</span><span className="text">Recruitments Info</span></li>
            </ul>

			<input type="hidden" {...register('job_id')} value={jobId} />

			<div className="row g-lg-5">
				<div className="col-sm-4">
					<div className="app_form step_1 current">
						<h3 className="title"><strong><span>1</span>Personal Info</strong></h3>
						<ul>
							{loopQuestions(step1Fields)}
						</ul>
						<div className="text-center action">
                            <button type="button" id="step_1" className="cta-btn btn_default toggle-disabled next-button" disabled>Next</button>
                        </div>
					</div>
				</div>
				<div className="col-sm-4">
					<div className="app_form step_2" disabled={true}>
						<h3 className="title"><strong><span>2</span>Documents</strong></h3>
						<ul>
							{loopQuestions(step2Fields)}
						</ul>
						<div className="text-center action">
                            <button type="button" className="cta-btn btn_default prev-button">Prev</button>
                            <button type="button" id="step_2" className="cta-btn btn_default toggle-disabled next-button end-button" disabled>Next</button>
                        </div>
					</div>
				</div>
				<div className="col-sm-4">
					<div className="app_form step_3" disabled={true}>
						<h3 className="title"><strong><span>3</span>Recruitments Info</strong></h3>
						<ul>
							{loopQuestions(step3Fields)}
						</ul>
					</div>
				</div>
			</div>

			{error && <div className="mb-4"><p>{error}</p></div>}

			<div className="text-sm-end text-center form-submit-action">
                <button type="button" className="cta-btn btn_default prev-button d-sm-none">Prev</button>
                {isSubmitting
					? (
						<button disabled={true} className="cta-btn btn_default">
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							Submitting&hellip;
						</button>
					)
					: (<button type="submit" className="cta-btn btn_default">Submit application</button>)
				}
            </div>

		</form>
	)
}
