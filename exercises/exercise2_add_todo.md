# Exercise 2 - TodoAngularTest
The objective is to create a workflow using the sample ToDoMVC.com Angular app.

1. Navigate to ToDoMVC.com
2. Click the AngularJS ToDo implementation
3. Verify the page transition
4. Add a ToDo entry
5. Verify that the entry was created
6. Mark the entry completed
7. Clear the ToDo list (get ready for next run)

# Selectors & Urls

* `http://todomvc.com/` base url
* `http://todomvc.com/examples/angularjs/#/` - the angularJS implementation

* `\uE007` - CR (<enter>) key press

* `#new-todo` - the input field
* `//*[contains(@ng-repeat,'todo in todos ') and descendant-or-self::*[text()='${todoValue}']]` - verify that the new todo was created (replace todoValue appropriately)
* `//section[@id='main']//input[@id='toggle-all']` - Mark all complete
* `//button[@id='clear-completed']` - Clear all, only visible if there are outstanding ToDos