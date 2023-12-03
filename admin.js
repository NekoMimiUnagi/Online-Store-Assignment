function create_table(data, editable=false) {
    let table = $('<table><tbody>')
    table.addClass('table')
    data.forEach(function(d) {
        let row = $('<tr>')
        Object.keys(d).forEach(function(key) {
            let cell
            if ('Image' === key) {
                cell = $('<td>')
                cell.attr('style', 'width:180px')
                const image = $('<img>')
                image.attr({
                    'src': d[key],
                })
                cell.append(image)
            } else {
                cell = $('<td>').text(d[key])
                if ('UnitPrice' === key || 'Quantity' === key) {
                    cell.attr('contenteditable', editable)
                }
            }
            cell.attr('name', key)
            row.append(cell)
        })
        table.append(row)
    })
    return table
}

function display_table(data, editable=false) {
    table = create_table(data, editable)

    const display_table = $('#display-table')
    display_table.empty()
    display_table.append(table)

    display_table.parent().removeAttr('hidden')
}

function view_table(query) {
    let results
    $.ajax({
        async: false,
        global: false,
        method: 'post',
        url: 'view_table.php',
        data: query,
        success: function (data) {
            console.log(data)
            results = data
        }
    })
    return results
}

function update_table(query) {
    $.ajax({
        async: false,
        global: false,
        method: 'post',
        url: 'update_table.php',
        data: query,
        success: function (data) {
            console.log(data)
        }
    })
}

function admin_management() {
    const admin_div = $('#admin')
    admin_div.removeAttr('hidden')

    // logout button
    const logout_btn = $('#admin-logout')
    logout_btn.on('click', function() {
        // hidden admin
        admin_div.attr('hidden', true)
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

    // add inventory function
    const add_inventory = $('#admin-add-inventory')
    const add_inventory_btn = add_inventory.children()[7]
    $(add_inventory_btn).on('click', function() {
        const xml_file = $('#select-xml')[0]
        if (xml_file.files.length > 0) {
            const file_name = xml_file.files[0].name
            let inventory
            $.ajax({
                async: false,
                global: false,
                method: 'post',
                url: 'insert_products_xml.php',
                data: {'file_name': file_name},
                success: function (data) {
                    console.log(data)
                }
            })
        }
        const json_file = $('#select-json')[0]
        if (json_file.files.length > 0) {
            const file_name = json_file.files[0].name
            let inventory
            $.ajax({
                async: false,
                global: false,
                method: 'post',
                url: 'insert_products_json.php',
                data: {'file_name': file_name},
                success: function (data) {
                    console.log(data)
                }
            })
        }
    })

    // view inventory
    let display_btn = $('#admin-view-inventory').children()[1]
    $(display_btn).on('click', function() {
        query = [""
            ,"SELECT ItemNumber, Name, Category, UnitPrice, Quantity, Image\n"
            ,"FROM inventory;"
        ].join("")
        data = {'query': query}
        let results = view_table(data)
        display_table(JSON.parse(results))
    })

    // view low inventory products
    display_btn = $('#admin-view-low-inventory').children()[1]
    $(display_btn).on('click', function() {
        query = [""
            ,"SELECT ItemNumber, Name, Category, UnitPrice, Quantity, Image\n"
            ,"FROM inventory\n"
            ,"WHERE Quantity < 3;"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        display_table(JSON.parse(results))
    })

    // view value customers by date
    display_btn = $('#admin-view-value-customers').children()[3]
    $(display_btn).on('click', function() {
        query_date = $('#date').val()
        console.log(query_date)
        query = [""
            ,"SELECT *\n"
            ,"FROM customers c\n"
            ,"WHERE c.CustomerID in (\n"
            ,"    SELECT CustomerID\n"
            ,"    FROM\n"
            ,"        transactions t\n"
            ,"        JOIN cart ct\n"
            ,"        ON t.TransactionID = ct.TransactionID\n"
            ,"    WHERE t.TransactionDate = " + query_date + "\n"
            ,"    GROUP BY CustomerID\n"
            ,"    HAVING count(DISTINCT t.TransactionID) > 2\n"
            ,"    );"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        console.log(JSON.parse(results))
    })
    // TODO: display

    // view value customers by zip and month
    display_btn = $('#admin-view-value-customers').children()[5]
    $(display_btn).on('click', function() {
        zipcode = $('#zipcode').val()
        month = $('#month').val()
        query = [""
            ,"SELECT *\n"
            ,"FROM customers c\n"
            ,"WHERE c.CustomerID in (\n"
            ,"    SELECT CustomerID\n"
            ,"    FROM\n"
            ,"        transactions t\n"
            ,"        JOIN cart ct\n"
            ,"        ON t.TransactionID = ct.TransactionID\n"
            ,"    WHERE MONTH(t.TransactionDate) = " + month + "\n"
            ,"    GROUP BY CustomerID\n"
            ,"    HAVING count(DISTINCT t.TransactionID) > 2\n"
            ,"    )"
            ,"    AND c.Zipcode = " + zipcode + ";"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        display_table(JSON.parse(results))
    })

    // view low inventory products
    display_btn = $('#admin-update-product-info').children()[3]
    $(display_btn).on('click', function() {
        let item_number = $('#itemnumber').val()

        query = [""
            ,"SELECT ItemNumber, Name, Category, UnitPrice, Quantity, Image\n"
            ,"FROM inventory\n"
            ,"WHERE ItemNumber=" + item_number + ";"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        display_table(JSON.parse(results), editable=true)

        $('tr').on('blur', 'td[contenteditable]', function() {
            attr = $(this).attr('contenteditable')
            item_number = $(this).parent().children(':first-child').text()
            let update_name = $(this).attr('name')
            let update_value = $(this).text()
            query = [""
                ,"UPDATE inventory\n"
                ,"SET\n"
                ,"    " + update_name +" = " + update_value + "\n"
                ,"WHERE ItemNumber=" + item_number + ";"
            ].join("")
            data = {'query': query}
            update_table(data)
        })
    })

    // view more valuable customers agve over 20
    display_btn = $('#admin-view-more-value-customers-age-over-20').children()[1]
    $(display_btn).on('click', function() {
        query = [""
            ,"SELECT *\n"
            ,"FROM customers c\n"
            ,"WHERE c.CustomerID in (\n"
            ,"    SELECT CustomerID\n"
            ,"    FROM\n"
            ,"        transactions t\n"
            ,"        JOIN cart ct\n"
            ,"        ON t.TransactionID = ct.TransactionID\n"
            ,"    GROUP BY CustomerID\n"
            ,"    HAVING count(DISTINCT t.TransactionID) >= 2\n"
            ,"    )"
            ,"    AND c.Age > 20;"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        display_table(JSON.parse(results))
    })
}
