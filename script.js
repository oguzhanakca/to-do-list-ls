let newEntry = document.getElementById("entry");
let form = document.getElementById("form");
let onGoingTasksList = document.getElementById("tasks");
let completedTasksList = document.getElementById("completed-tasks-list");
let onGoingFilter = document.getElementById("ongoing-filter");
let completedFilter = document.getElementById("completed-filter");

let onGoingTasks;
let completedTasks;

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTask);
  window.addEventListener("load", getTasksFromLocalStorage);
  onGoingTasksList.addEventListener("click", changeStatusOfTask);
  completedTasksList.addEventListener("click", removeCompletedTaskFromUI);
  onGoingFilter.addEventListener("keyup", filterTasks);
  completedFilter.addEventListener("keyup", filterCompletedTasks);
}

function filterTasks(e) {
  let filterText = e.target.value;
  let filteredTasks = [];
  onGoingTasks.forEach((task) => {
    if (task.name.toLowerCase().includes(filterText.toLowerCase())) {
      filteredTasks[filteredTasks.length] = task;
    }
  });
  addOnGoingTaskToUI(filteredTasks);
}

function filterCompletedTasks(e) {
  let filterText = e.target.value;
  let filteredTasks = [];
  completedTasks.forEach((task) => {
    if (task.name.toLowerCase().includes(filterText.toLowerCase())) {
      filteredTasks[filteredTasks.length] = task;
    }
  });
  addCompletedTaskToUI(filteredTasks);
}

function removeCompletedTaskFromUI(e) {
  if (e.target.className.includes("fa-circle-xmark")) {
    let currentTask =
      e.target.parentElement.parentElement.firstChild.textContent;
    let index = 0;
    completedTasks.forEach((task) => {
      if (task.name === currentTask.trim()) {
        completedTasks.splice(index, 1);
      }
      index++;
    });
    localStorage.setItem("completed", JSON.stringify(completedTasks));
  }
  addCompletedTaskToUI();
}

function addOnGoingTaskToUI(tasks) {
  onGoingTasksList.innerHTML = "";
  tasks.forEach((task) => {
    let newTaskUI = `<li class="task">
    ${task.name}
    <span class="status"
      ><i class="fa-solid fa-circle-check"></i>
      <i class="fa-solid fa-circle-xmark"></i>
    </span>
    <span class="date">${task.date}</span>
  </li>`;
    onGoingTasksList.insertAdjacentHTML("beforeend", newTaskUI);
  });
}

function addCompletedTaskToUI(tasks) {
  completedTasksList.innerHTML = "";
  tasks.forEach((task) => {
    let newTaskUI = `<li class="task">
    ${task.name}
    <span class="status"
      >
      <i class="fa-solid fa-circle-xmark"></i>
    </span>
    <span class="date">${task.date}</span>
  </li>`;
    completedTasksList.insertAdjacentHTML("beforeend", newTaskUI);
  });
}

function changeStatusOfTask(e) {
  if (e.target.className.includes("fa-circle-xmark")) {
    let currentTask =
      e.target.parentElement.parentElement.firstChild.textContent;
    let index = 0;
    onGoingTasks.forEach((task) => {
      if (task.name === currentTask.trim()) {
        onGoingTasks.splice(index, 1);
      }
      index++;
    });
    localStorage.setItem("todos", JSON.stringify(onGoingTasks));
    addOnGoingTaskToUI(onGoingTasks);
  }
  if (e.target.className.includes("fa-circle-check")) {
    let currentTask =
      e.target.parentElement.parentElement.firstChild.textContent;
    let index = 0;
    let completedTask;
    onGoingTasks.forEach((task) => {
      if (task.name === currentTask.trim()) {
        completedTask = onGoingTasks.splice(index, 1);
      }
      index++;
    });
    //completedTask[0].date = new Date().toLocaleDateString();
    completedTasks[completedTasks.length] = completedTask[0];
    localStorage.setItem("completed", JSON.stringify(completedTasks));
    localStorage.setItem("todos", JSON.stringify(onGoingTasks));
    addOnGoingTaskToUI(onGoingTasks);
    addCompletedTaskToUI(completedTasks);
  }
}

function getTasksFromLocalStorage() {
  getOnGoingTasksFromStorage();
  getCompletedTasksFromStorage();
}

function getOnGoingTasksFromStorage() {
  if (localStorage.getItem("todos")) {
    onGoingTasks = JSON.parse(localStorage.getItem("todos"));
  } else {
    onGoingTasks = [];
  }
  addOnGoingTaskToUI(onGoingTasks);
}

function getCompletedTasksFromStorage() {
  if (localStorage.getItem("completed")) {
    completedTasks = JSON.parse(localStorage.getItem("completed"));
  } else {
    completedTasks = [];
  }
  addCompletedTaskToUI(completedTasks);
}

function addTask(e) {
  let task = newEntry.value;
  let date = new Date().toLocaleDateString();
  let alreadyOnGoing = false;
  let alreadyCompleted = false;
  newEntry.value = "";
  onGoingTasks.forEach((element) => {
    if (task == element.name) {
      alreadyOnGoing = true;
    }
  });
  completedTasks.forEach((element) => {
    if (task == element.name) {
      alreadyCompleted = true;
    }
  });

  if (!(alreadyCompleted || alreadyOnGoing)) {
    onGoingTasks[onGoingTasks.length] = { name: task, date: date };
    localStorage.setItem("todos", JSON.stringify(onGoingTasks));
  }
  alreadyCompleted = false;
  alreadyOnGoing = false;
  addOnGoingTaskToUI(onGoingTasks);
  e.preventDefault();
}
