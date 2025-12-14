const animalData = {
    ocean: {
        dolphin: {
            name: "Chimpanzee",
            description: "Chimpanzees move together in patterns through synchronized movement, such as forming a conga line or walking in single file, and spontaneous alignment with auditory or visual rhythms. This collective action can be coordinated for specific behaviors like territorial patrols, or it can be a more general, rhythmic synchronization that happens naturally when moving together."
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



function loadAnimalData() {
    const currentAnimal = getCurrentAnimal();
    const currentEnvironment = getCurrentEnvironment(currentAnimal);
    
    
    const container = document.querySelector('.detail-container');
    container.setAttribute('data-environment', currentEnvironment);
    container.setAttribute('data-animal', currentAnimal);
    
    
    const nameElement = document.querySelector('.animal-name');
    if (animalData[currentEnvironment] && animalData[currentEnvironment][currentAnimal]) {
        nameElement.textContent = animalData[currentEnvironment][currentAnimal].name;
        
        
        const descElement = document.querySelector('.animal-description p');
        descElement.textContent = animalData[currentEnvironment][currentAnimal].description;
    }
    
    
    document.title = animalData[currentEnvironment][currentAnimal].name + " - Animal Movement";
}




document.addEventListener('DOMContentLoaded', loadAnimalData);