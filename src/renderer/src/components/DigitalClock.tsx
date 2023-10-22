import { useEffect, useState } from 'react'

function DigitalClock(): JSX.Element {
	const [time, setTime] = useState('')

	useEffect(() => {
		window.api.listen('time-tick', (newTime) => {
			setTime(newTime)
		})
	}, [])

	return <h1 className="text-center">{time}</h1>
}

export default DigitalClock
