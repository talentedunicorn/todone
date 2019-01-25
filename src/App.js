import React, { Component } from 'react';
import TodoList from './components/TodoList'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      notification: {},
      todo: ""
    }
  }

  toggleDone = (id) => {
    const prevTodos = this.state.todos
    this.setState({
      todos: prevTodos.map(todo => {
        if (todo.id === id) {
          todo.done = !todo.done
        }

        return todo 
      })
    })
  }

  deleteTodo = (id) => {
    const prevTodos = [...this.state.todos]
    this.setState({
      todos: prevTodos.filter((todo) => todo.id !== id)
    })
    this.setNotification({ msg: "Deleted successfully", class: "success" })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // Validate and sanitize
    let title = this.state.todo.trim()
    if (title.length <= 0) {
      this.setNotification({ msg: "Todo can not be blank", class: "error" })
      return false
    }
    
    // Add to state
    this.setState((state) => {
      return {
        todos: [...state.todos, {
          title,
          done: false,
          id: `todo_${new Date().getTime()}`
        }]
      }
    })
    
    // Clear input
    this.clearNotification()
  }
  
  handleInputChange = (e) => this.setState({ todo: e.target.value })

  get incompleteTodos() {
    return this.state.todos.filter(todo => todo.done === false)
  }

  get completedTodos() {
    return this.state.todos.filter(todo => todo.done)
  }

  setNotification = (notification) => {
    this.setState({ 
      notification
    })
  }

  clearNotification = (e) => this.setState({ notification: {} })

  render() {
    return (
      <React.Fragment>
        { Object.keys(this.state.notification).length > 0 && (<p className={ "App-notification " + (this.state.notification.class ? this.state.notification.class : '') } onClick={ this.clearNotification }>{ this.state.notification.msg }</p>) }
        <header className="App-header">
          <h1 className="App-heading">To do</h1>
        </header>
        <main>
          <h2 className="App-heading">Incomplete</h2>
          <TodoList todos={ this.incompleteTodos } 
            onDeleteTodo={ this.deleteTodo }
            onToggleDone={ this.toggleDone }></TodoList>

          { this.completedTodos.length > 0 && (
            <React.Fragment>
            <h2 className="App-heading">Completed</h2>
            <TodoList todos={ this.completedTodos } 
              onDeleteTodo={ this.deleteTodo }
              onToggleDone={ this.toggleDone }></TodoList>
            </React.Fragment>
          )}
        </main>
        <footer>
          <form className="App-form" onSubmit={ this.handleSubmit }>
            <label>
              <span>title</span>
              <input type="text" name="title" onChange={ this.handleInputChange } />
            </label>
            <button>Add</button>
          </form>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
