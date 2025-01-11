<script>
document.addEventListener('DOMContentLoaded', function() {
  // Load existing data from LocalStorage
  loadExpenses();

  // Handle form submission
  document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    const dateBs = document.getElementById('date').value.trim();
    const title = document.getElementById('title').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value.trim());
    const price = parseFloat(document.getElementById('price').value.trim());
    const paid = document.getElementById('paid').checked;

    if (dateBs && title && !isNaN(quantity) && !isNaN(price)) {
      const total = quantity * price;
      const expense = { id: Date.now(), dateBs, title, quantity, price, total, paid };

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
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.setAttribute('data-id', expense.id);

    newRow.innerHTML = `
            <td>${expense.dateBs}</td>
            <td>${expense.title}</td>
            <td>${expense.quantity}</td>
            <td>${expense.price.toFixed(2)}</td>
            <td>${expense.total.toFixed(2)}</td>
            <td class="paid-status">${expense.paid ? 'Yes' : 'No'}
                <div class="action-btns mt-2" style="display: none;">
                    <button class="btn btn-success btn-sm mark-paid-btn">Mark as Paid</button>
                    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                </div>
            </td>
        `;

    // Add click event listener to toggle buttons visibility
    newRow.addEventListener('click', function() {
        const actionBtns = newRow.querySelector('.action-btns');
        if (actionBtns.style.display === 'none') {
            actionBtns.style.display = 'flex';
        } else {
            actionBtns.style.display = 'none';
        }
    });

    // Add event listener to mark as paid button
    newRow.querySelector('.mark-paid-btn').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering row click event
        const paidCell = newRow.querySelector('.paid-status');
        paidCell.innerHTML = 'Yes';

        // Update storage
        updateExpenseStatus(expense.id, true);
    });

    // Add event listener to delete button
    newRow.querySelector('.delete-btn').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering row click event
        const row = this.closest('tr');
        const uniqueId = row.getAttribute('data-id'); // Get the unique ID of that row

        row.classList.add('fade-out');
        setTimeout(() => {
            row.remove(); // Remove the row from the table
            deleteExpense(uniqueId); // Delete from LocalStorage using uniqueId
        }, 500); // Fade out and remove
    });
  }

  // Update expense status in LocalStorage
  function updateExpenseStatus(id, paid) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.map(expense => {
        if (expense.id == id) {
            expense.paid = paid;
        }
        return expense;
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  // Delete an expense from LocalStorage using unique ID
  function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.filter(expense => expense.id != id);
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
</script>
