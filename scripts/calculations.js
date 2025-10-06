// 2.VARIABLES INICIALES

let budgetValue = 0;
let totalExpensesValue = 0;
let balanceColor = "green";

// 3. ARRAY DE GASTOS INICIALES

const allowedCategories = [
  "groceries",
  "restaurants",
  "transport",
  "home",
  "subscriptions",
];

const expenseEntries = [
  ["groceries", 33],
  ["restaurants", 50],
  ["transport", 12],
  ["home", 70],
  ["subscriptions", 14],
  ["groceries", 28],
  ["subscriptions", 12],
];

// 4. CALCULAR LOS GASTOS TOTALES

function calculateTotalExpenses() {
  totalExpensesValue = 0; // reiniciamos antes de sumar

  for (const [, amountRaw] of expenseEntries) {
    const amount = Number(amountRaw) || 0;
    totalExpensesValue += amount;
    console.log(
      `Valor total de los gastos después de añadir ${amount}: ${totalExpensesValue}`
    );
  }

  console.log("Valor total de los gastos:", totalExpensesValue);
  return totalExpensesValue;
}

// 5. CALCULAR EL GASTO MEDIO
function calculateAverageExpense() {
  // Si no existe el array o está vacío, devolvemos 0 (evita NaN)
  if (!Array.isArray(expenseEntries) || expenseEntries.length === 0) {
    console.log("No hay gastos. Gasto promedio: 0");
    return 0;
  }

  // Sumar todas las cantidades
  let total = 0;
  for (const [, amountRaw] of expenseEntries) {
    const amount = Number(amountRaw) || 0; // seguridad por si viene string u otro
    total += amount;
  }

  // Calcular promedio
  const average = total / expenseEntries.length;

  // Mostrar en consola para depuración
  console.log("Gasto total:", total);
  console.log("Número de gastos:", expenseEntries.length);
  console.log("Gasto promedio calculado:", average);

  return average;
}

//6. CALCULAR EL SALDO - Calcula el balance: budgetValue - totalExpenses

function calculateBalance() {
  const budget = Number(budgetValue) || 0;

  // obtener total más reciente
  const total =
    typeof calculateTotalExpenses === "function"
      ? calculateTotalExpenses()
      : Number(totalExpensesValue) || 0;

  const balance = budget - total;

  // mantener la variable global si la usas
  totalExpensesValue = total;

  if (typeof updateBalanceColor === "function") {
    updateBalanceColor(balance);
  }

  console.log("Budget:", budget, "Total gastos:", total, "Balance:", balance);
  return balance;
}

// 7. CAMBIAR EL COLOR DEL SALDO & PRESUPUESTO

function updateBalanceColor(balance) {
  const budget = Number(budgetValue) || 0;
  const bal = Number(balance) || 0;
  const balanceElement = document.getElementById("balance-value");

  console.log("Elemento encontrado:", balanceElement);

  if (bal < 0) {
    balanceColor = "red";
    // Aplicar clase para rojo
    if (balanceElement) {
      balanceElement.className =
        "stats__item-value stats__item-value_balance stats__item-value_balance_negative";
    }
  } else if (budget > 0 && bal < 0.25 * budget) {
    balanceColor = "orange";
    // Aplicar clase para naranja
    if (balanceElement) {
      balanceElement.className =
        "stats__item-value stats__item-value_balance stats__item-value_balance_warning";
    }
  } else {
    balanceColor = "green";
    // Aplicar clase para verde
    if (balanceElement) {
      balanceElement.className =
        "stats__item-value stats__item-value_balance stats__item-value_balance_positive";
    }
  }

  console.log(
    "updateBalanceColor -> balance:",
    bal,
    " budget:",
    budget,
    " color:",
    balanceColor
  );
  return balanceColor;
}

// 8. ESTADISTICAS POR CATEGORIAS

function calculateCategoryExpenses(category) {
  // validación básica
  if (typeof category !== "string" || !Array.isArray(expenseEntries)) return 0;

  const target = category.trim().toLowerCase();
  let total = 0;

  // iteramos el array expenseEntries
  for (const entry of expenseEntries) {
    // seguridad: esperar sub-array [categoria, monto]
    if (!Array.isArray(entry) || entry.length < 2) continue;

    const entryCategory = String(entry[0] || "")
      .trim()
      .toLowerCase();
    const entryAmount = Number(entry[1]) || 0;

    // condicional: si la categoría coincide, sumar
    if (entryCategory === target) {
      total += entryAmount;
    }
  }

  return total;
}

// 9. LA CATEGORIA DE GASTOS MAS GRANDE

function calculateLargestCategory() {
  // Seguridad básica
  if (!Array.isArray(allowedCategories) || allowedCategories.length === 0)
    return null;
  if (typeof calculateCategoryExpenses !== "function") {
    console.warn(
      "Necesitas calculateCategoryExpenses() para que esto funcione."
    );
    return null;
  }

  const categoriesData = []; // [['groceries', 61], ['restaurants',50], ...]
  let maxTotal = -Infinity;
  let maxCategory = null;

  for (const cat of allowedCategories) {
    const total = Number(calculateCategoryExpenses(cat)) || 0;
    categoriesData.push([cat, total]);

    if (total > maxTotal) {
      maxTotal = total;
      maxCategory = cat;
    }
    // Si hay empate, esta implementación mantiene la primera categoría encontrada con el total máximo.
  }

  // Log para depuración (puedes quitarlo en producción)
  console.log("categoriesData:", categoriesData);
  console.log("Categoría con gasto más alto:", maxCategory, "con", maxTotal);

  return maxCategory;
}

// 10. NUEVOS GASTOS

function addExpenseEntry(entry) {
  if (!entry) return null;

  let category;
  let amountRaw;

  if (Array.isArray(entry)) {
    category = entry[0];
    amountRaw = entry[1];
  } else if (typeof entry === "object" && entry !== null) {
    category = entry.category ?? entry.cat ?? entry[0];
    amountRaw = entry.amount ?? entry.value ?? entry[1];
  } else {
    return null;
  }

  if (typeof category !== "string") return null;
  const categoryNorm = category.trim().toLowerCase();

  // Normalizar y validar amount
  let amount;
  if (typeof amountRaw === "string") {
    const cleaned = amountRaw.replace(/[^\d.-]/g, "").trim();
    amount = Number(cleaned);
  } else {
    amount = Number(amountRaw);
  }
  if (!Number.isFinite(amount)) return null;

  const newEntry = [categoryNorm, amount];
  expenseEntries.push(newEntry);

  // Actualizar totalExpensesValue usando la función central si existe, si no sumar
  if (typeof calculateTotalExpenses === "function") {
    totalExpensesValue = calculateTotalExpenses();
  } else {
    totalExpensesValue = (Number(totalExpensesValue) || 0) + amount;
  }

  // Recalcular balance/color si las funciones existen
  if (typeof calculateBalance === "function") {
    const currentBalance = calculateBalance();
    if (typeof updateBalanceColor === "function")
      updateBalanceColor(currentBalance);
  } else if (typeof updateBalanceColor === "function") {
    const fallbackBalance = (Number(budgetValue) || 0) - totalExpensesValue;
    updateBalanceColor(fallbackBalance);
  }

  return newEntry;
}
