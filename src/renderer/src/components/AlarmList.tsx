import { useEffect, useState } from 'react'
import { Alarm } from 'src/interfaces'

function AlarmList(props: { alarms: Alarm[] }): JSX.Element {
	return <pre>{JSON.stringify(props.alarms)}</pre>
}

export default AlarmList
