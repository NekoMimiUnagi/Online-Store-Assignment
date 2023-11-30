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
            ,"SELECT *\n"
            ,"FROM inventory;"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        console.log(JSON.parse(results))
    })
    // TODO: display

    // view low inventory products
    display_btn = $('#admin-view-low-inventory').children()[1]
    $(display_btn).on('click', function() {
        query = [""
            ,"SELECT *\n"
            ,"FROM inventory\n"
            ,"WHERE Quantity < 3;"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        console.log(JSON.parse(results))
    })
    // TODO: display

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
        console.log(JSON.parse(results))
    })
    // TODO: display

    // view low inventory products
    display_btn = $('#admin-update-product-info').children()[3]
    $(display_btn).on('click', function() {
        query = [""
            ,"SELECT *\n"
            ,"FROM inventory;"
        ].join("")
        data = {'query': query}
        results = view_table(data)
        console.log(JSON.parse(results))
    })
    // TODO: display
    update_btn = $('#admin-update-product-info').children()[9]
    $(update_btn).on('click', function() {
        // TODO: get corresponding line and info based on UI
        unit_price = '0.99'
        quantity = '3'
        item_number = '0'
        query = [""
            ,"UPDATE inventory\n"
            ,"SET\n"
            ,"    UnitPrice = '" + unit_price + "',\n"
            ,"    Quantity = '" + quantity + "'\n"
            ,"WHERE ItemNumber=" + item_number + ";"
        ].join("")
        data = {'query': query}
        update_table(data)
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
        console.log(JSON.parse(results))
    })
    // TODO: display
}
