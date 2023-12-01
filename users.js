function users_management(customer_id) {
    const users_div = $('#users')
    users_div.removeAttr('hidden')

    // logout button
    const logout_btn = $('#users-logout')
    logout_btn.on('click', function() {
        // hidden admin
        users_div.attr('hidden', true)
        // show login UI
        const content = $('#content')
        content.removeAttr('hidden')
    })

    // update button text
    $('#dropdown-menu li a').on('click', function() {
        $(this).parent().parent().parent().children(':first').text($(this).text())
    })

    // activate input fields
    const menus = $('#dropdown-menu li a')
    $(menus[0]).on('click', function() {
        $('#input-month').attr('hidden', 'true')
        $('#input-year').attr('hidden', 'true')

        // query the sql
        query = [""
            ,"SELECT *\n"
            ,"FROM transactions t\n"
            ,"    JOIN cart c\n"
            ,"    ON t.TransactionID = c.TransactionID\n"
            ,"WHERE t.TransactionID = (\n"
            ,"    SELECT it.TransactionID\n"
            ,"    FROM transactions it\n"
            ,"        JOIN cart ic\n"
            ,"        ON it.TransactionID = ic.TransactionID\n"
            ,"    WHERE ic.CustomerID = " + customer_id + "\n"
            ,"    ORDER BY it.TransactionDate DESC\n"
            ,"    LIMIT 1);"
        ].join("")
        console.log(query)
        data = {'query': query}
        results = view_table(data)
        // TODO: display
        display(results);
    })
    $(menus[1]).on('click', function() {
        $('#input-month').attr('hidden', 'true')
        $('#input-year').attr('hidden', 'true')
        const today = new Date()
        const three_months_ago = new Date(
            today.getFullYear(),
            today.getMonth() - 3,
            today.getDate()).toISOString().slice(0, 10);

        // query the sql
        query = [""
            ,"SELECT *\n"
            ,"FROM transactions t\n"
            ,"    JOIN cart c\n"
            ,"    ON t.TransactionID = c.TransactionID\n"
            ,"WHERE t.TransactionID IN (\n"
            ,"    SELECT it.TransactionID\n"
            ,"    FROM transactions it\n"
            ,"        JOIN cart ic\n"
            ,"        ON it.TransactionID = ic.TransactionID\n"
            ,"    WHERE ic.CustomerID = " + customer_id + "\n"
            ,"        AND it.TransactionDate >= '" + three_months_ago + "'\n"
            ,"    ORDER BY it.TransactionDate DESC\n"
            ,"    );"
        ].join("")
        console.log(query)
        data = {'query': query}
        results = view_table(data)
        // TODO: display
        display(results);
    })
    $(menus[2]).on('click', function() {
        $('#input-month').removeAttr('hidden')
        $('#input-year').attr('hidden', 'true')
    })
    $('#input-month').on('change', function() {
        const today = new Date()
        const localGMT = today.toLocaleTimeString(undefined, { timeZoneName: 'short' })
        const specific_month = new Date($('#input-month').val() + " " + localGMT)
        const year = specific_month.getFullYear()
        const month = specific_month.getMonth() + 1

        // query the sql
        query = [""
            ,"SELECT *\n"
            ,"FROM transactions t\n"
            ,"    JOIN cart c\n"
            ,"    ON t.TransactionID = c.TransactionID\n"
            ,"WHERE t.TransactionID IN (\n"
            ,"    SELECT it.TransactionID\n"
            ,"    FROM transactions it\n"
            ,"        JOIN cart ic\n"
            ,"        ON it.TransactionID = ic.TransactionID\n"
            ,"    WHERE ic.CustomerID = " + customer_id + "\n"
            ,"        AND year(TransactionDate) = " + year + "\n"
            ,"        AND month(TransactionDate) = " + month + "\n"
            ,"    ORDER BY it.TransactionDate DESC\n"
            ,"    );"
        ].join("")
        console.log(query)
        data = {'query': query}
        results = view_table(data)
        // TODO: display
        display(results);
    })
    $(menus[3]).on('click', function() {
        $('#input-month').attr('hidden', 'true')
        $('#input-year').removeAttr('hidden')
    })
    $('#input-year').on('change', function() {
        const year = $('#input-year').val()
        if ($('#input-year').is(":invalid")) {
            alert('Year format is incorrect!')
            return
        }

        // query the sql
        query = [""
            ,"SELECT *\n"
            ,"FROM transactions t\n"
            ,"    JOIN cart c\n"
            ,"    ON t.TransactionID = c.TransactionID\n"
            ,"WHERE t.TransactionID IN (\n"
            ,"    SELECT it.TransactionID\n"
            ,"    FROM transactions it\n"
            ,"        JOIN cart ic\n"
            ,"        ON it.TransactionID = ic.TransactionID\n"
            ,"    WHERE ic.CustomerID = " + customer_id + "\n"
            ,"        AND year(TransactionDate) = " + year + "\n"
            ,"    ORDER BY it.TransactionDate DESC\n"
            ,"    );"
        ].join("")
        console.log(query)
        data = {'query': query}
        results = view_table(data)
        // TODO: display
        display(results);

    })

}

function display(results) {
    // Parse the JSON data
    var data = JSON.parse(results);

    // Process data to group by TransactionID
    var transactions = {};
    data.forEach(function(item) {
        if (!transactions[item.TransactionID]) {
            transactions[item.TransactionID] = {
                TransactionID: item.TransactionID,
                TransactionStatus: item.TransactionStatus,
                Items: []
            };
        }
        transactions[item.TransactionID].Items.push({ ItemNumber: item.ItemNumber, Quantity: item.Quantity });
    });

    // Get the transactions container
    var transactionsContainer = document.getElementById('transactionsContainer');

    // Iterate over transactions and create elements
    Object.values(transactions).forEach(function(transaction) {
        // Transaction details (not in a table)
        var transactionDetails = document.createElement('div');
        transactionDetails.innerHTML = '<strong>Transaction ID:</strong> ' + transaction.TransactionID +
            '<br><strong>Status:</strong> ' + transaction.TransactionStatus;
        transactionsContainer.appendChild(transactionDetails);

        // Create a table for transaction items
        var table = document.createElement('table');
        table.className = 'table table-bordered mt-3 mb-5';

        // Table head
        var theadHTML = '<thead><tr>' +
            '<th>Item Number</th>' +
            '<th>Quantity</th>' +
            '</tr></thead>';
        table.innerHTML = theadHTML;

        // Table body
        var tbody = document.createElement('tbody');
        transaction.Items.forEach(function(item) {
            var row = document.createElement('tr');
            row.innerHTML = '<td>' + item.ItemNumber + '</td><td>' + item.Quantity + '</td>';
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Append the table to the container
        transactionsContainer.appendChild(table);
    });

}