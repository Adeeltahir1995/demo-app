const apiBaseUrl = 'http://localhost:3000/api/';
const tableHeader = ['No', 'Category', 'Amount', 'CreatedAt', 'Description']
const tableBody = [{
        'category': 'Food',
        'amount': 12,
        'description': 'expensee'
    },
    {
        'category': 'other',
        'amount': 122,
        'description': 'expensee 222'
    }
];
const tableColoumns = tableHeader.length;
let expenses;

const categoryAmounts = {
    'food': 0,
    'grocery': 0,
    'medicine': 0,
    'travel': 0,
    'tution': 0,
    'other': 0,
    'total': 0,
}

$(document).ready(function () {
    getExpenses();
});

function openForm() {
    $('#add-form').addClass('form-opened');
    $('#add-form').removeClass('form-closed');
}

function closeForm() {
    $('#add-form').addClass('form-closed');
    $('#add-form').removeClass('form-opened');
    clearForm();
}

function clearForm() {
    $("#descriptionInput").val('');
    $("#amountInput").val(0);
}

function getExpenses() {
    $.get(apiBaseUrl + 'getExpenses', (data, status) => {
        expenses = JSON.parse(data);
        initSectionOneData();
        populateTableHeader();
        populateTableBody();
    });
}

function initSectionOneData() {

    let total = 0 ;
    expenses.forEach(expense => {
        categoryAmounts[expense.category.toLocaleLowerCase()] += expense.amount;
        total += expense.amount;
    });
    categoryAmounts.total = total;
    Object.keys(categoryAmounts).forEach((category) => {
        $('#' + category + '-circle').text(categoryAmounts[category] + ' $');
    })
}

function populateTableHeader() {

    var table_body;
    table_body += '<tr>';
    for (var j = 0; j < tableColoumns; j++) {
        table_body += '<th>';
        table_body += tableHeader[j];
        table_body += '</th>';
    }
    table_body += '</tr>';
    $('#table-body').html(table_body);
}

function populateTableBody() {
    var table_body;
    for (var i = 0; i < expenses.length; i++) {
        table_body += '<tr>';
        for (var j = 0; j < tableColoumns; j++) {
            table_body += '<td>';
            let key = tableHeader[j].toLocaleLowerCase();
            key = key === 'createdat' ? 'createdAt' : key;
            table_body += j ? expenses[i][key] : i + 1;
            table_body += '</td>';
        }
        table_body += '</tr>';
    }
    $('#table-body').append(table_body);
}

function addExpense() {

    const data = {
        "description": "",
        "amount": 0,
        "category": "",
        "createdAt": "2020-02-02T19:00:00.000Z"
    };
    data.description = $("#descriptionInput").val();
    data.amount = parseInt($('#amountInput').val());
    data.category = $("#categoryInput option:selected").text();
    data.createdAt = new Date().toISOString();

    if (validateForm(data)) {

        $.ajax({
            url: apiBaseUrl + 'addExpense',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),

            success: (response) => {
                console.log('response  =  ', response);

                if (response === "success") {
                    showToaster('Expense Addedd Successfully');
                    this.expenseAdded(data);
                } else if (response === "error") {
                    showToaster('An error Occured');
                    console.log('err');
                } else {
                    console.log('final');
                }
            },
            error: (err) => {
                showToaster('An error Occured');
                console.log('err = ', err);
            }
        });
    }
}

function expenseAdded(data) {
    
    expenses.push(data);
    const index = expenses.length - 1;
    var table_row;
    table_row += '<tr>';
    for (var j = 0; j < tableColoumns; j++) {
        table_row += '<td>';
        let key = tableHeader[j].toLocaleLowerCase();
        key = key === 'createdat' ? 'createdAt' : key;
        table_row += j ? expenses[index][key] : index + 1;
        table_row += '</td>';
    }
    table_row += '</tr>';
    $('#table-body').append(table_row);

    updateCircleValues(data);
    

}

function updateCircleValues(data) {
    const category = data.category.toLocaleLowerCase();
    categoryAmounts[category] += data.amount;
    $('#' + category + '-circle').text(categoryAmounts[category] + ' $');

    categoryAmounts.total += data.amount;
    $('#total-circle').text(categoryAmounts.total + ' $');

}

function validateForm(data) {

    $("#error").text("");

    if (!data.amount > 0) {
        console.log('errr');

        $("#error").text("Kindly enter valid amount");
        return false;
    }
    return true;
}

function showToaster(text) {
    
    var x = document.getElementById("toaster");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    x.innerText = text
}