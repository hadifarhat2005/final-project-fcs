
let links = [
  { id: 1, title: 'W3Schools', link: 'https://www.w3schools.com', fav: false },
  { id: 2, title: 'Google', link: 'https://www.google.com', fav: false }
];

const titleInput = document.getElementById('titleInput');
const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const bookmarksArea = document.getElementById('bookmarksArea');
const countBadge = document.getElementById('countBadge');
const themeToggle = document.getElementById('themeToggle');
const viewToggle = document.getElementById('viewToggle');
const body = document.body;

let viewMode = 'cards'; 


function isValidUrl(u){
  
  return /^https?:\/\/.+/i.test(u);
}

function updateCount(){
  countBadge.textContent = links.length;
}

function createBookmarkNode(item){
  const card = document.createElement('article');
  card.className = 'bookmark-card';
  card.dataset.id = item.id;

  
  const info = document.createElement('div');
  info.className = 'bookmark-info';

  const favicon = document.createElement('div');
  favicon.className = 'favicon';
  
  const letter = (item.title && item.title.length>0) ? item.title[0].toUpperCase() : (new URL(item.link).hostname[0] || 'W').toUpperCase();
  favicon.textContent = letter;

  const meta = document.createElement('div');
  meta.className = 'meta';

  const titleEl = document.createElement('div');
  titleEl.className = 'title';
  titleEl.textContent = item.title;

  const urlEl = document.createElement('a');
  urlEl.className = 'url';
  urlEl.href = item.link;
  urlEl.textContent = item.link;
  urlEl.target = '_blank';
  urlEl.rel = 'noopener noreferrer';

  meta.appendChild(titleEl);
  meta.appendChild(urlEl);

  info.appendChild(favicon);
  info.appendChild(meta);

 
  const actions = document.createElement('div');
  actions.className = 'bookmark-actions';

  const favBtn = document.createElement('button');
  favBtn.className = 'action-btn fav';
  favBtn.title = 'Toggle Favorite';
  favBtn.innerText = item.fav ? '★' : '☆';
  if(item.fav) favBtn.classList.add('active');

  favBtn.addEventListener('click', () => {
    item.fav = !item.fav;
    favBtn.innerText = item.fav ? '★' : '☆';
    favBtn.classList.toggle('active', item.fav);
  });

  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn edit';
  editBtn.innerText = 'Edit';
  editBtn.addEventListener('click', () => {
    const newTitle = prompt('Edit title:', item.title);
    if(newTitle === null) return;
    if(newTitle.trim() === ''){
      alert('Title cannot be empty.');
      return;
    }
    const newUrl = prompt('Edit URL:', item.link);
    if(newUrl === null) return;
    if(!isValidUrl(newUrl.trim())){
      alert('URL must start with http:// or https://');
      return;
    }
    item.title = newTitle.trim();
    item.link = newUrl.trim();
    render();
  });

  // delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'action-btn delete';
  delBtn.innerText = 'Delete';
  delBtn.addEventListener('click', () => {
    const ok = confirm('Delete this bookmark?');
    if(!ok) return;
    links = links.filter(l => l.id !== item.id);
    render();
  });

  actions.appendChild(favBtn);
  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  card.appendChild(info);
  card.appendChild(actions);

  return card;
}

function render(){
 
  bookmarksArea.classList.toggle('cards', viewMode === 'cards');
  bookmarksArea.classList.toggle('list', viewMode === 'list');


  while(bookmarksArea.firstChild) bookmarksArea.removeChild(bookmarksArea.firstChild);

  if(links.length === 0){
    const noDiv = document.createElement('div');
    noDiv.className = 'no-users';
    const inner = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = 'No bookmarks yet';
    const p = document.createElement('p');
    p.textContent = 'Add your first bookmark above';
    inner.appendChild(h3);
    inner.appendChild(p);
    noDiv.appendChild(inner);
    bookmarksArea.appendChild(noDiv);
    updateCount();
    return;
  }

  
  links.forEach(item => {
    const node = createBookmarkNode(item);
    bookmarksArea.appendChild(node);
  });

  updateCount();
}


addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if(title === ''){
    alert('Title is required.');
    return;
  }
  if(!isValidUrl(url)){
    alert('URL must start with http:// or https://');
    return;
  }

  const newId = links.length ? (links[links.length-1].id + 1) : 1;
  links.push({ id: newId, title, link: url, fav: false });
  titleInput.value = '';
  urlInput.value = '';
  render();
});

clearBtn.addEventListener('click', () => {
  const ok = confirm('Delete all bookmarks?');
  if(!ok) return;
  links = [];
  render();
});


themeToggle.addEventListener('click', () => {
  if(body.classList.contains('light')){
    body.classList.remove('light');
    body.classList.add('dark');
    themeToggle.innerText = 'Light Mode';
  } else {
    body.classList.remove('dark');
    body.classList.add('light');
    themeToggle.innerText = 'Dark Mode';
  }
});


viewToggle.addEventListener('click', () => {
  if(viewMode === 'cards'){
    viewMode = 'list';
    viewToggle.innerText = 'Show: List';
  } else {
    viewMode = 'cards';
    viewToggle.innerText = 'Show: Cards';
  }
  render();
});

render();