// import { useState } from "react";

function TodoInput() {
    console.log("pass");
    return (
        <form>
            <input type="text" placeholder="Add a new task..." />
            <input type="date" />
            <button type="submit">Add</button>
        </form>
    );
}

export default TodoInput;