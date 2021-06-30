import React, {useState} from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import {observable} from "mobx";

function TodoListLogger({ className, logger}) {
	const [ store ] = useState(createTodoStore);

	return (
		<li className={className}>
			{store.getLogValue(logger)}
		</li>
	)
}

function createTodoStore() {
	const self = observable({
		// TODO: Don't like logger.data having different types
		getLogValue(logger) {
			switch(logger.type) {
				case 'ITEM_ADDED':
					return 'Item Added:  ' + logger.data.item.name
				case 'ITEM_UPDATED':
					return 'Item Updated: ' + logger.data.item.name
				case 'ITEM_REMOVED':
					return 'Item Removed: ' + logger.data.item.name
				case 'STATUS_UPDATE':
					return logger.data.item.name + ' Status Updated: ' + logger.data.status
				case 'TAG_ADDED':
					return 'Tag Added: ' + logger.data.item.name
				case 'TAG_REMOVED':
					return 'Tag Removed: ' + logger.data.item.name
				default:
					return 'Default'
			}
		},
	})

	return self;
}

export default styled(observer(TodoListLogger))`
    color: red;

    input {
    	width: 500px
	}
`
