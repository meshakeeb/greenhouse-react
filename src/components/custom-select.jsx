import classNames from 'classnames'
import { useEffect, useState, useRef } from "react";

function useOnClickOutside(ref, handler) {
	useEffect(() => {
		const listener = event => {
			if (!ref.current || ref.current.contains(event.target)) {
				return
			}

			handler(event)
		}

		document.addEventListener("mousedown", listener)

		return () => document.removeEventListener("mousedown", listener)

	}, [])
}

function CustomSelect({ question, register, setValue }) {
	const {
		fields: [ field ],
		required
	} = question
	const { name, values } = field
	const [currentLabel, setCurrentLabel] = useState('')
    const [open, setOpen] = useState(false)
	const ref = useRef()
	useOnClickOutside(ref, () => setOpen(false))

	const setOption = (label, value) => {
		setCurrentLabel(label)
		setValue(name, value)
		setOpen(false)
	}

	return(
		<div className="custom_select manual">
			<input type="text" {...register(name, { required })} id={name} />
			<div className="select" ref={ref}>
				<div className={ classNames('select-styled', {active: open}) } onClick={ () => setOpen(!open)}>{currentLabel}</div>
				{ open && (
					<ul className="select-options" style={{display: 'block'}}>
						<li rel="">Please Select</li>
						{values.map((option, index) => (
							<li key={`option-${index}`} rel={option.value} onClick={() => setOption(option.label, option.value)}>{option.label}</li>
						) )}
					</ul>
				)}
			</div>
		</div>
	)
}

export default CustomSelect
