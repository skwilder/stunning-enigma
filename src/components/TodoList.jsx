import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { observable } from 'mobx';
import { v4 as uuid} from 'uuid';

import TodoListItem from './TodoListItem'


function TodoList({ className }) {
    const [ store ] = useState(createTodoStore);

    return (
        <div className={className}>
            <header>
                <h1 className="title">TODO List Example</h1>
            </header>
            <section>
                <ul>
                    {store.workingItems.map(item => (
                        <TodoListItem
                            key={item.id}
                            item={item}
                            isComplete={item.isComplete}
                            onComplete={() => store.setCompleted(item.id)}
							onProgressUpdate={() => store.setTaskStatus(item.id, 'started')}
                            onChange={(e) => store.setItemName(item.id, e.target.value)}
                            onDelete={() => store.deleteItem(item.id)}
                        />
                    ))}
                </ul>
                <button onClick={store.addItem}>
                    Add New Item
                </button>
            </section>
            <footer>
                <h2 className="completedTitle">Completed Items</h2>
                <ul>
                    {store.completedItems.map(item => (
                        <li key={item.id}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </footer>
        </div>
    )
}

function createTodoStore() {
    const self = observable({
        items: [{
            id: uuid(),
            name: "Complete CSS for TODOList application",
			status: 'new',
			tags: ["Styling"]
        },{
			id: uuid(),
			name: "Add Tag Functionality into workflow",
			status: 'new',
			tags: ["Component"]
		},{
			id: uuid(),
			name: "Add to readme areas to improve",
			status: 'started',
			tags: ["Clean Up"]
		},{
			id: uuid(),
			name: "Ensure git commits are accurate!",
			status: 'started',
			tags: ["Clean Up"]
		},{
			id: uuid(),
			name: "Download and install application",
			status: 'completed',
			tags: ["Admin"]
		},{
			id: uuid(),
			name: "Complete deletion functionality",
			status: 'completed',
			tags: ["Component"]
		}],

        get workingItems() {
            return self.items.filter(i =>  i.status !== 'completed');
        },
        get completedItems() {
        	// TODO move started (or status) to constant
            return self.items.filter(i => i.status === 'completed');
        },

        addItem() {
            self.items.push({
                id: uuid(),
                name: `Item ${self.items.length}`,
                status: `new`
            });
        },
        setItemName(id, name) {
            const item = self.items.find(i => i.id === id);
            item.name = name;
        },
        setCompleted(id) {
            const item = self.items.find(i => i.id === id);
            item.status = 'completed';
        },
		setTaskStatus(id) {
			const item = self.items.find(i => i.id === id);

			// TODO: Fix state toggling, this is crude
			if (item.status === 'new') {
				item.status = 'started';
			} else if (item.status === 'started') {
				item.status = 'new';
			}
		},
		deleteItem(id) {
        	const itemIndex = self.items.findIndex(i => i.id === id);
        	self.items.splice(itemIndex,1);
		},
    })

    return self;
}

export default styled(observer(TodoList))`
    background-color: lightgray;

    .title {
        color: orange;
    }
`
