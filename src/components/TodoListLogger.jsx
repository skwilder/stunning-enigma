import React, {useState} from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import {observable} from "mobx";
import parse from 'html-react-parser'

function TodoListLogger({ className, logger}) {
	const [ store ] = useState(createTodoStore);

	return (
		<li className={className}>
			{parse(store.getLogValue(logger))}
		</li>
	)
}

function createTodoStore() {
	const self = observable({
		// TODO: Don't like logger.data having different types of tdata
		getLogValue(logger) {
			switch(logger.type) {
				case 'ITEM_ADDED':
					return '<span>Item Added:  </span>' + logger.data.item.name
				case 'ITEM_UPDATED':
					return '<span>Item Updated: </span>' + logger.data.item.name
				case 'ITEM_REMOVED':
					return '<span>Item Removed: </span>' + logger.data.item.name
				case 'STATUS_UPDATE':
					return logger.data.item.name + '<span> Status Updated: </span>' + logger.data.status
				case 'TAG_ADDED':
					return '<span>Tag Added: </span>' + logger.data.tag
				case 'TAG_REMOVED':
					return '<span>Tag Removed: </span>' + logger.data.tag
				default:
					return 'Default'
			}
		},
	})

	return self;
}

export default styled(observer(TodoListLogger))`
	font-size: 0.85em;
	span {
		font-weight: bold;
	}
`
