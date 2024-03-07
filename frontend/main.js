let titleInput = document.getElementById('title');
let descInput = document.getElementById('desc');
let dreamId = document.getElementById('dream-id');
let vividityInput = document.getElementById('vividity');
let titleEditInput = document.getElementById('title-edit');
let descEditInput = document.getElementById('desc-edit');
let moodEditInput = document.getElementById('mood-edit');
let vividityEditInput = document.getElementById('vividity-edit'); 
let dreams = document.getElementById('dreams');
let data = [];
let selectedDream = {};
const api = 'http://127.0.0.1:8000';

const moodImages = {
  good: 'good.png',
  neutral: 'neutral.png',
  bad: 'bad.png',
  weird: 'weird.png'
};

function tryAdd() {
  let msg = document.getElementById('msg');
  msg.innerHTML = '';
}

document.getElementById('form-add').addEventListener('submit', (e) => {
  e.preventDefault();

  const selectedDate = new Date(document.getElementById('title').valueAsNumber);
  
  // Add timezone offset to the selected date
  selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());

  const currentDate = new Date();

  // Check if the selected date is after the current date or isNaN
  if (selectedDate > currentDate || isNaN(Date.parse(selectedDate))) {
    document.getElementById('msg').innerHTML = 'Please select a current or past date';
    const audio = new Audio('sound/error.wav');
    audio.play();
  } else {
    const title = selectedDate.toLocaleDateString(); // Convert date to a string format if needed
    const description = descInput.value;
    const mood = document.getElementById('mood').value; // Get selected mood
    const vividity = vividityInput.value; // Get vividity value
    addDream(title, description, mood, vividity); 
    const audio = new Audio('sound/editAdd.wav');
    audio.play();

    // close modal
    let add = document.getElementById('add');
    add.setAttribute('data-bs-dismiss', 'modal');
    add.click();
    (() => {
      add.setAttribute('data-bs-dismiss', '');
    })();

  }
});

let addDream = (title, description, mood, vividity) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      const newDream = JSON.parse(xhr.responseText);
      data.push(newDream);
      refreshDreams();
    }
  };
  xhr.open('POST', `${api}/dreams`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, description, mood, vividity }));
};


document.getElementById('confirm-delete').addEventListener('click', () => {
  // Call function to delete dream (dream)
  deleteDream(); // Replace deleteDream() with the actual function to delete the dream
});


document.getElementById('addNew').addEventListener('click', () => {
  const audio = new Audio('sound/edit.wav');
  audio.play();
});

document.querySelectorAll('.modal .btn-close').forEach((button) => {
  button.addEventListener('click', () => {
    const audio = new Audio('sound/delete.wav');
    audio.play();
  });
});

document.querySelectorAll('.modal .btn-secondary').forEach((button) => {
  button.addEventListener('click', () => {
    const audio = new Audio('sound/delete.wav');
    audio.play();
    
  });
});

document.getElementById('modal-edit').addEventListener('hidden.bs.modal', () => {
  document.getElementById('msg2').innerHTML = ''; // Clear the message content
});


// For the initial vividity value
document.getElementById('vividity-value').innerText = vividityInput.value + '%';

// Event listener for vividity input
vividityInput.addEventListener('input', () => {
  document.getElementById('vividity-value').innerText = vividityInput.value + '%';
});

// For the edit form
document.getElementById('vividity-edit-value').innerText = vividityEditInput.value + '%';

// Event listener for vividity edit input
vividityEditInput.addEventListener('input', () => {
  document.getElementById('vividity-edit-value').innerText = vividityEditInput.value + '%';
});

let dreamCount = 0; // Variable to keep track of displayed dream count

let sortByDescending = true;

function toggleSort() {
  sortByDescending = !sortByDescending;
  refreshDreams();
  const audioFile = sortByDescending ? 'ascend.wav' : 'descend.wav';
  const audio = new Audio(`sound/${audioFile}`);
  audio.play();
}

document.getElementById('toggleSort').addEventListener('click', () => {
  toggleSort();
});

let refreshDreams = () => {
  dreams.innerHTML = '';
  let sortedData = data.slice(); // Create a copy of the data array
  
  // Sort the data based on the sorting order
  if (sortByDescending) {
    sortedData.sort((a, b) => b.id - a.id); // Sort by most recent
  } else {
    sortedData.sort((a, b) => a.id - b.id); // Sort by oldest
  }

  sortedData.forEach((x, index) => {
    const dreamCount = index + 1; // Calculate dream count based on the index in sorted array
    const date = new Date(x.title);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    const originalIndex = data.findIndex((dream) => dream.id === x.id) + 1; // Find the original index of the dream
    dreams.innerHTML += `
    <div id="dream-${x.id}" class="dream-container">
      <span class="fw-bold fs-5 date">${formattedDate} <span class="dream-id">(#${originalIndex})</span></span>
      <pre class="text-secondary ps-3 description">${x.description}</pre>
      <span class="vividity">Vividness: ${x.vividity}<span class="percentage">%</span></span>
      <img src="icons/${moodImages[x.mood]}" alt="${x.mood} icon" class="mood-icon" onclick="iconHi(this)">
      <span class="options">
        <i onClick="tryEditDream(${x.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
        <i onClick="deleteDream(${x.id})" class="fas fa-trash-alt"></i>
      </span>
    </div>
  `;
  });
  resetForm();
};

function iconHi(icon) {
  icon.classList.add('icon-grow'); 
  
  // Randomly choose between two sound files
  const randomSoundIndex = Math.random() < 0.5 ? 1 : 2; 
  const soundFile = `sound/face${randomSoundIndex}.wav`;
  
  const audio = new Audio(soundFile);
  audio.play();

  // Reset the size after a short delay
  setTimeout(() => {
    icon.classList.remove('icon-grow'); 
  }, 100); 
}

// Function to update the clock
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let meridiem = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  // Pad single digit minutes with leading zero
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  // Update the clock element
  document.getElementById("clock").textContent = hours + ":" + minutes + " " + meridiem;
}

updateClock();

setInterval(updateClock, 1000);


let tryEditDream = (id) => {
  const dream = data.find((x) => x.id === id);
  selectedDream = dream;
  dreamId.innerText = dream.id;
  titleEditInput.value = dream.title;
  descEditInput.value = dream.description;
  moodEditInput.value = dream.mood;
  vividityEditInput.value = dream.vividity; 

  // Update the vividity percentage display
  document.getElementById('vividity-edit-value').innerText = dream.vividity + '%';

  // Set the date input value
  const dreamDate = new Date(dream.title);
  
  // Add timezone offset to the edited date
  dreamDate.setMinutes(dreamDate.getMinutes() + dreamDate.getTimezoneOffset());

  titleEditInput.value = dreamDate.toISOString().split('T')[0]; 
  
  // Set the mood dropdown value
  const moodDropdown = document.getElementById('mood');
  for (let i = 0; i < moodDropdown.options.length; i++) {
    if (moodDropdown.options[i].value === dream.mood) {
      moodDropdown.selectedIndex = i;
      break;
    }
  }
  
  document.getElementById('msg').innerHTML = '';
  const audio = new Audio('sound/edit.wav');
  audio.play();
};



document.getElementById('form-edit').addEventListener('submit', (e) => {
  e.preventDefault();

  const dreamDateEdit = new Date(document.getElementById('title-edit').value);

  // Add timezone offset to the selected date
  dreamDateEdit.setMinutes(dreamDateEdit.getMinutes() + dreamDateEdit.getTimezoneOffset());
  
  const currentDate = new Date();
  
  // Check if the date is valid
  if (isNaN(dreamDateEdit.getTime()) || dreamDateEdit > currentDate) {
    document.getElementById('msg2').innerHTML = 'Please select a current or past date';
    const audio = new Audio('sound/error.wav');
    audio.play();
    document.getElementById('msg2').style.display = 'block'; // Show msg2
  } else {
    // If there is no error, continue with your code
    const titleEdit = dreamDateEdit.toLocaleDateString(); // Convert date to a string format if needed
    const descriptionEdit = descEditInput.value;
    const moodEdit = moodEditInput.value;
    const vividityEdit = vividityEditInput.value; 
    editDream(titleEdit, descriptionEdit, moodEdit, vividityEdit);
    const audio = new Audio('sound/editAdd.wav');
    audio.play();

    // close modal
    let edit = document.getElementById('edit');
    edit.setAttribute('data-bs-dismiss', 'modal');
    edit.click();
    (() => {
      edit.setAttribute('data-bs-dismiss', '');
    })();
  }
});

let editDream = (title, description, mood, vividity) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      selectedDream.title = title;
      selectedDream.description = description;
      selectedDream.mood = mood;
      selectedDream.vividity = vividity;

      refreshDreams();
    }
  };
  xhr.open('PUT', `${api}/dreams/${selectedDream.id}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, description, mood, vividity }));
};

let deleteDream = async (id) => {
  try {
    const selectedDream = data.find((x) => x.id === id);
    if (!selectedDream) {
      throw new Error('Dream not found');
    }
    
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('modal-confirm-delete'));
    confirmDeleteModal.show();
    
    const confirmAudio = new Audio('sound/deleteConfirm.wav');
    confirmAudio.play();
    
    const confirmDeleteButton = document.getElementById('confirm-delete');
    
    const deleteDreamHandler = async () => {
      try {
        const response = await fetch(`${api}/dreams/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete dream');
        }
        const deleteAudio = new Audio('sound/delete.wav');
        deleteAudio.play();
        data = data.filter((x) => x.id !== id);
        refreshDreams();
      } catch (error) {
        console.error('Error deleting dream:', error);
      } finally {
        confirmDeleteModal.hide();
        confirmDeleteButton.removeEventListener('click', deleteDreamHandler); 
      }
    };
    
    confirmDeleteButton.addEventListener('click', deleteDreamHandler);

} catch (error) {
  console.error('Error deleting dream:', error);
}
}


let resetForm = () => {
  titleInput.value = '';
  descInput.value = '';
};

let getDreams = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText) || [];
      refreshDreams();
    }
  };
  xhr.open('GET', `${api}/dreams`, true);
  xhr.send();
};

(() => {
  getDreams();
})();
