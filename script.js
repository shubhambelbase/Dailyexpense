document.addEventListener('DOMContentLoaded', function() {
  // Load existing data from LocalStorage
  loadExpenses();
  updateTotals();

  // Handle form submission
  document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page
    
    const form = document.getElementById('expense-form');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const id = document.getElementById('expense-id').value;
    const dateBs = document.getElementById('date').value.trim();
    const title = document.getElementById('title').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value.trim());
    const price = parseFloat(document.getElementById('price').value.trim());
    const paid = document.getElementById('paid').checked;

    if (dateBs && title && !isNaN(quantity) && !isNaN(price)) {
      const total = quantity * price;
      const expense = { id: id ? parseInt(id) : Date.now(), dateBs, title, quantity, price, total, paid };

      if (id) {
        updateExpense(expense);
      } else {
        saveExpense(expense);
        addExpenseToTable(expense);
      }

      updateTotals();
      form.reset();
      document.getElementById('expense-id').value = '';
      document.querySelector('button[type="submit"]').textContent = 'Add Expense';
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
        <td class="paid-status">${expense.paid ? 'Yes' : 'No'}</td>
        <td>
            <div class="action-btns" style="display: none;">
                <button class="btn btn-success btn-sm mark-paid-btn">Mark as Paid</button>
                <button class="btn btn-warning btn-sm edit-btn">Edit</button>
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
        const row = this.closest('tr');
        const uniqueId = row.getAttribute('data-id');
        markAsPaid(uniqueId);
        updateTotals();
    });

    // Add event listener to edit button
    newRow.querySelector('.edit-btn').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering row click event
        const row = this.closest('tr');
        const uniqueId = row.getAttribute('data-id');
        editExpense(uniqueId);
    });

    // Add event listener to delete button
    newRow.querySelector('.delete-btn').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering row click event
        const row = this.closest('tr');
        const uniqueId = row.getAttribute('data-id');
        deleteExpense(uniqueId, row);
        updateTotals();
    });
  }

  // Mark an expense as paid in LocalStorage
  function markAsPaid(id) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.map(expense => {
        if (expense.id == id) {
            expense.paid = true;
        }
        return expense;
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the table row
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (row) {
        row.querySelector('.paid-status').textContent = 'Yes';
    }
  }

  // Edit an expense
  function editExpense(id) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses.find(expense => expense.id == id);

    if (expense) {
        document.getElementById('expense-id').value = expense.id;
        document.getElementById('date').value = expense.dateBs;
        document.getElementById('title').value = expense.title;
        document.getElementById('quantity').value = expense.quantity;
        document.getElementById('price').value = expense.price;
        document.getElementById('paid').checked = expense.paid;
        document.querySelector('button[type="submit"]').textContent = 'Update Expense';
    }
  }

  // Update an expense in LocalStorage and the table
  function updateExpense(updatedExpense) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.map(expense => expense.id == updatedExpense.id ? updatedExpense : expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the table row
    const row = document.querySelector(`tr[data-id='${updatedExpense.id}']`);
    if (row) {
        row.innerHTML = `
            <td>${updatedExpense.dateBs}</td>
            <td>${updatedExpense.title}</td>
            <td>${updatedExpense.quantity}</td>
            <td>${updatedExpense.price.toFixed(2)}</td>
            <td>${updatedExpense.total.toFixed(2)}</td>
            <td class="paid-status">${updatedExpense.paid ? 'Yes' : 'No'}</td>
            <td>
                <div class="action-btns" style="display: none;">
                    <button class="btn btn-success btn-sm mark-paid-btn">Mark as Paid</button>
                    <button class="btn btn-warning btn-sm edit-btn">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                </div>
            </td>
        `;

        // Re-add event listeners
        row.querySelector('.mark-paid-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering row click event
            const row = this.closest('tr');
            const uniqueId = row.getAttribute('data-id');
            markAsPaid(uniqueId);
            updateTotals();
        });

        row.querySelector('.edit-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering row click event
            const row = this.closest('tr');
            const uniqueId = row.getAttribute('data-id');
            editExpense(uniqueId);
        });

        row.querySelector('.delete-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering row click event
            const row = this.closest('tr');
            const uniqueId = row.getAttribute('data-id');
            deleteExpense(uniqueId, row);
            updateTotals();
        });
    }
  }

  // Delete an expense from LocalStorage and remove the row
  function deleteExpense(id, row) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.filter(expense => expense.id != id);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Remove the row with a fade-out effect
    row.classList.add('fade-out');
    setTimeout(() => {
        row.remove();
    }, 500);
  }

  // Update totals for paid and unpaid expenses
  function updateTotals() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let totalPaid = 0;
    let totalUnpaid = 0;

    expenses.forEach(expense => {
      if (expense.paid) {
        totalPaid += expense.total;
      } else {
        totalUnpaid += expense.total;
      }
    });

    document.getElementById('total-paid').textContent = totalPaid.toFixed(2);
    document.getElementById('total-unpaid').textContent = totalUnpaid.toFixed(2);
  }

  // Show the modal to input the title
  document.getElementById('download-pdf').addEventListener('click', function() {
    $('#titleModal').modal('show');
  });

  // Generate the PDF with the input title
  document.getElementById('generate-pdf').addEventListener('click', function() {
    const title = document.getElementById('pdf-title').value.trim();
    if (!title) {
        alert('Please enter a title.');
        return;
    }

    // Hide the modal
    $('#titleModal').modal('hide');

    // Temporarily hide the actions column
    const actionCols = document.querySelectorAll('#expense-table th:nth-child(7), #expense-table td:nth-child(7)');
    actionCols.forEach(col => col.style.display = 'none');

    // Create a new div to hold the title and table
    const element = document.createElement('div');
    element.innerHTML = `
        <h1 style="text-align: center; color: #007bff; margin-bottom: 20px;">${title}</h1>
        <div>${document.getElementById('expense-table').outerHTML}</div>
    `;

    // Configure the PDF generation options
    const options = {
      filename: 'expenses-report.pdf',
      html2canvas: { scale: 2 }, // Higher scale for better resolution
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate the PDF and download it
    html2pdf().from(element).set(options).save().then(function() {
      // Show the actions column again
      actionCols.forEach(col => col.style.display = '');
    });
  });

  // Add sorting functionality
  document.querySelectorAll('#expense-table th').forEach(headerCell => {
    headerCell.addEventListener('click', () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
      const currentIsAscending = headerCell.classList.contains('th-sort-asc');

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  });

  function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
      const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
      const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

      return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    while (tBody.firstChild) {
      tBody.removeChild(tBody.firstChild);
    }

    tBody.append(...sortedRows);

    table.querySelectorAll('th').forEach(th => th.classList.remove('th-sort-asc', 'th-sort-desc'));
    headerCell.classList.toggle('th-sort-asc', asc);
    headerCell.classList.toggle('th-sort-desc', !asc);
  }
});
