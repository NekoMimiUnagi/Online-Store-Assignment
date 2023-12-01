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
    })
}
