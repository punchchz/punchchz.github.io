const animalData = {
    ocean: {
        dolphin: {
            name: "Elephant",
            description: "Elephants move in large groups through a combination of matriarchal leadership, vocal coordination, and a hierarchical structure. The oldest female, or matriarch, leads the group to find resources, with the herd following her lead and cooperating to care for calves.  "
        }
    },
    sky: {
        eagle: {
            name: "Eagle",
            description: "eagles soar through the sky using large wingspans that catch thermal currents, allowing them to glide with minimal energy expenditure. they can reach speeds of 120-160 km/h during hunting dives. their hollow bones reduce weight while maintaining strength, and powerful talons enable precise prey capture mid-flight."
        }
    },
    forest: {
        fox: {
            name: "Fox",
            description: "foxes navigate dense forest undergrowth with agile running, jumping, and climbing movements. their slender bodies allow them to slip through tight spaces, while excellent hearing helps them locate prey beneath leaves and snow. they can reach speeds up to 48 km/h in short bursts and use their bushy tails for balance."
        }
    },
    desert: {
        camel: {
            name: "Camel",
            description: "camels move across desert terrain using a distinctive pacing gait where both legs on one side move together. their wide, padded feet prevent sinking into sand, and they can travel 40 km per day while carrying heavy loads. they can reach speeds of 65 km/h in short bursts and store fat in their humps for energy during long journeys."
        }
    }
};


const animalOrder = ['dolphin', 'eagle', 'fox', 'camel'];
const environmentOrder = ['ocean', 'sky', 'forest', 'desert'];


function getCurrentAnimal() {
    const urlParams = new URLSearchParams(window.location.search);
    const animal = urlParams.get('animal') || 'dolphin';
    return animal;
}


function getCurrentEnvironment(animal) {
    for (let env in animalData) {
        if (animalData[env][animal]) {
            return env;
        }
    }
    return 'ocean';
}

// Navigate to previous animal
function previousAnimal() {
    const currentAnimal = getCurrentAnimal();
    const currentIndex = animalOrder.indexOf(currentAnimal);
    const previousIndex = (currentIndex - 1 + animalOrder.length) % animalOrder.length;
    const previousAnimal = animalOrder[previousIndex];
    
    window.location.href = `animal-detail.html?animal=${previousAnimal}`;
}

// Navigate to next animal
function nextAnimal() {
    const currentAnimal = getCurrentAnimal();
    const currentIndex = animalOrder.indexOf(currentAnimal);
    const nextIndex = (currentIndex + 1) % animalOrder.length;
    const nextAnimal = animalOrder[nextIndex];
    
    window.location.href = `animal-detail.html?animal=${nextAnimal}`;
}

// Load animal data on page load
function loadAnimalData() {
    const currentAnimal = getCurrentAnimal();
    const currentEnvironment = getCurrentEnvironment(currentAnimal);
    
    // Set environment for background
    const container = document.querySelector('.detail-container');
    container.setAttribute('data-environment', currentEnvironment);
    container.setAttribute('data-animal', currentAnimal);
    
    // Update animal name
    const nameElement = document.querySelector('.animal-name');
    if (animalData[currentEnvironment] && animalData[currentEnvironment][currentAnimal]) {
        nameElement.textContent = animalData[currentEnvironment][currentAnimal].name;
        
        // Update description
        const descElement = document.querySelector('.animal-description p');
        descElement.textContent = animalData[currentEnvironment][currentAnimal].description;
    }
    
    // Update page title
    document.title = animalData[currentEnvironment][currentAnimal].name + " - Animal Movement";
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        previousAnimal();
    } else if (e.key === 'ArrowRight') {
        nextAnimal();
    } else if (e.key === 'Escape') {
        window.location.href = 'index.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAnimalData);