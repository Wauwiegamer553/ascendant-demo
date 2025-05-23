document.addEventListener('DOMContentLoaded', () => {
    // Sections
    const pactSection = document.getElementById('initiation-pact-section');
    const pantheonSection = document.getElementById('pantheon-curator-section');
    const immersionSection = document.getElementById('immersion-chamber-section');
    const acolyteSection = document.getElementById('acolyte-path-section');
    const mainMenuSection = document.getElementById('main-menu-section');

    // Pact Elements
    const consentCheckboxes = document.querySelectorAll('.pact-consent');
    const agreeToPactBtn = document.getElementById('agree-to-pact-btn');

    // Pantheon Elements
    const artistSelectionArea = document.getElementById('artist-selection-area');
    const confirmPantheonBtn = document.getElementById('confirm-pantheon-btn');

    // Immersion Chamber Elements
    const currentArtistDisplay = document.getElementById('current-artist-display');
    const artistImage = document.getElementById('artist-image');
    const currentSongTitle = document.getElementById('current-song-title');
    const lyricOverlay = document.getElementById('lyric-overlay');
    const nextStimulusBtn = document.getElementById('next-stimulus-btn');
    const sanctumPauseBtn = document.getElementById('sanctum-pause-btn');

    // Main Menu Buttons
    const gotoImmersionBtn = document.getElementById('goto-immersion-btn');
    const gotoAcolyteBtn = document.getElementById('goto-acolyte-btn');
    const resetPactBtn = document.getElementById('reset-pact-btn');
    
    // App State
    let userStatus = document.getElementById('user-status');
    let selectedPantheon = [];
    let currentArtistIndex = 0;
    let currentSongWithinArtistIndex = 0;

    // Dummy Data for Pantheon (Replace with more/real data if desired)
    const pantheonMasterData = {
        madison: {
            name: "Madison Beer",
            stimuli: [
                { type: "image", src: "https://via.placeholder.com/400x300/FF69B4/FFFFFF?Text=Madison+Image+1", song: "Selfish (Concept)", lyrics: "If I told you that I loved you...\nWould you tell me that you hate me?" },
                { type: "image", src: "https://via.placeholder.com/400x300/BA55D3/FFFFFF?Text=Madison+Image+2", song: "Good in Goodbye (Concept)", lyrics: "You're a bittersweet tragedy...\nBut I'm good in goodbye." }
            ]
        },
        olivia: {
            name: "Olivia Rodrigo",
            stimuli: [
                { type: "image", src: "https://via.placeholder.com/400x300/7FFF00/000000?Text=Olivia+Image+1", song: "drivers license (Concept)", lyrics: "I got my driver's license last week...\nJust like we always talked about." },
                { type: "image", src: "https://via.placeholder.com/400x300/FFD700/000000?Text=Olivia+Image+2", song: "good 4 u (Concept)", lyrics: "Well, good for you, you look happy and healthy...\nNot me, if you ever cared to ask." }
            ]
        },
        taylor: {
            name: "Taylor Swift",
            stimuli: [
                { type: "image", src: "https://via.placeholder.com/400x300/ADD8E6/000000?Text=Taylor+Image+1", song: "Love Story (Concept)", lyrics: "We were both young when I first saw you...\nI close my eyes and the flashback starts." },
                { type: "image", src: "https://via.placeholder.com/400x300/E6E6FA/000000?Text=Taylor+Image+2", song: "All Too Well (Concept)", lyrics: "I walked through the door with you, the air was cold...\nBut something 'bout it felt like home somehow." }
            ]
        }
    };

    // --- PACT LOGIC ---
    // Function to check consent status and update the button
    function updatePactButtonState() {
        const allChecked = Array.from(consentCheckboxes).every(cb => cb.checked);
        agreeToPactBtn.disabled = !allChecked;
    }

    // Add event listeners to checkboxes
    consentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePactButtonState);
    });

    // Initial check for pact consent when the page loads
    // This handles cases where checkboxes might be pre-filled by the browser
    updatePactButtonState();

    agreeToPactBtn.addEventListener('click', () => {
        pactSection.style.display = 'none';
        pantheonSection.style.display = 'block';
        userStatus.textContent = 'Status: Curating Pantheon';
    });

    // --- PANTHEON LOGIC ---
    artistSelectionArea.addEventListener('change', () => {
        selectedPantheon = Array.from(artistSelectionArea.querySelectorAll('input[name="artist"]:checked'))
                               .map(cb => cb.value);
        confirmPantheonBtn.disabled = selectedPantheon.length === 0;
    });

    confirmPantheonBtn.addEventListener('click', () => {
        if (selectedPantheon.length > 0) {
            pantheonSection.style.display = 'none';
            mainMenuSection.style.display = 'block';
            userStatus.textContent = 'Status: Initiated - Main Menu';
            currentArtistIndex = 0; // Reset for immersion
            currentSongWithinArtistIndex = 0;
        }
    });
    
    // --- MAIN MENU LOGIC ---
    function showMainMenu() {
        pactSection.style.display = 'none';
        pantheonSection.style.display = 'none';
        immersionSection.style.display = 'none';
        acolyteSection.style.display = 'none';
        mainMenuSection.style.display = 'block';
        userStatus.textContent = 'Status: Initiated - Main Menu';
    }

    gotoImmersionBtn.addEventListener('click', () => {
        mainMenuSection.style.display = 'none';
        immersionSection.style.display = 'block';
        userStatus.textContent = 'Status: Immersion Chamber Active';
        startImmersion();
    });

    gotoAcolyteBtn.addEventListener('click', () => {
        mainMenuSection.style.display = 'none';
        acolyteSection.style.display = 'block';
        userStatus.textContent = 'Status: Acolyte\'s Path';
    });
    
    resetPactBtn.addEventListener('click', () => {
        mainMenuSection.style.display = 'none';
        pactSection.style.display = 'block';
        userStatus.textContent = 'Status: Reviewing Pact';
        // Reset consent checkboxes
        consentCheckboxes.forEach(cb => cb.checked = false);
        // agreeToPactBtn.disabled = true; // This line is now handled by updatePactButtonState()
        updatePactButtonState(); // Update button state after resetting checkboxes
    });
    
    // Placeholder for Acolyte's Path return
    document.getElementById('return-to-menu-from-acolyte-btn')?.addEventListener('click', showMainMenu);


    // --- IMMERSION CHAMBER LOGIC ---
    function startImmersion() {
        if (selectedPantheon.length === 0) {
            // This case should ideally be handled by disabling gotoImmersionBtn if no pantheon is selected,
            // or by redirecting to pantheon selection if trying to enter immersion without one.
            // For now, an alert and return to menu.
            alert("Please curate your Pantheon first. You can do this from the Main Menu by selecting 'Curate Your Pantheon' (which might involve reviewing the contract if you reset it).");
            showMainMenu(); // Go back to menu to allow pantheon curation
            // To make this smoother, we might need to ensure pantheon selection is accessible
            // or guide the user to `resetPactBtn` then `Confirm Pantheon` flow if `selectedPantheon` is empty.
            return;
        }
        currentArtistIndex = 0; // Start with the first selected artist
        currentSongWithinArtistIndex = 0;
        loadCurrentStimulus();
    }

    function loadCurrentStimulus() {
        if (selectedPantheon.length === 0) {
             // This should ideally not be reached if startImmersion() checks,
             // but as a safeguard:
            currentArtistDisplay.textContent = "Immersion Chamber: Pantheon not selected.";
            artistImage.src = "https://via.placeholder.com/400x300/000000/FFFFFF?Text=Error";
            currentSongTitle.textContent = "N/A";
            lyricOverlay.innerHTML = "Please select a Pantheon from the main menu.";
            return;
        }

        const artistKey = selectedPantheon[currentArtistIndex];
        const artistData = pantheonMasterData[artistKey];

        if (!artistData || !artistData.stimuli || artistData.stimuli.length === 0) {
            // Move to next artist if current one has no stimuli or data
            proceedToNextArtistInPantheon();
            return;
        }
        
        const stimulus = artistData.stimuli[currentSongWithinArtistIndex];

        currentArtistDisplay.textContent = `Immersion Chamber: ${artistData.name}`;
        artistImage.src = stimulus.src;
        artistImage.alt = `${artistData.name} - Visual`;
        currentSongTitle.textContent = stimulus.song || "N/A";
        lyricOverlay.innerHTML = stimulus.lyrics ? stimulus.lyrics.replace(/\n/g, '<br>') : "Observe the visual essence.";
    }

    function proceedToNextArtistInPantheon() {
        currentArtistIndex++;
        currentSongWithinArtistIndex = 0; // Reset song index for new artist
        if (currentArtistIndex >= selectedPantheon.length) {
            currentArtistIndex = 0; // Loop back to the first artist
        }
        // Ensure we don't get into an infinite loop if all artists have no stimuli
        // This would require a more complex check, for now, assume at least one valid stimulus exists
        // across the selected pantheon.
        loadCurrentStimulus();
    }
    
    nextStimulusBtn.addEventListener('click', () => {
        if (selectedPantheon.length === 0) return; // Should not proceed if no pantheon

        const artistKey = selectedPantheon[currentArtistIndex];
        const artistData = pantheonMasterData[artistKey];

        if (!artistData || !artistData.stimuli || artistData.stimuli.length === 0) {
             // If current artist has no stimuli, try to move to the next one.
            proceedToNextArtistInPantheon();
            return;
        }

        currentSongWithinArtistIndex++;
        if (currentSongWithinArtistIndex >= artistData.stimuli.length) {
            // Moved to the end of stimuli for current artist, go to next artist
            proceedToNextArtistInPantheon(); // This already resets currentSongWithinArtistIndex and loads
        } else {
            loadCurrentStimulus();
        }
    });

    sanctumPauseBtn.addEventListener('click', () => {
        // In a real app, might pause audio/timers. Here, just go back to menu.
        immersionSection.style.display = 'none';
        showMainMenu();
        userStatus.textContent = 'Status: Sanctum Pause - Main Menu';
    });

});
