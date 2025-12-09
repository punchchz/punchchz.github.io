let level = 1;
let eyePairs = []; // Changed from eyePair to array
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorElement = document.getElementById('cursor');
let playArea = document.getElementById('playArea');
let cursorFrame = 0;
let lastMouseX = mouseX;
let lastMouseY = mouseY;
let isMoving = false;
let movementTimeout;
let birthTime = Date.now();

const runningFrames = [
    "img/run-02.png",
    "img/run-03.png",
    "img/run-04.png",
    "img/run-05.png",
    "img/run-06.png"
];

const levelConfigs = {
    1: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 0, numPairs: 1 },
    2: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 2, numPairs: 2 },
    3: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 4, numPairs: 3 },
    4: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 6, numPairs: 4 },
    5: { maxGrowth: 3.5, growthDuration: 120, blurAmount: 8, numPairs: 5 }
};

const exhibitionConfig = {
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 20),
};

function getEyePositions(numPairs) {
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    
    if (numPairs === 1) {
        positions.push({ x: centerX, y: centerY });
    } 
    else if (numPairs === 2) {
        positions.push({ x: centerX, y: 35 });
        positions.push({ x: centerX, y: 65 });
    }
    else if (numPairs === 3) {
        positions.push({ x: centerX, y: 25 });
        positions.push({ x: centerX, y: 50 });
        positions.push({ x: centerX, y: 75 });
    }
    else if (numPairs === 4) {
        positions.push({ x: centerX, y: 20 });
        positions.push({ x: 35, y: 50 });
        positions.push({ x: 65, y: 50 });
        positions.push({ x: centerX, y: 80 });
    }
    else if (numPairs === 5) {
        positions.push({ x: centerX, y: 15 });
        positions.push({ x: 25, y: 50 });
        positions.push({ x: 50, y: 50 });
        positions.push({ x: 75, y: 50 });
        positions.push({ x: centerX, y: 85 });
    }
    
    return positions;
}

function getExhibitionTime() {
    const now = new Date();
    const startTime = exhibitionConfig.startDate;
    const endTime = exhibitionConfig.endDate;
    
    if (now < startTime) {
        return { 
            state: 'pre-exhibition',
            hoursElapsed: 0,
            minutesElapsed: 0
        };
    }
    
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

function getAvailableRooms() {
    const time = getExhibitionTime();
    
    if (time.state === 'pre-exhibition') return [];
    if (time.state === 'post-exhibition') return [1, 2, 3, 4, 5];
    
    const minutes = time.totalMinutes;
    
    if (minutes >= 8) return [1, 2, 3, 4, 5];
    if (minutes >= 6) return [1, 2, 3, 4];
    if (minutes >= 4) return [1, 2, 3];
    if (minutes >= 2) return [1, 2];
    return [1];
}


function createCursor() {
    const img = document.createElement('img');
    img.src = runningFrames[0];
    img.alt = 'cursor';
    cursorElement.appendChild(img);
    
    setInterval(() => {
        if (isMoving) {
            cursorFrame = (cursorFrame + 1) % runningFrames.length;
            img.src = runningFrames[cursorFrame];
        } else {
            cursorFrame = 0;
            img.src = runningFrames[0];
        }
    }, 100);
}

function updateCursorBlur() {
    const config = levelConfigs[level];
    const img = cursorElement.querySelector('img');
    if (img) {
        img.style.filter = `blur(${config.blurAmount}px)`;
    }
}

function getPlayBounds() {
    return {
        left: 0,
        right: window.innerWidth,
        top: 0,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function updatePlayArea() {
    const bounds = getPlayBounds();
    playArea.style.left = bounds.left + 'px';
    playArea.style.top = bounds.top + 'px';
    playArea.style.width = bounds.width + 'px';
    playArea.style.height = bounds.height + 'px';
}

function createEyePairs() {
    const config = levelConfigs[level];
    const positions = getEyePositions(config.numPairs);
    
    positions.forEach(pos => {
        const eyeDiv = document.createElement('div');
        eyeDiv.className = 'eye-pair fade-in';
        
        eyeDiv.style.left = pos.x + '%';
        eyeDiv.style.top = pos.y + '%';
        eyeDiv.style.transform = 'translate(-50%, -50%)';
        
        eyeDiv.style.setProperty('--width-distort', 1);
        eyeDiv.style.setProperty('--height-distort', 1);
        eyeDiv.style.setProperty('--pupil-distort', 1);
        eyeDiv.style.setProperty('--time-growth', 1);
        
        for (let i = 0; i < 2; i++) {
            const eyeball = document.createElement('div');
            eyeball.className = 'eyeball';
            
            const pupil = document.createElement('div');
            pupil.className = 'pupil';
            
            eyeball.appendChild(pupil);
            eyeDiv.appendChild(eyeball);
        }
        
        document.body.appendChild(eyeDiv);
        eyePairs.push(eyeDiv);
    });
    
    updateEyeCount();
}

function updateMouseDistortion() {
    if (eyePairs.length === 0) return;
    
    let cursorX = mouseX / window.innerWidth;
    let cursorY = mouseY / window.innerHeight;
    
    let widthDistort = 0.5 + (cursorX * 1.5);
    let heightDistort = 0.5 + (cursorY * 1.5);
    let pupilDistort = 0.7 + (cursorX * 0.8);
    
    eyePairs.forEach(eyePair => {
        eyePair.style.setProperty('--width-distort', widthDistort);
        eyePair.style.setProperty('--height-distort', heightDistort);
        eyePair.style.setProperty('--pupil-distort', pupilDistort);
    });
}

function growOverTime() {
    if (eyePairs.length > 0) {
        const config = levelConfigs[level];
        let timeAlive = (Date.now() - birthTime) / 1000;
        
        let progress = Math.min(timeAlive / config.growthDuration, 1);
        let timeGrowth = 1 + (progress * (config.maxGrowth - 1));
        
        eyePairs.forEach(eyePair => {
            eyePair.style.setProperty('--time-growth', timeGrowth);
        });
    }
    
    requestAnimationFrame(growOverTime);
}

function updateEyes() {
    if (eyePairs.length === 0) return;
    
    eyePairs.forEach(eyePair => {
        const pupils = eyePair.querySelectorAll('.pupil');
        const eyeballs = eyePair.querySelectorAll('.eyeball');
        
        eyeballs.forEach((eyeball, index) => {
            const rect = eyeball.getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            
            const angle = Math.atan2(mouseY - eyeY, mouseX - eyeX);
            const vw = window.innerWidth / 100;
            
            const maxDistanceX = 1 * vw;
            const maxDistanceY = 0.4 * vw;
            
            const actualDistance = Math.hypot(mouseX - eyeX, mouseY - eyeY);
            const normalizedDistance = Math.min(1, actualDistance / 200);
            
            const x = Math.cos(angle) * maxDistanceX * normalizedDistance;
            const y = Math.sin(angle) * maxDistanceY * normalizedDistance;
            
            pupils[index].style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    });
}

function updateEyeCount() {
    document.getElementById('eyeCount').textContent = eyePairs.length;
    updateHeaderText();
}

function clearAllEyes() {
    eyePairs.forEach(eyePair => {
        eyePair.remove();
    });
    eyePairs = [];
    birthTime = Date.now();
    updateEyeCount();
}

function getNextRoomUnlockTime() {
    const time = getExhibitionTime();
    
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
    
    let nextUnlockMinute;
    if (minutes < 2) nextUnlockMinute = 2;
    else if (minutes < 4) nextUnlockMinute = 4;
    else if (minutes < 6) nextUnlockMinute = 6;
    else nextUnlockMinute = 8;
    
    const now = new Date();
    const startTime = exhibitionConfig.startDate;
    const nextUnlockTime = new Date(startTime.getTime() + (nextUnlockMinute * 60 * 1000));
    const remainingMs = nextUnlockTime - now;
    
    const minutesRemaining = Math.floor(remainingMs / (1000 * 60));
    const secondsRemaining = Math.floor((remainingMs % (1000 * 60)) / 1000);
    
    const nextRoom = (nextUnlockMinute / 2) + 1;
    
    return `Room ${nextRoom} unlocks in ${minutesRemaining} minutes ${secondsRemaining} seconds`;
}

function updateHeaderText() {
    document.getElementById('headerText').textContent = getNextRoomUnlockTime();
}

function transitionToNewRoom() {
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

function updateRoomIndex() {
    const navItems = document.querySelectorAll('.room-nav-item');
    navItems.forEach(item => {
        const roomNum = parseInt(item.getAttribute('data-room'));
        if (roomNum === level) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateDoorAvailability() {
    const availableRooms = getAvailableRooms();
    const doorLeft = document.getElementById('doorLeft');
    const doorRight = document.getElementById('doorRight');
    
    if (level === 1) {
        doorLeft.classList.add('disabled');
    } else {
        doorLeft.classList.remove('disabled');
    }
    
    if (level === 5 || !availableRooms.includes(level + 1)) {
        doorRight.classList.add('disabled');
    } else {
        doorRight.classList.remove('disabled');
    }
}

function startLevel() {
    updatePlayArea();
    updateCursorBlur();
    updateRoomIndex(); 
    updateDoorAvailability();
    createEyePairs();
}

var doorLeft = document.getElementById('doorLeft');
var doorRight = document.getElementById('doorRight');

doorRight.addEventListener('click', () => {
    const availableRooms = getAvailableRooms();
    
    if (!availableRooms.includes(level + 1) || level >= 5) {
        return;
    }
    
    level++;
    if (level > 5) {
        level = 5;
    }
    
    clearAllEyes();
    updateRoomIndex();
    transitionToNewRoom();
    
    setTimeout(() => {
        startLevel();
    }, 100);
});

doorLeft.addEventListener('click', () => {
    if (level <= 1) {
        return;
    }
    
    level--;
    if (level < 1) {
        level = 1;
    }
    
    clearAllEyes();
    updateRoomIndex();
    transitionToNewRoom();
    
    setTimeout(() => {
        startLevel();
    }, 100);
});

var toggleBtn = document.querySelector('.toggle-btn');
var aboutContent = document.querySelector('.about-content');

toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    aboutContent.classList.toggle('show');
});

document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    const distance = Math.hypot(dx, dy);
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorElement.style.transform = `translate(${mouseX - 20}px, ${mouseY - 40}px)`;
    
    if (distance > 2) {
        isMoving = true;
        clearTimeout(movementTimeout);
        movementTimeout = setTimeout(() => {
            isMoving = false;
        }, 150);
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    updateMouseDistortion();
    requestAnimationFrame(updateEyes);
});

window.addEventListener('resize', () => {
    updatePlayArea();
});

createCursor();
startLevel();
updateHeaderText();
updateDoorAvailability();
growOverTime();




// Show random questions on the sides
const questions = [
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

function showRandomQuestions() {
    const leftBlock = document.querySelector('.question-left');
    const rightBlock = document.querySelector('.question-right');
    
    // Random questions for each side
    const leftQuestion = questions[Math.floor(Math.random() * questions.length)];
    const rightQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // Show left
    leftBlock.querySelector('.question-text').textContent = leftQuestion;
    leftBlock.style.display = 'block';
    
    // Show right
    rightBlock.querySelector('.question-text').textContent = rightQuestion;
    rightBlock.style.display = 'block';
    
    // Disappear after 10 seconds
    setTimeout(() => {
        leftBlock.style.display = 'none';
        rightBlock.style.display = 'none';
    }, 10000);
}

// Show questions every 1 minute (60000ms)
setInterval(showRandomQuestions, 5000);

// Show first questions after 1 minute
setTimeout(showRandomQuestions, 5000);

setInterval(updateHeaderText, 1000);