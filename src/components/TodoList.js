import React, { Component } from "react";

class TodoList extends Component {
  render() {
    let view

    if (this.props.todos.length > 0) {
      view = (
        <ul className="Todo-list">
          {
            this.props.todos && this.props.todos.map(todo => ( 
              <li className="Todo" 
                key={todo.id} 
                data-done={ todo.done }>
                <span className="Todo-title"
                  onClick={ event => { this.props.onToggleDone(todo.id) }} >{ todo.title }</span>
                <button onClick={ event => { this.props.onDeleteTodo(todo.id) }}>Delete</button>
              </li> 
            ))
          }
        </ul>
      )
    } else {
      view = <p className="Todo-placeholder">No items found, add an item.</p>
    }

    return view
  }
}

export default TodoList;
