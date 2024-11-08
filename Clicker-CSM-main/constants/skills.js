import { defaultSkillValues } from "./defaultValues.js";

function createUpgrades() {
  // Get the HTML element where the upgrades will be added
  const upgradesContainer = document.getElementById('upgrades-container')
  // Get the template content to use for each upgrade
  const template = document.getElementById('upgrade-template').textContent

  // Loop through each skill in defaultSkillValues
  defaultSkillValues.forEach((obj) => {
    //// Make a copy of the template for each skill
    let html = template;

    // Replace placeholders in the template with actual values from the skill object
    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, obj[key])
    });

    upgradesContainer.innerHTML += html
  })
}
// Call the function to generate and display the upgrades
createUpgrades()
