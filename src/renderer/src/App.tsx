import { Alarm } from 'src/interfaces'
import AlarmCreate from './components/AlarmCreate'
import AlarmList from './components/AlarmList'
import DigitalClock from './components/DigitalClock'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
	const [alarms, setAlarms] = useState([] as Alarm[])

	useEffect(() => {
		const alarmsFetched = window.api.sendSync('list-alarms')
		setAlarms(alarmsFetched)
	}, [])

	const createAlarm = async (newAlarm: Alarm) => {
		const res = await window.api.invoke('create-alarm', newAlarm)

		if (res.ok) setAlarms(res.value)
		else alert(res.error)

		return res.ok
	}

	const removeAlarm = async (alarmToRemove: Alarm) => {
		const res = await window.api.invoke('remove-alarm', alarmToRemove)

		if (res.ok) setAlarms(res.value)
		else alert(res.error)

		return res.ok
	}

	return (
		<div className="container">
			<DigitalClock></DigitalClock>

			<AlarmList alarms={alarms} onRemove={removeAlarm}></AlarmList>
			<AlarmCreate onCreate={createAlarm}></AlarmCreate>
		</div>
	)
}

export default App
