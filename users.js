function users_management(customer_id) {
    const users_div = $('#users')
    users_div.removeAttr('hidden')

    // logout button
    const logout_btn = $('#users-logout')
    logout_btn.on('click', function() {
        // hidden users
        users_div.attr('hidden', true)
        // show login UI
        const content = $('#content')
        content.removeAttr('hidden')
        // hidden display
        const display_div = $('#display-div')
        display_div.attr('hidden', 'true')
        // clean current user info
        $.ajax({
            async: false,
            global: false,
            method: 'post',
            url: 'clear_user_info_json.php',
            success: function (data) {
                console.log(data)
            }
        })
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
        data = {'query': query}
        results = view_table(data)
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
        data = {'query': query}
        results = view_table(data)
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
        data = {'query': query}
        results = view_table(data)
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
        data = {'query': query}
        results = view_table(data)
        display(results);
    })

}

function display(results) {
    // Get the transactions container
    var transactionsContainer = document.getElementById('transactionsContainer');
    transactionsContainer.innerHTML = '';

    console.log("start displaying")
    // Parse the JSON data
    var data = JSON.parse(results);
    // Check if the array is empty
    if (data.length === 0) {
        console.log("Array is empty. Exiting the function.");
        return; // Exit the function
    }

    // Continue with the rest of the function if the array is not empty
    console.log("Processing array...");

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

    // Iterate over transactions and create elements
    Object.values(transactions).forEach(function(transaction) {
        // Transaction details (not in a table)
        console.log("start transaction")
        var transactionDetails = document.createElement('div');
        transactionDetails.innerHTML = '<strong>Transaction ID:</strong> ' + transaction.TransactionID +
            '<br><strong>Status:</strong> ' + transaction.TransactionStatus;
        transactionsContainer.appendChild(transactionDetails);


        let myItem = [];
        transaction.Items.forEach(function(item) {
            // query the sql
            query = [""
                ,"SELECT ItemNumber, Name, Category, UnitPrice, Quantity, Image\n"
                ,"FROM inventory\n"
                ,"WHERE ItemNumber=" + item.ItemNumber + ";"
            ].join("")
            data = {'query': query}
            item_info = view_table(data)

            const item_arr = JSON.parse(item_info);
            cur_item = item_arr[0]
            cur_item.Quantity = item.Quantity // use cart quantity
            myItem.push(cur_item)


        });
        // table.appendChild(tbody);
        let table = create_table(myItem);
        // Append the table to the container
        $(transactionsContainer).append(table);
    });

}
