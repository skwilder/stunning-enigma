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
				<input onKeyUp={(e) => store.processCreationInput(e.target.value, e)}/>
			</section>
            <section>
                <ul>
                    {store.workingItems.map(item => (
                        <TodoListItem
                            key={item.id}
                            item={item}
                            isComplete={item.isComplete}
                            onComplete={() => store.setCompleted(item.id)}
							onProgressUpdate={() => store.setTaskStatus(item.id, 'started')}
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
        },{
			id: uuid(),
			name: "Add Tag Functionality into workflow",
			status: 'new'
		},{
			id: uuid(),
			name: "Add to readme areas to improve #Clean-Up #Styling",
			status: 'started',
			tags: ["Clean-Up", "Styling"]
		},{
			id: uuid(),
			name: "Ensure git commits are accurate! #Clean-up",
			status: 'started',
			tags: ["Clean-up"]
		},{
			id: uuid(),
			name: "Download and install application #Admin",
			status: 'completed',
			tags: ["Admin"]
		},{
			id: uuid(),
			name: "Complete deletion functionality #Component",
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

		processCreationInput(userInput, keyEvent) {
        	if (keyEvent.key && keyEvent.key === 'Enter') {
        		self.addItem(userInput);
        		// Clear out the text box
				keyEvent.target.value = '';
			}
		},
        addItem(userTodoInput) {
            self.items.push({
                id: uuid(),
                name: userTodoInput,
                status: `new`,
				tags: self.extractTagsFromUserInput(userTodoInput)
            });
        },
		extractTagsFromUserInput(userTodoInput) {
			return userTodoInput.match(/(?<=#)\S+/g);
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
