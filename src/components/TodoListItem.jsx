import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'


function TodoListItem({ className, item, onComplete, onChange, onDelete, onProgressUpdate }) {
    return (
        <li className={className}>
            <input onChange={onChange} value={item.name} />
			<button onClick={onProgressUpdate}>{item.status === 'new' ? 'Start' : 'Incomplete'}</button>
			{item.status === 'started' &&
				<button onClick={onComplete}>Complete?</button>
			}
			<button onClick={onDelete}>Delete?</button>
        </li>
    )
}

export default styled(observer(TodoListItem))`
    color: red;
`
