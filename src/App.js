import React, { Component } from 'react';
import TodoList from './components/TodoList'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      error: ""
    }
  }

  toggleDone = (id) => {
    const prevTodos = this.state.todos
    this.setState({
      todos: prevTodos.map(todo => {
        if (todo.id === id) {
          todo.id = `todo_${new Date().getTime()}`
          todo.done = !todo.done
        }

        return todo 
      })
    })
  }

  deleteTodo = (id) => {
    this.setState({
      todos: this.state.todos.filter((todo) => todo.id !== id)
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setError("")
    // Validate and sanitize
    let title = this.titleInput.value.trim()
    if (title.length <= 0) {
      this.setError("Todo can not be blank")
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
    this.titleInput.value = ''
  }

  get incompleteTodos() {
    return this.state.todos.filter(todo => todo.done === false)
  }

  get completedTodos() {
    return this.state.todos.filter(todo => todo.done)
  }

  setError = (err) => {
    this.setState({ 
      error: err
    })
  }

  render() {
    return (
      <React.Fragment>
        { this.state.error.length > 0 && (<p className="Error" onClick={(e) => { this.setError("") }}>{ this.state.error }</p>) }
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
              <input type="text" name="title" ref={e => this.titleInput = e }/>
            </label>
            <button>Add</button>
          </form>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
