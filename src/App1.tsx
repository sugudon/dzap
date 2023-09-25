import React from 'react';

import TodoList from './components/TodoList';

const App: React.FC = () => {
  const todos = [{id: 't1', text: 'Sample Text'}]
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <TodoList items={todos} /> 
    </div>
  );
}

export default App;
