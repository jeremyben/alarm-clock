import { useEffect, useState } from 'react'

function DigitalClock(): JSX.Element {
	const [time, setTime] = useState('')
	const [ringing, setRinging] = useState(false)

	useEffect(() => {
		window.api.listen('time-tick', (newTime) => {
			setTime(newTime)
		})

		window.api.listen('ring', () => {
			setRinging(true)
		})
	}, [])

	const stopAlarm = () => {
		setRinging(false)
	}

	return (
		<article className="text-center">
			<h1 className={ringing ? 'ringing' : ''}> {time}</h1>
			{ringing && (
				<button className="contrast" onClick={stopAlarm}>
					Stop
				</button>
			)}
		</article>
	)
}

export default DigitalClock
