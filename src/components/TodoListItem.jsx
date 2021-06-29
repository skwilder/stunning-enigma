import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import EdiText from 'react-editext';

function TodoListItem({ className, item, onComplete, onDelete, onProgressUpdate, onEdit }) {
    return (
        <li className={className}>
			<EdiText type="text" value={item.name} onSave={onEdit} />
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
