
//Importing Constants :powerUpIntervals and upgrades are imported from "./constants/upgrades.js".
 //These likely contain configurations and values for different upgrades or boosts in the game.
 //defaultSkillValues and defaultUpgradeValues are imported from "./constants/defaultValues.js",
 //which likely define default values for skills and upgrades.


import { powerUpIntervals, upgrades } from "./constants/upgrades.js";
import { defaultSkillValues, defaultUpgradeValues } from "./constants/defaultValues.js";

let gem = document.querySelector(".gem-cost");
let parsedGem = parseFloat(gem.innerHTML);

let gpcText = document.getElementById("gpc-text")
let gpsText = document.getElementById("gps-text")

let gemImgContainer = document.querySelector('.gem-img-container')

let upgradesNavButton = document.getElementById('upgrades-nav-button')
let skillsNavButton = document.getElementById('skills-nav-button')
let artifactsNavButton = document.getElementById('artifacts-nav-button')

let prestigeButton = document.querySelector(".prestige-button")

let relic = document.getElementById("relic")

let gpc = 1;

let gps = 0;

const bgm = new Audio('/assets/audio/bgm.mp3')
bgm.volume = 0

//incrementGem(event)
//A new Audio object is created, pointing to a sound file (click.wav)\
function incrementGem(event) {
  const clickingSound = new Audio('/assets/audio/click.wav')
  clickingSound.play() //clickingSound.play(): Plays the clicking sound immediately when the function is called, giving audio feedback for each click.

  gem.innerHTML = Math.round(parsedGem += gpc); //Adds the current gpc and Rounds the result to the nearest integer to avoid displaying decimal points.
  //innerHTML Updates the inner HTML of the gem element to reflect the new

  const x = event.offsetX
  const y = event.offsetY

  const div = document.createElement('div') 
  div.innerHTML = `+${Math.round(gpc)}`   // to show how many gems were earned on this click, rounded to an integer.
  div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`
  gemImgContainer.appendChild(div) //Adds this newly created div to the gemImgContainer so it appears as part of the visual effect.

  div.classList.add('fade-up')

  timeout(div)
}
// This prevents a buildup of elements over time and ensures the effect is only temporary.
const timeout = (div) => {
  setTimeout(() => {
    div.remove()
  }, 800)
}
//Searches the upgrades array to find the upgrade object that matches the name of the upgrade parameter passed into the function
function buyUpgrade(upgrade) {
  const mu = upgrades.find((u) => {
    if (u.name === upgrade) return u
  })
//Finds the HTML element that represents the upgrade’s main display by its unique ID.
  const upgradeDiv = document.getElementById(`${mu.name}-upgrade`)
  const nextLevelDiv = document.getElementById(`${mu.name}-next-level`)
  const nextLevelP = document.getElementById(`${mu.name}-next-p`)

  //Checks if the player's current gems (parsedGem) are enough to cover the upgrade’s cost (mu.parsedCost).
  //If true, the player can afford the upgrade, so the function proceeds; otherwise, the purchase is not allowed.
  if (parsedGem >= mu.parsedCost) {
    const upgradeSound = new Audio('/assets/audio/upgrade.mp3')
    upgradeSound.volume = 0.1
    upgradeSound.play()

    //Deducts the upgrade cost from the player’s gem count and updates the gem element to display the new total.
    gem.innerHTML = Math.round(parsedGem -= mu.parsedCost); 

    //Retrieves the index of the current level (as a float) in power
    //This will determine if a level has a special effect.
    let index = powerUpIntervals.indexOf(parseFloat(mu.level.innerHTML))

    if ( index !== -1 ) {
      upgradeDiv.style.cssText = `border-color: white`;
      nextLevelDiv.style.cssText =  `background-color: #5A5959; font-weight: normal`;
      mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier)

      //Increases the upgrade’s cost by multiplying it with a predefined costMultiplier to make future purchases more expensive.
      //gpc Displays the next level’s increase in gems per second.

      if ( mu.name === 'clicker' ) {
        gpc *= mu.powerUps[index].multiplier
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per click`
      } else {
        gps -= mu.power
        mu.power *= mu.powerUps[index].multiplier
        gps += mu.power
        nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per second`
      }
    } 
//Increases the upgrade’s level by 1
    mu.level.innerHTML ++
//After incrementing the level, the function checks powerUpIntervals again
    index = powerUpIntervals.indexOf(parseFloat(mu.level.innerHTML))

    if ( index !== -1 ) {
      upgradeDiv.style.cssText = `border-color: orange`;
      nextLevelDiv.style.cssText =  `background-color: #CC4500; font-weight: bold`;
      nextLevelP.innerText = mu.powerUps[index].description

      mu.cost.innerHTML = Math.round(mu.parsedCost * 2.5 * 1.004 ** parseFloat(mu.level.innerHTML))
    } else {
      mu.cost.innerHTML = Math.round(mu.parsedCost *= mu.costMultiplier)
      mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.gemMultiplier).toFixed(2))

      if ( mu.name === 'clicker') nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per click`
      else nextLevelP.innerHTML = `+${mu.parsedIncrease} gems per second`
    }

    //  the function adds the increase directly to gpc
    //Otherwise, if the upgrade is related to Gems Per Second (gps), it adjusts gps by recalculating the current power level.
    if ( mu.name === 'clicker' ) gpc += mu.parsedIncrease
    else {
      gps -= mu.power
      mu.power += mu.parsedIncrease
      gps += mu.power
    }
  }
}

// Saves the current game state to localStorage, allowing the player’s progress to persist across sessions.
//Clears any previously saved data.
//Loops through each upgrade in the upgrades array.
//Stores gpc, gps, and parsedGem values separately for easy retrieval on load.
function save () {
  localStorage.clear()

  upgrades.map((upgrade) => {

    const obj = JSON.stringify({
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease
    })

    localStorage.setItem(upgrade.name, obj)

  })
  //Saves each upgrade's level, cost, and increase rate as JSON objects in localStorage.
  localStorage.setItem('gpc', JSON.stringify(gpc))
  localStorage.setItem('gps', JSON.stringify(gps))
  localStorage.setItem('gem', JSON.stringify(parsedGem))
}

//Purpose: Loads saved game data from localStorage.
//Retrieves stored values for each upgrade and assigns them to the appropriate properties.
//Updates gpc, gps, and parsedGem to match the stored values.
//Sets the gem element to reflect the loaded gem count.
function load () {
  upgrades.map((upgrade) => {
    const savedValues = JSON.parse(localStorage.getItem(upgrade.name))

    upgrade.parsedCost = savedValues.parsedCost
    upgrade.parsedIncrease = savedValues.parsedIncrease

    upgrade.level.innerHTML = savedValues.parsedLevel
    upgrade.cost.innerHTML = Math.round(upgrade.parsedCost)
    upgrade.increase.innerHTML = upgrade.parsedIncrease
  })

  gpc = JSON.parse(localStorage.getItem('gpc'))
  gps = JSON.parse(localStorage.getItem('gps'))
  parsedGem = JSON.parse(localStorage.getItem('gem'))

  gem.innerHTML = Math.round(parsedGem)
}

//Purpose is to Resets certain values to initiate a new "prestige" level, rewarding the player with a relic based on their previous gem count.
//Resets each upgrade to its default values.
//Calculates and displays the number of relics earned based on the player’s previous gem count.
//Resets gpc, gps, and parsedGem to their starting values.
function prestige () {
  upgrades.map((upgrade) => {
    const mu = defaultUpgradeValues.find((u) => { if (upgrade.name === u.name) return u })

    upgrade.parsedCost = mu.cost
    upgrade.parsedIncrease = mu.increase

    upgrade.level.innerHTML = 0
    upgrade.cost.innerHTML = mu.cost
    upgrade.increase.innerHTML = mu.increase

    const upgradeDiv = document.getElementById(`${mu.name}-upgrade`)
    const nextLevelDiv = document.getElementById(`${mu.name}-next-level`)
    const nextLevelP = document.getElementById(`${mu.name}-next-p`)

    upgradeDiv.style.cssText = `border-color: white`;
    nextLevelDiv.style.cssText =  `background-color: #5A5959; font-weight: normal`;
    nextLevelP.innerHTML = `+${mu.increase} gems per click`
  })

  relic.innerHTML = Math.ceil(Math.sqrt(parsedGem - 999999) / 300)

  gpc = 1
  gps = 0
  parsedGem = 0
  gem.innerHTML = parsedGem
}

//Runs every 100 milliseconds to update the player’s gem count and display relevant data.
//Adds gps (divided by 10 for per-second timing) to parsedGem.
//Updates HTML elements for gems, gpc, and gps.
//Plays background music continuously.
//Displays the prestige button if the player’s gems reach a threshold of 1 million.
setInterval(() => {
  parsedGem += gps / 10
  gem.innerHTML = Math.round(parsedGem)
  gpcText.innerHTML = Math.round(gpc)
  gpsText.innerHTML = Math.round(gps);
  bgm.play()
  
  if (parsedGem >= 1_000_000) {
    prestigeButton.style.display = "block"
  } else {
    prestigeButton.style.display = "none"
  }
}, 100)

//When the Skills tab is clicked, only the type-skill upgrades are displayed.
skillsNavButton.addEventListener("click", function() {
  const upgradeContainers = document.querySelectorAll(".upgrade")

  upgradeContainers.forEach((container) => {
    if ( container.classList.contains('type-skill') ) container.style.display = "flex"
    else container.style.display = "none"
  })
})

//When the Upgrades tab is clicked, only the type-upgrade upgrades are displayed.
upgradesNavButton.addEventListener("click", function() {
  const upgradeContainers = document.querySelectorAll(".upgrade")

  upgradeContainers.forEach((container) => {
    if ( container.classList.contains('type-upgrade')) container.style.display = "flex"
    else container.style.display = "none"
  })
})

//When the Artifacts tab is clicked, only the type-artifact upgrades are displayed.
artifactsNavButton.addEventListener("click", function() {
  const upgradeContainers = document.querySelectorAll(".upgrade")

  upgradeContainers.forEach((container) => {
    if ( container.classList.contains('type-artifact')) container.style.display = "flex"
    else container.style.display = "none"
  })
})

window.incrementGem = incrementGem
window.buyUpgrade = buyUpgrade 
window.save = save
window.load = load
window.prestige = prestige