document.addEventListener('DOMContentLoaded', function() {
  // Load existing data from LocalStorage
  loadExpenses();

  // Handle form submission
  document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    const dateBs = document.getElementById('date').value.trim();
    const material = document.getElementById('material').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value.trim());
    const price = parseFloat(document.getElementById('price').value.trim());

    if (dateBs && material && !isNaN(quantity) && !isNaN(price)) {
      const total = quantity * price;
      const expense = { dateBs, material, quantity, price, total };

      saveExpense(expense);
      addExpenseToTable(expense);

      document.getElementById('expense-form').reset();
    } else {
      alert('Please fill all fields correctly.');
    }
  });

  // Save expense to LocalStorage
  function saveExpense(expense) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  // Load expenses from LocalStorage
  function loadExpenses() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(expense => addExpenseToTable(expense));
  }

  // Add an expense to the table
  function addExpenseToTable(expense) {
    const table = document.getElementById('expense-table');
    const newRow = table.insertRow();
    newRow.innerHTML = `
            <td>${expense.dateBs}</td>
            <td>${expense.material}</td>
            <td>${expense.quantity}</td>
            <td>${expense.price.toFixed(2)}</td>
            <td>${expense.total.toFixed(2)}</td>
        `;
  }
});
