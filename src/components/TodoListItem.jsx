import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'


function TodoListItem({ className, name, onComplete, onChange, onDelete }) {
    return (
        <li className={className}>
            <button onClick={onComplete}>Done?</button>
            <input onChange={onChange} value={name} />
			<button onClick={onDelete}>Delete?</button>
        </li>
    )
}

export default styled(observer(TodoListItem))`
    color: red;
`
