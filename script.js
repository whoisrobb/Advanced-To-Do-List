const menuClose = document.querySelector('.menu-close')
const listContainer = document.querySelector('.list-container')
const menu = document.querySelector('.menu')
const taskContainer = document.querySelector('.task-container')
const listsContainer = document .querySelector('[data-lists]')
const newListForm = document.querySelector("[data-new-list-form]")
const newListInput = document.querySelector("[data-new-list-input]")
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')

// menu toggle section
function goIntoTasks() {
  listContainer.setAttribute('aria-expanded', false)
}

function outtaTasks() {
  listContainer.setAttribute('aria-expanded', true)
}

menu.addEventListener('click', outtaTasks)

menuClose.addEventListener('click', goIntoTasks)

// storing in local storage
const LOCAL_STORAGE_LIST_KEY = 'task.list'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


listsContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
      goIntoTasks()
    }
})

tasksContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        saveAndRender()
    }
})

deleteListButton.addEventListener('click', (e) => {
    const last = lists.findIndex(list => list.id === selectedListId)
    lists = lists.filter(list => list.id !== selectedListId)
    
    if (last === 0 && lists.length > 0) {
        selectedListId = lists[0].id
    } else if (last !== 0) {
        selectedListId = lists[last - 1].id
    } else {
        selectedListId = null
    }


    saveAndRender()
})

newListForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createListItem(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createTask(name) {
    return {name: name, id: Date.now().toString(), complete: false}
}

function createListItem(name) {
    return {name: name, id: Date.now().toString(), tasks: []}
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
    clearElement(listsContainer)

    // creating the list element
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId === null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
    }

    clearElement(tasksContainer)
    renderTasks(selectedList)
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('item')
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listElement.innerText = list.name
        listsContainer.appendChild(listElement)
    })
}

function saveAndRender() {
    save()
    render()
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()