const { BrowserUtils, Reporter } = require("wdio-allure-ts");
const ToDoItem = require('./todo-item');
const Button = require('./widgets/Button');
const CheckBox = require('./widgets/CheckBox');
const TextBox = require('./widgets/TextBox');

const TODO_ANGULAR_URL = "http://todomvc.com/examples/angularjs/#/";
const NEW_TODO_TEXTBOX_SELECTOR = "//input[@id='new-todo']";

/**
 * TODOmvc Angular page functionality
 */
class TodoAngularPage {
    /**
     * Navigate to the page
     */
    static navigate(){
        return BrowserUtils.navigateToUrl(TODO_ANGULAR_URL);
    }

    /**
     * Add new todo item
     */
    static addNewToDo(value) {
        return new TextBox(NEW_TODO_TEXTBOX_SELECTOR).addValue(value);
    }

    /**
     * Get Todo by it text value
     * @param todoValue Todo item's string
     */
    static todo(todoValue){
        return new ToDoItem(todoValue);
    }

    /**
     * Remove all todo from list
     */
    static removeAll(){
        Reporter.debug("Click toggle all check box");
        TodoAngularPage.toggleAllCheckBox().click();
        TodoAngularPage.clearCompletedButton().click();
    }

    /**
     * Validate list is empty
     */
    static expectListEmpty(){
        return TodoAngularPage.clearCompletedButton().notVisible();
    }

    /**
     * Toggle all checkbox
     */
    static toggleAllCheckBox(){
        return new CheckBox("//section[@id='main']//input[@id='toggle-all']");
    }

    /**
     * Clear all button
     */
    static clearCompletedButton(){
        return new Button("//button[@id='clear-completed']");
    }
}
module.exports = TodoAngularPage;