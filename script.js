const income = document.getElementById("income")
const expense = document.getElementById("expense")
const balance = document.getElementById("balance")
const description = document.getElementById("description")
const amount = document.getElementById("amount")
const dropdown = document.getElementById("dropdown")
const addBtn = document.getElementById("addBtn")
const ResetBtn = document.getElementById("ResetBtn")
const taskList = document.getElementById("taskList");
const filterAll = document.getElementById("filterAll");
const filterIncome = document.getElementById("filterIncome");
const filterExpenses = document.getElementById("filterExpenses");

let descriptArray = JSON.parse(localStorage.getItem("description") || "[]");
let amountArray = JSON.parse(localStorage.getItem("amount") || "[]");
let categoryArray = JSON.parse(localStorage.getItem("category") || "[]");
let incomeVal = JSON.parse(localStorage.getItem("income")) || Number(0);
let expenseVal = JSON.parse(localStorage.getItem("expense")) || Number(0);
let balanceVal = JSON.parse(localStorage.getItem("balance")) || Number(0);

dispSelectedList("All")
displayAmount()
editIndex = null;
olddescriptionVal = null;
oldamountVal = null;
oldcategoryVal = null;
//Function to update the value of income,expense and balance
function updateAmount(categoryVal, amountVal, action) {
    console.log("updateAmount function")
    if (action === "add") {
        if (categoryVal == "Income") {
            incomeVal += amountVal
        }
        else {
            expenseVal += amountVal
        }
    }
    //update the income,expense and balance, after user clicks delete
    else {
        console.log("incomeVal before ", incomeVal)
        console.log("expenseVal before ", expenseVal)
        if (categoryVal == "Income") {
            incomeVal -= amountVal
        }
        else {
            expenseVal -= amountVal
        }
        console.log("incomeVal after ", incomeVal)
        console.log("expenseVal after ", expenseVal)
    }

    balanceVal = incomeVal - expenseVal
    //Update /Set the income,expense and net balance after user adds
    income.textContent = incomeVal
    expense.textContent = expenseVal
    balance.textContent = balanceVal
    //Update the local storage values also
    localStorage.setItem("income", JSON.stringify(incomeVal))
    localStorage.setItem("expense", JSON.stringify(expenseVal))
    localStorage.setItem("balance", JSON.stringify(balanceVal))
}

function adjustAmount(oldcategoryVal, oldamountVal, newcategoryVal, newamountVal) {
    console.log("oldamountVal ", oldamountVal)
    console.log("newamountVal ", newamountVal)
    console.log("old incomeVal ", incomeVal)
    console.log("old expenseVal ", expenseVal)
    if (oldcategoryVal === "Income") {
        incomeVal -= oldamountVal;
        if (newcategoryVal === "Income") {
            console.log(" 1")
            incomeVal += newamountVal;
        }

        else {
            console.log("1 2")
            expenseVal += newamountVal;
        }
    }
    else {
        expenseVal -= oldamountVal;
        if (newcategoryVal === "Expense") {
            console.log("expenseVal before ", expenseVal)
            console.log("2 1");
            expenseVal += newamountVal;
            console.log("expenseVal after ", expenseVal)
        }
        else {
            console.log("2 2")
            incomeVal += newamountVal;
        }
    }
    balanceVal = incomeVal - expenseVal;
    //Update /Set the income,expense and net balance after user updates
    income.textContent = incomeVal
    expense.textContent = expenseVal
    balance.textContent = balanceVal
    //Update the local storage values also
    localStorage.setItem("income", JSON.stringify(incomeVal))
    localStorage.setItem("expense", JSON.stringify(expenseVal))
    localStorage.setItem("balance", JSON.stringify(balanceVal))
}
//Function to add the list of expenses and income 
function addList() {
    let descriptionVal = description.value;
    let amountVal = Number(amount.value);
    let categoryVal = dropdown.value;
    if (descriptionVal === "" || amountVal === "") {
        return;
    }

    if (editIndex === null) {
        console.log("editIndex ", editIndex)
        //Call the function updateAmount to update income, expense and balance in UI and local storage
        updateAmount(categoryVal, amountVal, "add");
        descriptArray.push(descriptionVal);
        amountArray.push(amountVal);
        categoryArray.push(categoryVal);
        localStorage.setItem("description", JSON.stringify(descriptArray))
        localStorage.setItem("amount", JSON.stringify(amountArray));
        localStorage.setItem("category", JSON.stringify(categoryArray))

    }
    else {
        console.log("editIndex ", editIndex)
        updateList(editIndex);
        addBtn.innerText = "ADD";
        adjustAmount(oldcategoryVal, oldamountVal, categoryVal, amountVal)
        editIndex = null;
    }
    const selectedcategory = document.querySelector('input[name="filter"]:checked')
    dispSelectedList(selectedcategory.nextSibling.textContent.trim());

    description.value = "";
    amount.value = "";
}

addBtn.addEventListener("click", addList)
ResetBtn.addEventListener("click", () => {
    description.value = "";
    amount.value = "";
})

filterAll.addEventListener("click", () => {
    console.log("filter selected ")
    dispSelectedList("All");
})

filterIncome.addEventListener("click", () => {
    console.log("Income filter selected ")
    dispSelectedList("Income");
})

filterExpenses.addEventListener("click", () => {
    console.log("Expenses filter selected ")
    dispSelectedList("Expense");
})


//Function to display the amount 
function displayAmount() {
    income.textContent = incomeVal
    expense.textContent = expenseVal
    balance.textContent = balanceVal
}

function dispSelectedList(category) {
    taskList.innerHTML = "";
    descriptArray.forEach((element, index) => {
        let elementAmount = amountArray[index];
        let elementCategory = categoryArray[index];
        if (category === elementCategory || category === "All") {
            let taskEle = document.createElement("li")
            taskEle.innerHTML = `<div class="elements2">
                                    <span>${element} </span>
                                    <span>${elementAmount} </span>
                                </div>
                                <div class="button2">
                                <button class="button2Edit">Edit</button>
                                <button class="button2Delete">Delete</button>
                                </div>
                                `;
            taskList.appendChild(taskEle);
            const editButton = taskEle.querySelector(".button2Edit")
            const deleteButton = taskEle.querySelector(".button2Delete")
            editButton.addEventListener("click", () => {
                editIndex = index;
                description.focus();
                olddescriptionVal = description.value = element;
                oldamountVal = amount.value = elementAmount;
                oldcategoryVal = dropdown.value = elementCategory;
                addBtn.innerText = "UPDATE";
            })
            deleteButton.addEventListener("click", () => {
                taskEle.innerHTML = "";
                deleteItem(index)
            })
        }
    });
}


function updateList(index) {
    descriptArray[index] = description.value;
    amountArray[index] = Number(amount.value);
    categoryArray[index] = dropdown.value;
    if (descriptArray[index] === "" || descriptArray[index] === "") {
        return;
    }
    console.log("index ", index)
    console.log("descriptArray[index] ", descriptArray[index])
    console.log("amountArray[index]  ", amountArray[index])
    console.log("categoryArray[index] ", categoryArray[index])
    console.log("descriptArray after updation ", descriptArray)
    console.log("amountArray after updation ", amountArray)
    console.log("categoryArray after updation ", categoryArray)
    localStorage.setItem("description", JSON.stringify(descriptArray))
    localStorage.setItem("amount", JSON.stringify(amountArray));
    localStorage.setItem("category", JSON.stringify(categoryArray))
}

function deleteItem(deleteindex) {
    amountVal = amountArray[deleteindex];
    categoryVal = categoryArray[deleteindex];
    //Call the function updateAmount to update income, expense and balance in UI and local storage
    updateAmount(categoryVal, amountVal, "delete");
    descriptArray.splice(deleteindex, 1)
    amountArray.splice(deleteindex, 1)
    categoryArray.splice(deleteindex, 1)
    localStorage.setItem("description", JSON.stringify(descriptArray))
    localStorage.setItem("amount", JSON.stringify(amountArray))
    localStorage.setItem("category", JSON.stringify(categoryArray))
    const selectedcategory = document.querySelector('input[name="filter"]:checked')
    dispSelectedList(selectedcategory.nextSibling.textContent.trim());
    //delete the existing input field
    if(editIndex === deleteindex)
    {
        description.value="";
        amount.value="";
        addBtn.textContent = "ADD"
        editIndex = null;
    }

}
