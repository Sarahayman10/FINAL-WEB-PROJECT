// Select the cigarettes section element
const cigarettesSection = document.querySelector('.category-section');

// Function to check the user's age
function ageCheck() {
  const userAge = prompt("Please enter your age:");
  
  if (userAge === null) {
    // User canceled the prompt
    alert("Access denied.");
    window.location.href = "../../category.html";
    return;
  }

  if (isNaN(userAge) || userAge < 21) {
    alert("You must be 21 or older to access this section.");
    window.location.href = "../../category.html";
  } else {
    alert("Welcome to the Cigarettes & Heets section.");
  }
}

// Run ageCheck when the user enters the section
window.addEventListener('load', ageCheck);
