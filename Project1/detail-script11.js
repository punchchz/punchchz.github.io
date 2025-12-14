const animalData = {
    ocean: {
        dolphin: {
            name: "Meerkat",
            description: "Meerkats have a complex moving pattern based on cooperative movement, with groups coordinating travel through vocal communication, alternating between periods of slow, directed movement and fast movement. They use a vocal hotspot where individuals follow the highest rate of calls to maintain group cohesion"
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