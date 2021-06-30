import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { observable } from 'mobx';
import { v4 as uuid} from 'uuid';

import TodoListItem from './TodoListItem'
import TodoListLogger from './TodoListLogger'

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
				<h2 className="completedTitle">Item(s) History</h2>
				<ul>
					{store.logger.map(logger => (
						<TodoListLogger
							logger={logger}
						/>
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
		logger: [],
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
        		const newItem = self.addItem(userInput);
        		// Clear out the text box
				keyEvent.target.value = '';

				self.addLoggerItem('ITEM_ADDED', {item: newItem});
			}
		},
		addLoggerItem(type, data) {
			self.logger.push({type: type, data: data});
		},
        addItem(userTodoInput) {
			const newItem = {
				id: uuid(),
				name: userTodoInput,
				status: `new`,
				tags: self.extractTags(userTodoInput)
			};

            self.items.push(newItem);
            self.updateTagStore()

			return newItem;
        },
		updateTagStore() {
			// Reset our array store, and crawl our store again.
			// TODO : Instead of resetting the whole array, look at a better solution to only act on changes
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

			self.addLoggerItem('ITEM_UPDATED', {item: item});
			self.updateTagStore();
		},
        setCompleted(id) {
            const item = self.items.find(i => i.id === id);
            item.status = 'completed';
			self.addLoggerItem('STATUS_UPDATE', {item: item});
        },
		setTaskStatus(id) {
			const item = self.items.find(i => i.id === id);

			// TODO: Fix state toggling, this is crude
			if (item.status === 'new') {
				item.status = 'started';
				self.addLoggerItem('STATUS_UPDATE', {item: item, status: 'started'});
			} else if (item.status === 'started') {
				item.status = 'new';
				self.addLoggerItem('STATUS_UPDATE', {item: item, status: 'new'});
			}
		},
		deleteItem(id) {
        	const itemIndex = self.items.findIndex(i => i.id === id);

			self.addLoggerItem('ITEM_REMOVED', {item: self.items.find(i => i.id === id)});
        	self.items.splice(itemIndex,1);
			self.updateTagStore();
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
