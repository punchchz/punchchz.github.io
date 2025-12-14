let currentRoom = 1;
let allEyes = []; 
let mouseXPos = window.innerWidth / 2;
let mouseYPos = window.innerHeight / 2;
let cursorElement = document.getElementById('cursor');
let playArea = document.getElementById('playArea');
let cursorAnimFrame = 0;
let lastX = mouseXPos;
let lastY = mouseYPos;
let cursorIsMoving = false;
let moveTimer;
let startTime = Date.now();

// cursor animation frames
const runningImages = [
    "img/run-02.png",
    "img/run-03.png",
    "img/run-04.png",
    "img/run-05.png",
    "img/run-06.png"
];

// settings for each room level
const roomSettings = {
    1: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 0, numPairs: 1 },
    2: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 2, numPairs: 2 },
    3: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 4, numPairs: 3 },
    4: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 6, numPairs: 4 },
    5: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 8, numPairs: 5 }
};

// timing stuff
const exhibitionTiming = {
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 20),
};

//where to put the eyes
function getEyeLocations(numPairs) {
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    
    // just one pair in the middle
    if (numPairs === 1) {
        positions.push({ x: centerX, y: centerY });
    } 
    // two pairs stacked vertically
    else if (numPairs === 2) {
        positions.push({ x: centerX, y: 35 });
        positions.push({ x: centerX, y: 65 });
    }
    // three in a vertical line
    else if (numPairs === 3) {
        positions.push({ x: centerX, y: 25 });
        positions.push({ x: centerX, y: 50 });
        positions.push({ x: centerX, y: 75 });
    }
    // four in a cross pattern
    else if (numPairs === 4) {
        positions.push({ x: centerX, y: 20 });
        positions.push({ x: 35, y: 50 });
        positions.push({ x: 65, y: 50 });
        positions.push({ x: centerX, y: 80 });
    }
    // five eyes scattered around
    else if (numPairs === 5) {
        positions.push({ x: centerX, y: 15 });
        positions.push({ x: 25, y: 50 });
        positions.push({ x: 50, y: 50 });
        positions.push({ x: 75, y: 50 });
        positions.push({ x: centerX, y: 85 });
    }
    
    return positions;
}

// calculate how much time has passed 
// got help from chatgpt for this time calculation stuff
function calculateExhibitionTime() {
    const now = new Date();
    const startTime = exhibitionTiming.startDate;
    const endTime = exhibitionTiming.endDate;
    
    // hasn't started yet
    if (now < startTime) {
        return { 
            state: 'pre-exhibition',
            hoursElapsed: 0,
            minutesElapsed: 0
        };
    }
    
    // already ended
    if (now > endTime) {
        return { 
            state: 'post-exhibition',
            hoursElapsed: 20,
            minutesElapsed: 0
        };
    }
   
    const elapsed = now - startTime;
    const hoursElapsed = Math.floor(elapsed / (1000 * 60 * 60));
    const minutesElapsed = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
        state: 'active',
        hoursElapsed: hoursElapsed,
        minutesElapsed: minutesElapsed,
        totalMinutes: Math.floor(elapsed / (1000 * 60))
    };
}

// figure out which rooms should be unlocked based on time
function checkUnlockedRooms() {
    const time = calculateExhibitionTime();
    
    if (time.state === 'pre-exhibition') return [];
    if (time.state === 'post-exhibition') return [1, 2, 3, 4, 5];
    
    const minutes = time.totalMinutes;
    
    // unlock rooms every 2 minutes
    if (minutes >= 8) return [1, 2, 3, 4, 5];
    if (minutes >= 6) return [1, 2, 3, 4];
    if (minutes >= 4) return [1, 2, 3];
    if (minutes >= 2) return [1, 2];
    return [1];
}

// make the custom cursor with animation
function setupCursor() {
    const img = document.createElement('img');
    img.src = runningImages[0];
    img.alt = 'cursor';
    cursorElement.appendChild(img);
    
    // cycle through running frames
    setInterval(() => {
        if (cursorIsMoving) {
            cursorAnimFrame = (cursorAnimFrame + 1) % runningImages.length;
            img.src = runningImages[cursorAnimFrame];
        } else {
            cursorAnimFrame = 0;
            img.src = runningImages[0];
        }
    }, 100);
}

// make cursor blurrier in higher rooms
function updateCursorBlurriness() {
    const config = roomSettings[currentRoom];
    const img = cursorElement.querySelector('img');
    if (img) {
        img.style.filter = `blur(${config.blurAmount}px)`;
    }
}

// get the area where eyes can appear
function getAreaBounds() {
    return {
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function updateAreaSize() {
    const bounds = getAreaBounds();
    playArea.style.left = bounds.left + 'px';
    playArea.style.top = bounds.top + 'px';
    playArea.style.width = bounds.width + 'px';
    playArea.style.height = bounds.height + 'px';
}

// create all the eye pairs for current room
function makeEyes() {
    const config = roomSettings[currentRoom];
    const positions = getEyeLocations(config.numPairs);
    
    positions.forEach(pos => {
        const eyeDiv = document.createElement('div');
        eyeDiv.className = 'eye-pair fade-in';
        
        // position each pair
        eyeDiv.style.left = pos.x + '%';
        eyeDiv.style.top = pos.y + '%';
        eyeDiv.style.transform = 'translate(-50%, -50%)';
        
        // set up css variables for distortion effects
        eyeDiv.style.setProperty('--width-distort', 1);
        eyeDiv.style.setProperty('--height-distort', 1);
        eyeDiv.style.setProperty('--pupil-distort', 1);
        eyeDiv.style.setProperty('--time-growth', 1);
        
        // make two eyeballs per pair
        for (let i = 0; i < 2; i++) {
            const eyeball = document.createElement('div');
            eyeball.className = 'eyeball';
            
            const pupil = document.createElement('div');
            pupil.className = 'pupil';
            
            eyeball.appendChild(pupil);
            eyeDiv.appendChild(eyeball);
        }
        
        document.body.appendChild(eyeDiv);
        allEyes.push(eyeDiv);
    });
    
    updateEyeCounter();
}

// distort eyes based on mouse position
// used ai to help figure out the math here
function distortBasedOnMouse() {
    if (allEyes.length === 0) return;
    
    let cursorX = mouseXPos / window.innerWidth;
    let cursorY = mouseYPos / window.innerHeight;
    
    // calculate distortion amounts
    let widthDistort = 0.5 + (cursorX * 1.5);
    let heightDistort = 0.5 + (cursorY * 1.5);
    let pupilDistort = 0.7 + (cursorX * 0.8);
    
    allEyes.forEach(eyePair => {
        eyePair.style.setProperty('--width-distort', widthDistort);
        eyePair.style.setProperty('--height-distort', heightDistort);
        eyePair.style.setProperty('--pupil-distort', pupilDistort);
    });
}

// make eyes grow bigger over time (gets uncomfortable after 2 min)
function makeEyesGrowOverTime() {
    if (allEyes.length > 0) {
        const config = roomSettings[currentRoom];
        let timeAlive = (Date.now() - startTime) / 1000;
        
        // calculate growth progress
        let progress = Math.min(timeAlive / config.growthDuration, 1);
        let timeGrowth = 1 + (progress * (config.maxGrowth - 1));
        
        allEyes.forEach(eyePair => {
            eyePair.style.setProperty('--time-growth', timeGrowth);
        });
    }
    
    requestAnimationFrame(makeEyesGrowOverTime);
}

// make pupils follow the cursor
// chatgpt helped with the angle/distance math
function makePupilsFollowCursor() {
    if (allEyes.length === 0) return;
    
    allEyes.forEach(eyePair => {
        const pupils = eyePair.querySelectorAll('.pupil');
        const eyeballs = eyePair.querySelectorAll('.eyeball');
        
        eyeballs.forEach((eyeball, index) => {
            // get eye position
            const rect = eyeball.getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            
            // calculate angle to mouse
            const angle = Math.atan2(mouseYPos - eyeY, mouseXPos - eyeX);
            const vw = window.innerWidth / 100;
            
            // how far pupil can move
            const maxDistanceX = 1 * vw;
            const maxDistanceY = 0.4 * vw;
            
            const actualDistance = Math.hypot(mouseXPos - eyeX, mouseYPos - eyeY);
            const normalizedDistance = Math.min(1, actualDistance / 200);
            
            // calculate new position
            const x = Math.cos(angle) * maxDistanceX * normalizedDistance;
            const y = Math.sin(angle) * maxDistanceY * normalizedDistance;
            
            pupils[index].style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    });
}

// update the eye counter display
function updateEyeCounter() {
    document.getElementById('eyeCount').textContent = allEyes.length;
    updateTopText();
}

// remove all eyes from screen
function removeAllEyes() {
    allEyes.forEach(eyePair => {
        eyePair.remove();
    });
    allEyes = [];
    startTime = Date.now();
    updateEyeCounter();
}

// show when next room unlocks
function calculateNextUnlock() {
    const time = calculateExhibitionTime();
    
    if (time.state === 'pre-exhibition') {
        return 'Exhibition has not started';
    }
    
    if (time.state === 'post-exhibition') {
        return 'Exhibition has ended';
    }
    
    const minutes = time.totalMinutes;
    
    if (minutes >= 8) {
        return 'All rooms unlocked';
    }
    
    // figure out next unlock time
    let nextUnlockMinute;
    if (minutes < 2) nextUnlockMinute = 2;
    else if (minutes < 4) nextUnlockMinute = 4;
    else if (minutes < 6) nextUnlockMinute = 6;
    else nextUnlockMinute = 8;
    
    const now = new Date();
    const startTime = exhibitionTiming.startDate;
    const nextUnlockTime = new Date(startTime.getTime() + (nextUnlockMinute * 60 * 1000));
    const remainingMs = nextUnlockTime - now;
    
    const minutesRemaining = Math.floor(remainingMs / (1000 * 60));
    const secondsRemaining = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    const nextRoom = (nextUnlockMinute / 2) + 1;
    
    return `Room ${nextRoom} unlocks in ${minutesRemaining} minutes ${secondsRemaining} seconds`;
}

function updateTopText() {
    document.getElementById('headerText').textContent = calculateNextUnlock();
}

// flash effect when changing rooms
function roomTransitionFlash() {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgb(7,78, 70);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 300);
    
    setTimeout(() => {
        flash.remove();
    }, 600);
}

// update bottom navigation to show current room
function updateRoomButtons() {
    const navItems = document.querySelectorAll('.room-nav-item');
    navItems.forEach(item => {
        const roomNum = parseInt(item.getAttribute('data-room'));
        if (roomNum === currentRoom) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// enable/disable doors based on available rooms
function updateDoorStatus() {
    const availableRooms = checkUnlockedRooms();
    const doorLeft = document.getElementById('doorLeft');
    const doorRight = document.getElementById('doorRight');
    
    // can't go left from room 1
    if (currentRoom === 1) {
        doorLeft.classList.add('disabled');
    } else {
        doorLeft.classList.remove('disabled');
    }
    
    // can't go right if at max room or next room locked
    if (currentRoom === 5 || !availableRooms.includes(currentRoom + 1)) {
        doorRight.classList.add('disabled');
    } else {
        doorRight.classList.remove('disabled');
    }
}

// start up a room
function loadRoom() {
    updateAreaSize();
    updateCursorBlurriness();
    updateRoomButtons(); 
    updateDoorStatus();
    makeEyes();
}

// door click handlers
var doorLeft = document.getElementById('doorLeft');
var doorRight = document.getElementById('doorRight');

// right door - go forward
doorRight.addEventListener('click', () => {
    const availableRooms = checkUnlockedRooms();
    
    // check if next room is unlocked
    if (!availableRooms.includes(currentRoom + 1) || currentRoom >= 5) {
        return;
    }
    
    currentRoom++;
    if (currentRoom > 5) {
        currentRoom = 5;
    }
    
    removeAllEyes();
    updateRoomButtons();
    roomTransitionFlash();
    
    setTimeout(() => {
        loadRoom();
    }, 100);
});

// left door - go back
doorLeft.addEventListener('click', () => {
    if (currentRoom <= 1) {
        return;
    }
    
    currentRoom--;
    if (currentRoom < 1) {
        currentRoom = 1;
    }
    
    removeAllEyes();
    updateRoomButtons();
    roomTransitionFlash();
    
    setTimeout(() => {
        loadRoom();
    }, 100);
});

// about section toggle
var toggleBtn = document.querySelector('.toggle-btn');
var aboutContent = document.querySelector('.about-content');

toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    aboutContent.classList.toggle('show');
});

// track mouse movement
document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY; 
    const distance = Math.hypot(dx, dy);
    
    mouseXPos = e.clientX;
    mouseYPos = e.clientY;
    
    // move cursor element
    cursorElement.style.transform = `translate(${mouseXPos - 20}px, ${mouseYPos - 40}px)`;
    
    // detect if cursor is moving
    if (distance > 2) {
        cursorIsMoving = true;
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => {
            cursorIsMoving = false;
        }, 150);
    }
    
    lastX = mouseXPos;
    lastY = mouseYPos;
    
    distortBasedOnMouse();
    requestAnimationFrame(makePupilsFollowCursor);
});

// handle window resize
window.addEventListener('resize', () => {
    updateAreaSize();
});

// start everything
setupCursor();
loadRoom();
updateTopText();
updateDoorStatus();
makeEyesGrowOverTime();

// random questions that appear on sides
const questionsList = [
    "Are you still there?",
    "How long have you been here?",
    "Does it know you're watching?",
    "Can you look away?",
    "Are you looking?",
    "How many hours today?",
    "Does it see you clearly?",
    "Are you alone?",
    "What time is it?",
    "How was your day?",
    "How does it feel?",
    "How long can you stay?",
    "Do you think you feel seen?",
];

function showQuestions() {
    const leftBlock = document.querySelector('.question-left');
    const rightBlock = document.querySelector('.question-right');
    
    // pick
    const leftQuestion = questionsList[Math.floor(Math.random() * questionsList.length)];
    const rightQuestion = questionsList[Math.floor(Math.random() * questionsList.length)];
    
    // show left question
    leftBlock.querySelector('.question-text').textContent = leftQuestion;
    leftBlock.style.display = 'block';
    
    // show right question
    rightBlock.querySelector('.question-text').textContent = rightQuestion;
    rightBlock.style.display = 'block';
    
    // hide after 
    setTimeout(() => {
        leftBlock.style.display = 'none';
        rightBlock.style.display = 'none';
    }, 10000);
}

// show questions every 5 seconds
setInterval(showQuestions, 5000);

// first question after 5 seconds
setTimeout(showQuestions, 5000);

// update header text every second
setInterval(updateTopText, 1000);