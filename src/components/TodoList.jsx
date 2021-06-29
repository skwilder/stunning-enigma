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
                    {store.nonCompletedItems.map(item => (
                        <TodoListItem
                            key={item.id}
                            item={item}
                            isComplete={item.isComplete}
                            onComplete={() => store.setCompleted(item.id)}
							onProgressUpdate={() => store.setTaskStatus(item.id, 'started')}
                            onDelete={() => store.deleteItem(item.id)}
							onEdit={(value) => store.editItem(item.id, value)}
                        />
                    ))}
                </ul>
            </section>
            <footer>
				<h2 className="completedTitle">Filter By Tag(s)</h2>
				{store.allTags.map(tag => (
					<button onClick={() => store.changeFilter(tag)}>{tag}</button>
				))}
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
		allTags: ["Clean-Up", "Styling", "Admin", "Component"],
		filter: '',
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

        get nonCompletedItems() {
            return self.applyFilterToItems(self.items.filter(i =>  i.status !== 'completed'));
        },
        get completedItems() {
        	// TODO move started (or status) to constant
            return self.applyFilterToItems(self.items.filter(i => i.status === 'completed'));
        },

		applyFilterToItems(items) {
			if (self.filter) {
				items = items.filter(i => i.tags && i.tags.indexOf(self.filter) !== -1);
			}

			return items;
		},
		changeFilter(filter) {
			// Check the current filter, if the same one is clicked it's considered a reset
			// TODO Add a reset filter button for a better use case
			if (filter === self.filter) {
				self.filter = '';
			} else {
				self.filter = filter;
			}
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
				tags: self.extractTags(userTodoInput)
            });

            self.updateTags()
        },
		updateTags() {
			// Reset our array store, and crawl our store again.
			// TODO : Would be a good place to add / remove items that have been updated
			self.allTags = [];

			self.items.forEach(item => {
				if (item.tags) {
					self.allTags.push(item.tags)
				}
			});
			// Flatten the array and create a new set with the data (this will force uniqueness)
			self.allTags = [...new Set(self.allTags.flat(1))];
		},
		extractTags(userTodoInput) {
			return userTodoInput.match(/(?<=#)\S+/g);
		},
		editItem(id, value) {
			const item = self.items.find(i => i.id === id);
			item.name = value;
			item.tags = self.extractTags(value);

			self.updateTags();
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

			self.updateTags();
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
