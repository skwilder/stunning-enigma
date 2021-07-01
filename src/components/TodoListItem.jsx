import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import EdiText from 'react-editext';
import { faTrashAlt, faCheckCircle, faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TodoListItem({ className, item, onComplete, onDelete, onProgressUpdate, onEdit }) {
    return (
        <div className={`${className}`}>
			<div className={`todoItemWrapper ${item.status}`}>
				<EdiText className="todoText" type="text" value={item.name} onSave={onEdit} buttonsAlign="before"/>
				<div className="todoActions">
					<button class="btn btn-primary" title="Start" onClick={onProgressUpdate}><FontAwesomeIcon icon={faTasks} size="md"/></button>
					{item.status === 'started' &&
						<button class="btn btn-success" title="Complete" onClick={onComplete}><FontAwesomeIcon icon={faCheckCircle} size="md"/></button>
					}
					<button class="btn btn-danger" title="Delete" onClick={onDelete}><FontAwesomeIcon icon={faTrashAlt} size="md"/></button>
				</div>
			</div>
        </div>
    )
}

export default styled(observer(TodoListItem))`
	padding: 5px;
	background-color: rgb(245, 249, 250);
	margin: 10px;
	justify-content: space-between;

	@keyframes started {
	  from {
		background-color: rgb(0, 114, 158, 0.5);
		border: 2px solid rgb(0, 114, 158);
	  }
	  to {
		background-color: rgb(25, 135, 84, 0.5);
		border: 2px solid rgb(25, 135, 84);
	  }
	}
	@keyframes new {
	  from {
		background-color: rgb(25, 135, 84, 0.5);
		border: 2px solid rgb(25, 135, 84);
	  }
	  to {
		background-color: rgb(0, 114, 158, 0.5);
		border: 2px solid rgb(0, 114, 158);
	  }
	}
	.todoItemWrapper {
	  display: flex;
	}
	.todoText {
		width: 75%;
		padding: 10px;
	}
	.todoActions {
		display: flex;
		width: 20%;
	}
	.new {
		background-color: rgb(0, 114, 158, 0.5);
		border: 2px solid rgb(0, 114, 158);
	    animation-name: new;
  		animation-duration: 1s;
	}
	.started {
		background-color: rgb(25, 135, 84, 0.5);
		border: 2px solid rgb(25, 135, 84);
		animation-name: started;
  		animation-duration: 1s;
	}
`
