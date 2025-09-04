import { characterData } from './data.js';

let selectedCharacters = [];

function renderCharacterCards() {
  const principalGrid = document.getElementById('principal-character-grid');
  const supportingGrid = document.getElementById('supporting-character-grid');
  
  Object.keys(characterData).sort().forEach(name => {
    const char = characterData[name];
    if (char.category === 'cameo') return;
    
    const card = document.createElement('div');
    card.className = 'character-card bg-gray-50 p-5 rounded-lg border-2 border-transparent flex flex-col justify-between';
    card.dataset.characterName = name;
    card.innerHTML = `
      <div>
        <h3 class="text-2xl font-semibold text-primary">${name}</h3>
        <p class="text-sm text-gray-600 font-medium">${char.vocalInfo}</p>
        <p class="text-sm text-gray-700 mt-2">${char.characterDescription}</p>
        ${char.auditionCut ? `<div class="mt-3 pt-3 border-t border-gray-200"><p class="font-semibold">Audition Cut: ${char.auditionCut}</p></div>` : ''}
      </div>
      <div class="mt-4 flex justify-end">
        <span class="select-button bg-gray-200 text-primary font-bold py-2 px-4 rounded-lg text-sm">Select Role</span>
      </div>
    `;
    
    if (char.category === 'principal') {
      principalGrid.appendChild(card);
    } else if (char.category === 'supporting') {
      supportingGrid.appendChild(card);
    }
  });
}

function handleCharacterSelection(e) {
  const card = e.target.closest('.character-card');
  if (!card) return;

  const characterName = card.dataset.characterName;
  const button = card.querySelector('.select-button');
  const index = selectedCharacters.indexOf(characterName);

  if (index > -1) {
    selectedCharacters.splice(index, 1);
    card.classList.remove('selected');
    button.textContent = 'Select Role';
    button.classList.remove('bg-primary', 'text-white');
    button.classList.add('bg-gray-200');
  } else {
    if (selectedCharacters.length < 2) {
      selectedCharacters.push(characterName);
      card.classList.add('selected');
      button.textContent = '✓ Selected';
      button.classList.add('bg-primary', 'text-white');
      button.classList.remove('bg-gray-200');
    } else {
      alert("You may only select up to two characters.");
    }
  }
}

function showRegistrationForm() {
  const selectionError = document.getElementById('selection-error');
  if (selectedCharacters.length === 0) {
    selectionError.classList.remove('hidden');
    return;
  }
  selectionError.classList.add('hidden');
  
  document.getElementById('selected-characters-display').innerHTML = `<p class="text-base">You have selected materials for: <strong class="text-primary">${selectedCharacters.join(', ')}</strong></p>`;
  
  renderAuditionMaterials();
  
  document.getElementById('selected_roles_input').value = selectedCharacters.join(', ');
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('registration-section').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function showMainContent() {
  document.getElementById('registration-section').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  document.getElementById('character-selection-section').scrollIntoView({ behavior: 'smooth' });
}

function renderAuditionMaterials() {
  const materialsContainer = document.getElementById('materials-container');
  materialsContainer.innerHTML = '';

  const ensembleBlock = document.createElement('div');
  ensembleBlock.className = 'bg-white p-4 rounded-lg border border-blue-200';
  ensembleBlock.innerHTML = `
    <h3 class="text-xl font-semibold text-primary">Required Ensemble Audition</h3>
    <p class="text-sm text-gray-600 mb-3">All roles are required to sing this excerpt from the Prologue.</p>
    <div class="flex flex-wrap gap-4">
        <a href="javascript:void(0);" target="_blank" class="inline-block bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Download Sheet Music Excerpt (PDF)</a>
        <a href="https://drive.google.com/file/d/1ORa7KrfY34Gue0ABakOuepnFtTwtAqaU/view?usp=sharing" target="_blank" class="inline-block bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Download Audio Excerpt (MP3)</a>
    </div>
  `;
  materialsContainer.appendChild(ensembleBlock);

  selectedCharacters.forEach(name => {
    const char = characterData[name];
    if (char.sheetMusicUrl) {
      const block = document.createElement('div');
      block.className = 'bg-white p-4 rounded-lg border';
      block.innerHTML = `
        <h3 class="text-xl font-semibold text-primary">${name}</h3>
        <p class="text-sm text-gray-600 mb-3">Audition Cut: ${char.auditionCut}</p>
        <div class="flex flex-wrap gap-4">
            <a href="${char.sheetMusicUrl}" target="_blank" class="inline-block bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Download Sheet Music Excerpt (PDF)</a>
            <a href="${char.audioDownloadUrl}" target="_blank" class="inline-block bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Download Audio Excerpt (MP3)</a>
        </div>
      `;
      materialsContainer.appendChild(block);
    }
  });
}

function showConfirmationScreen() {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('registration-section').classList.add('hidden');
    document.getElementById('confirmation-section').classList.remove('hidden');
    window.history.replaceState({}, document.title, window.location.pathname);
}

function resetToStart() {
    document.getElementById('confirmation-section').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.querySelectorAll('.character-card.selected').forEach(card => card.classList.remove('selected'));
    selectedCharacters = [];
    window.scrollTo(0, 0);
}

export function initializeUI() {
  renderCharacterCards();

  document.getElementById('character-selection-section').addEventListener('click', handleCharacterSelection);
  document.getElementById('proceed-to-form-btn').addEventListener('click', showRegistrationForm);
  document.getElementById('back-to-packet-btn').addEventListener('click', showMainContent);
  document.getElementById('back-to-start-btn').addEventListener('click', resetToStart);

  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');

  if (success === '1' || window.location.hash === '#submitted') {
    showConfirmationScreen();
  } else if (error) {
    alert('Submission failed: ' + decodeURIComponent(error));
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
