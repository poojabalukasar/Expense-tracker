let expense_form = document.getElementById("expense-form");
let exp_Amount = document.getElementById("amount");
let exp_Desc = document.getElementById("description");
let exp_category = document.getElementById("category");
let exp_list = document.getElementById("expense-list");

function displayExpenses() {
  exp_list.innerHTML = "";
  for (const id in expenses) {
    const expense = expenses[id];
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = `<span>${expense.expAmount} - ${expense.expDesc} - ${expense.expCate}</span>
      <button type="button" class="btn btn-danger btn-sm float-right ml-2 delete-btn" data-id="${id}">Delete Expense</button>
      <button type="button" class="btn btn-primary btn-sm float-right edit-btn" data-id="${id}">Edit Expense</button>`;

    exp_list.appendChild(listItem);
  }
}

let expenses = JSON.parse(localStorage.getItem("expenses")) || {};

function addExpense() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

expense_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const expAmount = exp_Amount.value;
  const expDesc = exp_Desc.value;
  const expCate = exp_category.value;

  const id = Date.now().toString();
  const expense = {
    id,
    expAmount,
    expDesc,
    expCate,
  };

  expenses[id] = expense;
  addExpense();

  exp_Amount.value = "";
  exp_Desc.value = "";
  exp_category.value = "food";

  displayExpenses();
});

///delete fun

function deleteExpenses(id) {
  if (expenses[id]) {
    delete expenses[id];
    addExpense();
    displayExpenses();
  }
}

//edit

function editExpense(id) {
  let newExp = expenses[id];
  if (newExp) {
    exp_Amount.value = newExp.expAmount;
    exp_Desc.value = newExp.expDesc;
    exp_category.value = newExp.expCate;

    deleteExpenses(id);

    expense_form.removeEventListener("submit", addEditedExpenses);
    expense_form.addEventListener("submit", (e) => {
      e.preventDefault();

      const newAmt = exp_Amount.value;
      const newDesc = exp_Desc.value;
      const newCate = exp_category.value;

      const editedExpense = {
        id,
        expAmount: newAmt,
        expDesc: newDesc,
        expCate: newCate,
      };

      expenses[id] = editedExpense;

      addExpense();
      exp_Amount.value = "";
      exp_Desc.value = "";
      exp_category.value = "food";

      expense_form.removeEventListener("submit", editExpense);
      expense_form.addEventListener("submit", addEditedExpenses);
    });
  }
}

exp_list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    deleteExpenses(id);
  } else if (e.target.classList.contains("edit-btn")) {
    const id = e.target.getAttribute("data-id");
    editExpense(id);
  }
});

function loadExpenses() {
  let storedExp = JSON.parse(localStorage.getItem("expenses"));
  if (storedExp) {
    expenses = storedExp;
    displayExpenses();
  }
}

loadExpenses();
