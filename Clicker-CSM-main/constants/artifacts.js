import { defaultArtifactValues } from "./defaultValues";
//upgradesContainer is a reference to an HTML element with the ID upgrades-container, where the new elements will be added.
//This is a template string containing placeholders in {{key}} format, which will be replaced with actual values from each defaultArtifactValues object
function createUpgrades() {
  const upgradesContainer = document.getElementById('upgrades-container')
  const template = document.getElementById('upgrade-template').textContent

//For each object obj in the defaultArtifactValues array, a copy of the template string is made and stored in html.
//This way, all placeholders in the html string are replaced with actual values from obj
  defaultArtifactValues.forEach((obj) => {
    let html = template;

    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, obj[key])
    });

    upgradesContainer.innerHTML += html
  })
}

createUpgrades()
