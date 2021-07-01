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
				<input
					id="addItemsInput"
					onKeyUp={(e) => store.processCreationInput(e.target.value, e)}
					placeholder="Type in Todo and hit enter - hashtags create #filters automatically"
				/>
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
            </section>
			<section>
				<h2 className="completedTitle">Filter By Tag(s)</h2>
				{store.allTags.map(tag => (
					<button className={`btn btn-large ${store.filter === tag ? 'activeFilter' : ''}`} onClick={() => store.changeFilter(tag)}>{tag}</button>
				))}
				{store.filter &&
				<button className="btn btn-danger btn-large" onClick={() => store.resetFilter()}>Reset Filter</button>
				}
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
			name: "Ensure git commits are accurate! #Clean-Up",
			status: 'started',
			tags: ["Clean-Up"]
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
            return self.applyFilterToItems(self.items.filter(i => i.status !== 'completed'));
        },
        get completedItems() {
        	// TODO move started (or status) to constant
            return self.applyFilterToItems(self.items.filter(i => i.status === 'completed'));
        },

		changeFilter(filter) {
			// Check the current filter, if the same one is clicked it's considered a reset
			if (filter === self.filter) {
				self.resetFilter();
			} else {
				self.filter = filter;
			}
		},
		resetFilter() {
			self.filter = '';
		},
		processCreationInput(userInput, keyEvent) {
        	if (keyEvent.key && keyEvent.key === 'Enter') {
        		const newItem = self.addItem(userInput);
        		// Clear out the text box
				keyEvent.target.value = '';

				self.addLoggerItem('ITEM_ADDED', {item: newItem});
			}
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
        	const deletedItem = self.items.find(i => i.id === id);

			self.addLoggerItem('ITEM_REMOVED', {item: deletedItem});
        	self.items.splice(itemIndex,1);
			self.updateTagStore();
		},

		/* Helper functions rather then store functions.  Not sure if they go here or somewhere else. */

		// updateTagStore resets all of our tags in our store, crawls the todo list items, captures the tags and
		// compares the previous tag array to the new tag array for logging purposes
		updateTagStore() {
			// TODO : Instead of resetting the whole array, look at a better solution to only act on changes
			const previousTags = self.allTags;
			self.allTags = [];

			self.items.forEach(item => {
				if (item.tags) {
					self.allTags.push(item.tags)
				}
			});

			// Flatten the array and create a new set with the data (this will force uniqueness)
			self.allTags = [...new Set(self.allTags.flat(1))];

			// Find any tags that have been removed and then log tem
			previousTags.filter(function(v) {
				return self.allTags.indexOf(v) === -1;
			}).forEach((value) => {
				self.addLoggerItem('TAG_REMOVED', {tag: value});
			});

			// Find any tags that have been added and then log tem
			self.allTags.filter(function(v) {
				return previousTags.indexOf(v) === -1;
			}).forEach((value) => {
				self.addLoggerItem('TAG_ADDED', {tag: value});
			});
		},
		extractTags(userTodoInput) {
			return userTodoInput.match(/(?<=#)\S+/g);
		},
		addLoggerItem(type, data) {
			self.logger.push({type: type, data: data});
		},
		applyFilterToItems(items) {
			if (self.filter) {
				items = items.filter(i => i.tags && i.tags.indexOf(self.filter) !== -1);
			}

			return items;
		},
    })

    return self;
}

export default styled(observer(TodoList))`
  	margin: auto;
	width: 80%;
  	font-family: 'Roboto', sans-serif;
	background-color: rgb(245, 249, 250);
	padding: 20px;

    h2, h1 {
    	background-color: rgb(219, 249, 255);
    	color: rgb(0, 114, 158);
    	text-align: center;
    	padding: 5px;
    }
    #addItemsInput {
    	width: 100%;
    	height: 50px;
    	margin: 10px 0;
    	font-size: 1.25em;
		box-sizing: border-box;
		padding-left: 15px;
		border: 2px solid rgb(0, 114, 158);
    }
	.btn {
		width: 100%;
		border-radius: 5px;
		border: none;
		margin: 5px;
		cursor:pointer;
	}
	.btn-large {
		padding: 5px;
	}
	.btn-primary {
		background-color: rgb(0, 114, 158);
		color: white;
	}
	.btn-success {
		background-color: #198754;
		color: white;
	}
	.btn-danger {
		background-color: #c9302c;
		color: white;
	}
	.activeFilter {
		background-color: rgb(25, 135, 84);
		color: white;
	}
`
