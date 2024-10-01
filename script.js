let tasks = [];

// Login function
function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        loadTodoList(username);
    } else {
        alert('Please enter a username.');
    }
}

// Load the to-do list for the logged-in user
function loadTodoList(username) {
    tasks = JSON.parse(localStorage.getItem(`${username}-todoList`)) || [];
    document.getElementById('login').style.display = 'none';
    document.getElementById('todo-app').style.display = 'block';
    document.getElementById('welcome').innerText = `Welcome, ${username}`;
    renderTasks();
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('task-input').value.trim();
    const taskTime = parseInt(document.getElementById('task-time').value, 10);

    if (taskInput && taskTime) {
        const currentTime = Date.now();
        const endTime = currentTime + taskTime * 60 * 1000; // Convert minutes to milliseconds
        tasks.push({ text: taskInput, completed: false, endTime });
        saveTodoList();
        renderTasks();
        document.getElementById('task-input').value = ''; // Clear input field
        document.getElementById('task-time').value = ''; // Clear time field
    } else {
        alert('Please enter a task and a valid time.');
    }
}

// Save the to-do list in localStorage
function saveTodoList() {
    const username = localStorage.getItem('username');
    localStorage.setItem(`${username}-todoList`, JSON.stringify(tasks));
}

// Render tasks with buttons and timers
function renderTasks() {
    const taskContainer = document.getElementById('tasks');
    taskContainer.innerHTML = ''; // Clear previous tasks

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.classList.toggle('completed', task.completed);

        const taskText = document.createElement('span');
        taskText.innerText = task.text;
        taskElement.appendChild(taskText);

        // Timer display
        const timer = document.createElement('span');
        timer.className = 'timer';
        updateTimer(timer, task.endTime, index);
        taskElement.appendChild(timer);

        // Complete button
        const completeButton = document.createElement('button');
        completeButton.innerText = task.completed ? 'Undo' : 'Complete';
        completeButton.onclick = () => toggleTaskCompletion(index);
        taskElement.appendChild(completeButton);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteTask(index);
        taskElement.appendChild(deleteButton);

        taskContainer.appendChild(taskElement);
    });

    updatePercentageTracker();
}

// Update task timer
function updateTimer(timerElement, endTime, index) {
    const interval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = endTime - currentTime;

        if (timeLeft <= 0) {
            clearInterval(interval);
            timerElement.innerText = 'Time expired';
            tasks[index].completed = true;
            saveTodoList();
            renderTasks();
        } else {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timerElement.innerText = `${minutes}m ${seconds}s left`;
        }
    }, 1000);
}

// Toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTodoList();
    renderTasks();
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTodoList();
    renderTasks();
}

// Update the percentage tracker
function updatePercentageTracker() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('percentage-tracker').innerText = `${percentage.toFixed(2)}% Completed`;
}

// Logout function
function logout() {
    localStorage.removeItem('username');
    document.getElementById('todo-app').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Load the stored username and to-do list on page load
window.onload = function() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        loadTodoList(storedUsername);
    }
};
