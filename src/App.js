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
    // let prevTodos = [...this.state.todos]
    // let todoIndex = this.state.todos.findIndex((todo) => todo.id === id)

    // this.setState({
    //   todos: [...prevTodos.slice(0, todoIndex), ...prevTodos.slice(todoIndex)] 
    // })
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
          <h1>To do</h1>
        </header>
        <main>
          <TodoList todos={ this.state.todos } 
            onDeleteTodo={ this.deleteTodo }
            onToggleDone={ this.toggleDone }></TodoList>
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
