// ****** SELECT ITEMS **********
const alertMessage = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const groceryContainer = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
//submit form
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);
//load items
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        createListItem(id, value);
        displayAlert("Item added to the list", "success");
        groceryContainer.classList.add("show-container");
        addToLocalStorage(id, value);
        setBackToDefault();
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        editLocalStorage(editId, value);
        setBackToDefault();
    } else {
        displayAlert("Please enter value", "danger");
        console.log("empty value");
    }
}

// display alert
function displayAlert(text, action) {
    alertMessage.innerText = text;
    alertMessage.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(() => {
        alertMessage.innerText = "";
        alertMessage.classList.remove(`alert-${action}`);
    }, 1000);
}

//clear items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");

    if (items.length > 0) {
        items.forEach((item) => {
            groceryList.removeChild(item);
        });
    }

    groceryContainer.classList.remove("show-container");
    displayAlert("cleared list", "danger");
    setBackToDefault();

    localStorage.removeItem("list");
}

//delete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    groceryList.removeChild(element);

    if (groceryList.children.length === 0) {
        groceryContainer.classList.remove("show-container");
    }
    displayAlert("Item removed", "danger");
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
//edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.innerText = "edit";
}

//set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.innerText = "Submit";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}
// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        });
    }

    groceryContainer.classList.add("show-container");
}

function createListItem(id, value) {
    const element = document.createElement("article");
    element.classList.add("grocery-item");
    element.setAttribute("data-id", `${id}`);
    element.innerHTML = `
                    <p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;

    groceryList.appendChild(element);
    const deleteBtn = document.querySelector(".delete-btn");
    const editBtn = document.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
}
