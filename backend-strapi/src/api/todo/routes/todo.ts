export default {
    routes: [
      { method: "GET", path: "/todos", handler: "todo.find" },
      { method: "GET", path: "/todos/:id", handler: "todo.findOne" },
      { method: "POST", path: "/todos", handler: "todo.create" },
      { method: "PUT", path: "/todos/:id", handler: "todo.update" },
      { method: "DELETE", path: "/todos/:id", handler: "todo.delete" },
    ],
  };
  
  