const balance = document.getElementById("balance");
const inflow = document.getElementById("income");
const outflow = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

//Add userPreferencesPage
const userPreferences = {
  theme: 'light',
  fontSize: '16px',
  language: 'en',
  // Add other preferences as needed
}

function loadUserPreferences() {
  const storedPreferences = JSON.parse(localStorage.getItem('userPreferences'));
  if (storedPreferences) {
    Object.assign(userPreferences, storedPreferences);
  }
}

window.addEventListener('load', loadUserPreferences);

function saveUserPreferences() {
  localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

// Example usage:
userPreferences.theme = 'dark'; // Set a new preference
saveUserPreferences(); // Save the updated preferences to local storage

function applyTheme() {
  document.body.classList.toggle('dark-theme', userPreferences.theme === 'dark');
}

// Call this function after loading user preferences and whenever the user changes the theme preference
applyTheme();

//End of User Preferences

// Get transactions from local storage
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions =
  localStorage.getItem("transactions") !== null
    ? localStorageTransactions
    : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    document.getElementById("error_msg").innerHTML =
      "<span>Error: Please enter description and amount</span>";
    setTimeout(() => (document.getElementById("error_msg").innerHTML = ""), 5000);
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDCM(transaction);

    updateValue();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Transaction history
function addTransactionDCM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} ${sign}${Math.abs(transaction.amount)} 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, inflow, and outflow
function updateValue() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((bal, value) => (bal += value), 0).toFixed(2);
  const income = amounts
    .filter((value) => value > 0)
    .reduce((bal, value) => (bal += value), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((value) => value < 0)
      .reduce((bal, value) => (bal += value), 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  inflow.innerText = `$${income}`;
  outflow.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  start();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Start app
function start() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDCM);
  updateValue();
}

start();
form.addEventListener("submit", addTransaction);
