const defaultExpenses = [...expenseEntries];

function saveToLocalStorage(itemName, itemValue) {
  if (Array.isArray(itemValue)) {
    itemValue = JSON.stringify(itemValue);
  }
  localStorage.setItem(itemName, itemValue);
}

function loadFromLocalStorage() {
  const storedBudgetValue = localStorage.getItem("budgetValue");
  const storedExpenseEntries = localStorage.getItem("expenseEntries");

  if (storedBudgetValue) {
    budgetValue = parseFloat(storedBudgetValue);
  } else {
    saveToLocalStorage("budgetValue", budgetValue);
  }

  if (storedExpenseEntries) {
    const parsedEntries = JSON.parse(storedExpenseEntries);
    expenseEntries.length = 0;
    expenseEntries.push(...parsedEntries);

    totalExpensesValue = 0;
    for (const expense of expenseEntries) {
      totalExpensesValue += expense[1];
    }
  } else {
    saveToLocalStorage("expenseEntries", expenseEntries);
  }
}

loadFromLocalStorage();
updateExpensesList(expenseEntries);
setStats();
