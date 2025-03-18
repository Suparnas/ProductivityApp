module.exports = {
    async beforeCreate(event) {
      const { data } = event.params;
      const today = new Date().toISOString().split("T")[0]; // Define today inside the function
  
      if (data.DueDate && data.DueDate < today) {
        throw new Error("Due date cannot be in the past.");
      }
    },
  
    async beforeUpdate(event) {
      const { data } = event.params;
      const today = new Date().toISOString().split("T")[0]; // Define today inside the function
  
      if (data.DueDate && data.DueDate < today) {
        throw new Error("Due date cannot be in the past.");
      }
    }
  };
  