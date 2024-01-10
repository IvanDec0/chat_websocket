const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}

const statusOnline = document.querySelector('#status-online');
const statusOffline = document.querySelector('#status-offline');

const userElement = document.querySelector('ul');

const form = document.querySelector('form');
const input = document.querySelector('input');
const chat = document.querySelector('#chat');

const renderUsers = (users) => {
  userElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    userElement.appendChild(liElement);
  });
};

const renderMessage = (payload) => {
  const { userId, message, name } = payload;

  const divElement = document.createElement('div');
  divElement.classList.add('message');

  if (userId !== socket.id) {
    divElement.classList.add('incoming');
  }
  divElement.innerHTML = message;
  chat.appendChild(divElement);

  // Scroll to last message
  chat.scrollTop = chat.scrollHeight;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = input.value;
  input.value = '';
  socket.emit('send-message', message);
});

const socket = io({
  auth: {
    token: '123', // TODO: Replace with your JWT token in future
    name: username,
  },
});

socket.on('connect', () => {
  statusOnline.classList.remove('hidden');
  statusOffline.classList.add('hidden');
});

socket.on('disconnect', () => {
  statusOffline.classList.remove('hidden');
  statusOnline.classList.add('hidden');
});

socket.on('on-clients-changed', renderUsers);

socket.on('on-message', renderMessage);
