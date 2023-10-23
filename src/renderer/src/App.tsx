import { Alarm } from 'src/interfaces'
import AlarmCreate from './components/AlarmCreate'
import AlarmList from './components/AlarmList'
import DigitalClock from './components/DigitalClock'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
	const [alarms, setAlarms] = useState([] as Alarm[])

	useEffect(() => {
		const listAlarms = async () => {
			const alarmsFetched = await window.api.invoke('list-alarms')
			setAlarms(alarmsFetched)
		}

		listAlarms().catch(console.error)
	}, [])

	const createAlarm = async (newAlarm: Alarm) => {
		const alarmResult = await window.api.invoke('create-alarm', newAlarm)

		if (alarmResult.ok) setAlarms(alarmResult.value)
		else alert(alarmResult.error)

		return alarmResult.ok
	}

	return (
		<div className="container">
			<DigitalClock></DigitalClock>

			<AlarmList alarms={alarms}></AlarmList>
			<AlarmCreate onCreate={createAlarm}></AlarmCreate>
		</div>
	)
}

export default App
