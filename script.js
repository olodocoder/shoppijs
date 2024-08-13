// global variables
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// add item func
function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === '') {
    alert('please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert(`${newItem} already exists`);
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  itemInput.value = '';
  checkUI();
}
// add item to dom helper
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createBtn('remove-item btn-link text-red');
  li.appendChild(button);
  itemList.appendChild(li);
}
// add item to storage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
// create button
function createBtn(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcn('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}
//create icon
function createIcn(classes) {
  const icn = document.createElement('i');
  //   icn.appendChild(document.createTextNode('X'));
  icn.className = classes;
  return icn;
}
// remove item
function removeItem(item) {
  if (confirm(`are you sure you want to remove ${item.textContent}?`)) {
    item.remove();
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}
//
function removeItemFromStorage(item) {
  console.log(item);
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  console.log(itemsFromStorage);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  console.log('hello');
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  itemInput.value = item.textContent;
  formBtn.style.backgroundColor = '#228b22';
}
// clear all items
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
}
// check ui for items
function checkUI() {
  itemInput.value = '';
  const items = document.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    filter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>  Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}
//filter items
function filterItems(e) {
  const items = document.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function getItemsFromStorage(params) {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function init() {
  // event listeners
  itemForm.addEventListener('submit', addItem);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  filter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  // call check ui for items
  checkUI();
}

init();
