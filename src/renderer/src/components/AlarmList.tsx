import { useEffect, useState } from 'react'
import { Alarm } from 'src/interfaces'

function AlarmList(props: { alarms: Alarm[]; onRemove: (alarmToRemove: Alarm) => Promise<boolean> }): JSX.Element {
	const [deleting, setDeleting] = useState(false)

	const removeAlarm = (alarmToRemove: Alarm) => {
		setDeleting(true)

		props.onRemove(alarmToRemove).finally(() => {
			setDeleting(false)
		})
	}

	return (
		<div>
			<h4>Alarms</h4>

			{props.alarms.length ? (
				<table>
					<tbody>
						{props.alarms.map((alarm) => (
							<tr key={`${alarm.hour}-${alarm.minute}`}>
								<td width="20px">{alarm.hour}h</td>

								<td>{alarm.minute}</td>

								<td width="20px">
									<button
										className="secondary outline"
										onClick={() => removeAlarm(alarm)}
										disabled={deleting}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No alarm set yet.</p>
			)}
		</div>
	)
}

export default AlarmList
