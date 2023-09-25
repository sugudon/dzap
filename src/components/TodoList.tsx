import React from 'react'

interface TodoListProps {
    items: {id: string, text: string}[]
}

const TodoList: React.FC<TodoListProps> = ({items}) => {
    // const todos = [{id: 't1', text: 'Sample'}]
  return (
    <ul className="list-disc">
    {
        items.map(td => <li key={td.id}>{td.text}</li>)
    }
    </ul>
  )
}

export default TodoList;