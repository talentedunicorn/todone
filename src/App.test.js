import React from 'react'
import App from './App'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { todos, notification } from './data'


const defaultState = { todos, notification: {}, todo: "" }

describe('App.js', () => {
  const wrapper = shallow(<App/>)

  it('renders without crashing', () => {
    const wrapper = renderer.create(<App />)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should have correct state', () => {
    expect(wrapper.state()).toEqual({ todos: [], notification: {}, todo: "" })
  })

  describe('Notification', () => {
    const className = ".App-notification"

    it('should be able to display notification', () => {
      const Notification = wrapper.find(className)

      // Check notification is clear
      expect(wrapper.state().notification).toEqual({})
      // Set test notification
      wrapper.instance().setNotification(notification)
      // Check for notification
      expect(wrapper.find(className)).toHaveLength(1)
    })

    it('should be able to clear notification', () => {
      wrapper.setState({ notification })
      // Check if notification is visible
      expect(wrapper.find(className)).toHaveLength(1)
      // Trigger close
      wrapper.find(className).simulate('click')
      expect(wrapper.find(className)).toHaveLength(0)
    })
  })

  describe('Todo', () => {
    beforeEach(() => {
      wrapper.setState(defaultState)
    })

    it('should be able to delete todo', () => {
      const todoId = todos[0].id
      expect(wrapper.state().todos).toHaveLength(todos.length)

      wrapper.instance().deleteTodo(todoId)
      expect(wrapper.state().todos).toHaveLength(todos.length - 1)
    })

    it('should be able to toggle todo done status', () => {
      const todoId = todos[0].id
      wrapper.instance().toggleDone(todoId)
      expect(wrapper.state().todos.filter(t => t.id === todoId)[0].done).toBe(true)
      wrapper.instance().toggleDone(todoId)
      expect(wrapper.state().todos.filter(t => t.id === todoId)[0].done).toBe(false)
    })
  })

  describe('Form', () => {
    const fakeEvent = { preventDefault: () => 'I is fake event' }
    const form = wrapper.find('.App-form')

    it('should not be able to add empty todo', () => {
      form.simulate('submit', fakeEvent)
      expect(wrapper.find('.App-notification').text()).toBe("Todo can not be blank")
    })

    it('should be able to add todo', () => {
      const testTask = "Test task"
      form.find('input').simulate('change', { target: { value: testTask } })
      form.simulate('submit', fakeEvent)

      expect(wrapper.state().todos).toHaveLength(todos.length + 1)
    })
  })
})
