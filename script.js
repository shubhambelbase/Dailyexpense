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

    // Add a unique data-id attribute to each row
    const uniqueId = Date.now(); // Use timestamp as a unique identifier
    newRow.setAttribute('data-id', uniqueId);

    newRow.innerHTML = `
            <td>${expense.dateBs}</td>
            <td>${expense.material}</td>
            <td>${expense.quantity}</td>
            <td>${expense.price.toFixed(2)}</td>
            <td>${expense.total.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm delete-btn">Delete</button></td>
        `;

    // Add event listener to the delete button inside the row
    const deleteButton = newRow.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function() {
      // Show confirmation dialog
      const confirmation = confirm('Are you sure you want to delete this entry?');
      if (confirmation) {
        try {
          // Safely delete from LocalStorage and table using unique data-id
          const row = deleteButton.closest('tr'); // Find the closest row to the button
          const uniqueId = row.getAttribute('data-id'); // Get the unique ID of that row
          deleteExpense(uniqueId); // Delete from LocalStorage using uniqueId

          // Add fade-out animation before removing the row
          row.classList.add('fade-out');
          setTimeout(function() {
            row.remove(); // Remove the row from the table after animation
          }, 500); // Delay for the fade-out effect (500ms)
        } catch (error) {
          console.error("Error deleting the row:", error);
        }
      }
    });
  }

  // Delete an expense from LocalStorage using unique ID
  function deleteExpense(uniqueId) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    // Remove expense by matching the unique ID
    expenses = expenses.filter(expense => expense.uniqueId !== uniqueId);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  // Download as PDF using html2pdf.js
  document.getElementById('download-pdf').addEventListener('click', function() {
    const element = document.getElementById('expense-table');

    // Configure the PDF generation options
    const options = {
      filename: 'expenses-report.pdf',
      html2canvas: { scale: 2 }, // Higher scale for better resolution
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate the PDF and download it
    html2pdf().from(element).set(options).save();
  });
});
