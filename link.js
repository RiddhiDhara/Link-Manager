// ==============================================================================login section===================================================

let currentUser = null;

function hashPassword(password) {
  // Implement a secure hashing algorithm here
  return password;
}

function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = hashPassword(document.getElementById('password').value);

  if (!localStorage.getItem('username')) {
    // First visit, store username and hashed password
    localStorage.setItem('username', username);
    localStorage.setItem('hashedPassword', password);
    showMainContainer(username);
  } else {
    // Subsequent visits, check if password matches
    const storedUsername = localStorage.getItem('username');
    const storedHashedPassword = localStorage.getItem('hashedPassword');
    if (password === storedHashedPassword && username === storedUsername) {
      showMainContainer(storedUsername);
    } else {
      alert('Incorrect Entry');
    }
  }
}

function showMainContainer(username) {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('mainContainer').style.display = 'block';
  currentUser = username;
  updateLinkTable();
  updateRecentLinks();
}

// ==============================================================================end of login section=============================================

// ===================================save link function

function saveLink() {
  if (!currentUser) return;

  const url = document.getElementById('url').value;
  const name = document.getElementById('name').value;
  const dateTime = new Date().toLocaleString();

  const link = { url, name, dateTime };

  let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];
  userLinks.push(link);
  localStorage.setItem(currentUser, JSON.stringify(userLinks));

  updateLinkTable();
  updateRecentLinks();

  document.getElementById('url').value = '';
  document.getElementById('name').value = '';
}

// ==================================deletelink function

function deleteLink(index) {
  if (!currentUser) return;

  let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];
  let deletedLink = userLinks[index];

  userLinks.splice(index, 1);
  localStorage.setItem(currentUser, JSON.stringify(userLinks));

  // Update the recent links section
  let recentLinks = JSON.parse(localStorage.getItem(`${currentUser}_recent`)) || [];
  recentLinks = recentLinks.filter(link => link.url !== deletedLink.url);
  localStorage.setItem(`${currentUser}_recent`, JSON.stringify(recentLinks));

  updateLinkTable();
  updateRecentLinks();
}

// ==============================update link table()

function updateLinkTable() {
  if (!currentUser) return;

  const tableBody = document.getElementById('linkTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];

  userLinks.forEach((link, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${link.dateTime}</td>
      <td>${link.name}</td>
      <td><a href="${link.url}" target="_blank">${link.url}</a></td>
      <td><button class="action-button" onclick="deleteLink(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// =========================================checking username on page load

// Check if username exists in localStorage on page load
if (localStorage.getItem('username')) {
  const storedUsername = localStorage.getItem('username');
  const storedHashedPassword = localStorage.getItem('hashedPassword');
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('mainContainer').style.display = 'none';
} else {
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('mainContainer').style.display = 'none';
}

// =====================================searchlink function

function searchLinks(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  if (searchTerm.trim() === '') {
    // Remove all highlights if the search input is empty
    const tableRows = document.querySelectorAll('#linkTable tbody tr');
    tableRows.forEach(row => {
      row.classList.remove('highlighted');
    });
    return;
  }

  const tableRows = document.querySelectorAll('#linkTable tbody tr');

  tableRows.forEach(row => {
    const linkName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
    if (linkName.includes(searchTerm)) {
      row.classList.add('highlighted');
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      row.classList.remove('highlighted');
    }
  });
}

// ==========================filter

document.querySelectorAll('.filter_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sortOrder = btn.dataset.sortOrder;
    sortLinks(sortOrder);
  });
});

document.getElementById('searchForm').addEventListener('submit', searchLinks);

// ======================== filter active function

let marker = 0;

function active_func1(marker){

      document.getElementById("filtering1").style.backgroundColor = "aquamarine";
      document.getElementById("filtering2").style.backgroundColor = "white";
      document.getElementById("filtering3").style.backgroundColor = "white";
      document.getElementById("filtering4").style.backgroundColor = "white";
}

function active_func2(marker){

      document.getElementById("filtering1").style.backgroundColor = "white";
      document.getElementById("filtering2").style.backgroundColor = "aquamarine";
      document.getElementById("filtering3").style.backgroundColor = "white";
      document.getElementById("filtering4").style.backgroundColor = "white";
}

function active_func3(marker){

      document.getElementById("filtering1").style.backgroundColor = "white";
      document.getElementById("filtering2").style.backgroundColor = "white";
      document.getElementById("filtering3").style.backgroundColor = "aquamarine";
      document.getElementById("filtering4").style.backgroundColor = "white";
}

function active_func4(marker){

      document.getElementById("filtering1").style.backgroundColor = "white";
      document.getElementById("filtering2").style.backgroundColor = "white";
      document.getElementById("filtering3").style.backgroundColor = "white";
      document.getElementById("filtering4").style.backgroundColor = "aquamarine";
}

// ========================================== updated sortlinks function

function sortLinks(sortOrder) {
  let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];

  switch (sortOrder) {
    case 'nameAsc':
      userLinks.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nameDesc':
      userLinks.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'dateDesc':
      userLinks.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      break;
    case 'dateAsc':
      userLinks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      break;
  }

  // Save the sorted userLinks to localStorage
  localStorage.setItem(currentUser, JSON.stringify(userLinks));

  updateLinkTable(userLinks);
}

// ======================================updated recent links function

function updateRecentLinks() {
  if (!currentUser) return;

  const recentLinksList = document.getElementById('recentLinks');
  recentLinksList.innerHTML = '';

  let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];
  userLinks.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  let recentLinks = userLinks.slice(0,4);
  // const recentLinks = userLinks.slice(-4);

  recentLinks.forEach(link => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a " href="${link.url}" target="_blank">#${link.name}</a>`;
    recentLinksList.appendChild(listItem);
  });
}

// -------------------laoder-------------

window.onload = function () {
  var preloader = document.querySelector(".preloader");
  preloader.style.display = "none";
};


// =====================================================UNWANTED SECTION =========================================================================

// function deleteLink(index) {
//   if (!currentUser) return;

//   let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];
//   userLinks.splice(index, 1);
//   localStorage.setItem(currentUser, JSON.stringify(userLinks));
//   updateLinkTable();
// }

// =====================original sort function ()

// function sortLinks(sortOrder) {
//   let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];
//   let recentLinks = userLinks.slice(0,4); // Get the recent links from the userLinks array
//   // let recentLinks = userLinks.slice(-4); // Get the recent links from the userLinks array

//   switch (sortOrder) {
//     case 'nameAsc':
//       userLinks.sort((a, b) => a.name.localeCompare(b.name));
//       break;
//     case 'nameDesc':
//       userLinks.sort((a, b) => b.name.localeCompare(a.name));
//       break;
//     case 'dateDesc':
//       userLinks.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
//       break;
//     case 'dateAsc':
//       userLinks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
//       break;
//   }

//   // Save the sorted userLinks to localStorage
//   localStorage.setItem(currentUser, JSON.stringify(userLinks));

//   updateLinkTable(userLinks);
//   updateRecentLinks(recentLinks);
// }

// ======================original recent links ()

// function updateRecentLinks() {
//   if (!currentUser) return;

//   const recentLinksList = document.getElementById('recentLinks');
//   recentLinksList.innerHTML = '';

//   let userLinks = JSON.parse(localStorage.getItem(currentUser)) || [];
//   const recentLinks = userLinks.slice(0,4);
//   // const recentLinks = userLinks.slice(-4);

//   recentLinks.forEach(link => {
//     const listItem = document.createElement('li');
//     listItem.innerHTML = `<a " href="${link.url}" target="_blank">#${link.name}</a>`;
//     recentLinksList.appendChild(listItem);
//   });
// }
