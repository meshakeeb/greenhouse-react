/**
 * External Dependencies
 */
import classNames from 'classnames'
import { useForm } from 'react-hook-form'

/**
 * Internal Dependencies
 */
import { BOARD_ID } from '../constants'

const isValidEmail = email =>
	// eslint-disable-next-line no-useless-escape
	/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	)

const allowedFiles = '.pdf,.doc,.docx,.txt,.rtf,.jpeg,.jpg,.png'

const onSubmit = async (data) => {
	const { jobId } = data
	delete data.jobId

	var formData = new FormData()
	Object.entries(data).map(async function( [key, value] ) {
		if ( '[object FileList]' === value.toString() ) {
			const file = value[0]
			// formData.append( key, data[key][0], file.name )
		} else {
			formData.append( key, value )
		}
	})

	const token = btoa('f46a729b799f2a14afa22cb886f5c970-5:')

	const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${BOARD_ID}/jobs/${jobId}`, {
		method: 'POST',
		body: JSON.stringify({
			first_name: 'ssss'
		}),
		headers: {
			'Authorization': 'Basic ' + token,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	})
	const content = await response.json()
	console.log(content)
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

export default function JobForm({ jobId, questions }) {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm({
		mode: 'onBlur'
	})

	return (
		<div className="max-w-4xl my-12 mx-auto">
			<h4 className="font-semibold mb-6">Apply for this Class</h4>
			<form className="job-form" onSubmit={handleSubmit(onSubmit)}>

				<input type="hidden" {...register('jobId')} value={jobId} />

				{questions.map((question, index) => <FormField register={register} key={`question-${index}`} errors={errors} question={question} />)}

				<button type="submit">Submit</button>

			</form>
		</div>
	)
}
