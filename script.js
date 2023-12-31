// real datetime
function realTime() {
    const timeDisplay = document.getElementById("realtime");
    const dateString = new Date().toLocaleString();
    timeDisplay.textContent = dateString.replace(", ", " - ");
}
setInterval(realTime, 1000);

// validate inputs
function validateInput() {
    let alertext = ''

    let firstname = document.getElementById('firstname').value
    if (!/^[a-zA-Z]+$/.test(firstname)) {
        alertext += 'First name is not alphabetic only.\n'
    } else if (firstname.charAt(0) !== firstname.charAt(0).toUpperCase()) {
        alertext += 'First name is not capitalized.\n'
    }

    let lastname = document.getElementById('lastname').value
    if (!/^[a-zA-Z]+$/.test(lastname)) {
        alertext += 'Last name is not alphabetic only.\n'
    } else if (lastname.charAt(0) !== lastname.charAt(0).toUpperCase()) {
        alertext += 'Last name is not capitalized.\n'
    } else if (lastname === firstname) {
        alertext += 'The first name and the last name can not be the same.\n'
    }

    let phone = document.getElementById('phone').value
    if (!/\([0-9]{3}\) [0-9]{3}-[0-9]{4}/.test(phone)) {
        alertext +=  'Phone number must be formatted as (ddd) ddd-dddd.\n'
    }

    let email = document.getElementById('email').value
    if (!email.includes('@') || !email.includes('.')) {
        alertext += "Email address must contain '@' and '.'.\n"
    }

    let comment = document.getElementById('comment').value
    if (comment.length < 10) {
        alertext += 'The comment must be at least 10 characters'
    }

    if ('' !== alertext) {
        alert(alertext)
        return false
    }
}

function build_product_div(product) {
    const product_div = document.createElement('div')
    product_div.id = product['Subcategory']
    product_div.setAttribute('class', 'product')
    product_div.setAttribute('item-number', product['ItemNumber'])
    const inventory_number = product['Quantity']
    product_div.setAttribute('inventory', inventory_number)

    // add image
    const img = document.createElement('img')
    const img_src = product['Image']
    const product_name = product['Name']
    img.setAttribute('src', img_src)
    img.setAttribute('alt', product_name)
    product_div.append(img)

    // create description div
    const description_div = document.createElement('div')
    description_div.setAttribute('class', 'description')

    // add title
    const title_h4 = document.createElement('h4')
    title_h4.textContent = product_name
    description_div.append(title_h4)

    // add description
    const description_p = document.createElement('p')
    description_text = product['Description']
    description_p.textContent = description_text
    description_div.append(description_p)

    // add price
    const price_p = document.createElement('p')
    price_text = product['UnitPrice']
    price_p.textContent = 'Price: $' + price_text
    description_div.append(price_p)

    // add button directly
    description_div.innerHTML +=
        '<div class="add-btn-div">' +
        '    <button type="button" id="add-btn">+</button>' +
        '    <label for="add-btn">Add to Cart</label>' +
        '</div>'

    product_div.append(description_div)

    return product_div
}

function build_products_div(category, products_inventory) {
    // create fresh products descriptions
    const products_div = $('.content')
    products_div.empty()

    const allitems_tag = $('<div>').attr({'id': 'allitems'})
    products_div.append(allitems_tag)

    const title_h3 = $('<h3>').text(category)
    products_div.append(title_h3)

//    const description_p = $('<p>').text(products_category['description'])
//    products_div.append(description_p)

    // create product divs
    for (let i = 0; i < products_inventory.length; ++i) {
        const product_div = build_product_div(products_inventory[i])
        products_div.append(product_div)
    }
}

const page_category = $('#page-category')
function read_inventory(all=false) {
    let data = {}
    if (!all) {
        data = {'category': page_category.text()}
    } else {
        data = {'category': 'all'}
    }
    let inventory = null;
    $.ajax({
        async: false,
        global: false,
        url: 'read_inventory_sql.php',
        data: data,
        success: function (data) {
            inventory = JSON.parse(data)
        }
    })
    return inventory
}

function update_inventory(product) {
    $.ajax({
        async: false,
        global: false,
        url: 'update_inventory_sql.php',
        data: product,
        type: 'post',
        success: function (data) {
            console.log('write inventory sql success')
        }
    })
}

// restore inventory from file
const inventory = read_inventory()
build_products_div(page_category.text(), inventory)

// check user info
function check_user_info() {
    let user_info
    $.ajax({
        async: false,
        global: false,
        url: 'read_user_info_json.php',
        success: function (data) {
            if ('' === data) {
                user_info = {'CustomerID': '0', 'TransactionID': '0'}
            } else {
                user_info = JSON.parse(data)
            }
        }
    })
    return user_info
}

// create cart div
const cart_div = document.getElementById('cart-div')
cart_div.addEventListener('mouseleave', function() {
    cart_div.hidden = true
})

function update_cart_sql(product_json) {
    const user_info = check_user_info()
    $.ajax({
        async: false,
        global: false,
        url: 'write_cart_sql.php',
        type: 'post',
        data: {'user_info': user_info, 'product_info': product_json},
        success: function(data) {
            console.log('update cart success')
        },
    })
}

function calTotalPrice() {
    const cart = document.getElementById('cart-div')
    let total_price = 0.00
    for (let item of cart.children) {
        if ('Total Price:' === item.textContent.slice(0, 12)) continue
        if ('cart-buttons' === item.className) continue
        const item_price = parseFloat(item.children[1].textContent)
        const item_count = parseInt(item.children[2].children[1].value)
        total_price += item_price * item_count
    }
    total_price = Math.round(total_price * 100) / 100
    const total_price_div = document.getElementById('totalprice') 
    total_price_div.textContent = total_price_div.textContent.slice(0, 14) + total_price

    const user_info = check_user_info()
    $.ajax({
        async: false,
        global: false,
        url: 'update_total_price_sql.php',
        type: 'post',
        data: {
            'TransactionID': user_info['TransactionID'],
            'total_price': total_price
        },
        success: function(data) {
            console.log('update transaction success')
        },
    })
}

function create_cart_item(product_info) {
    // create a div for an item
    const item_image = document.createElement('img')
    item_image.setAttribute('src', product_info['image'])
    item_image.setAttribute('height', '85%');
    item_image.setAttribute('width', '85%');
    const item_price = document.createElement('div')
    item_price.className = 'cart-item-price'
    item_price.innerHTML = product_info['price']
    const item_text = document.createElement('div')
    item_text.className = 'cart-item-text'
    item_text.innerHTML = product_info['name']
    const input_area = document.createElement('input')
    input_area.setAttribute('type', 'number')
    input_area.className = 'cart-item-number'
    input_area.style.width = '40px'
    input_area.value = product_info['count']
    input_area.addEventListener('change', function() {
        // get name and amount from cart
        const amount = parseInt(this.value)
        const item_name = this.parentNode.firstElementChild.textContent

        // find item in cart
        const cart = read_cart(check_user_info())
        let cart_product
        for (let i = 0; i < cart.length; ++i) {
            if (item_name === cart[i]['Name']) {
                cart_product = cart[i]
                break
            }
        }
        const cart_inventory_count = parseInt(cart_product['Quantity'])

        const inventory = read_inventory()
        const inventory_product = get_inventory_product(inventory, item_name)
        let inventory_count = parseInt(inventory_product['Quantity'])
        // remove the item the amount is 0
        if (0 === amount) {
            // update cart xml
            const product_info = {
                'item_number': inventory_product['ItemNumber'],
                'count': 0,
            }
            update_cart_sql(product_info)
            calTotalPrice()

            // update cart UI
            this.parentNode.parentNode.remove()

            // update inventory
            inventory_product['Quantity'] = inventory_count + cart_inventory_count
            update_inventory(inventory_product)
            return
        }

        const diff = amount - cart_inventory_count
        // check inventory xml, whether there are enough products
        if (diff > inventory_count) {
            alert('Out of stock!')
            this.value = cart_inventory_count
            return
        }

        // update cart xml
        const product_info = {
            'item_number': inventory_product['ItemNumber'],
            'count': amount,
        }
        update_cart_sql(product_info)
        calTotalPrice()

        // update inventory xml
        inventory_product['Quantity'] = inventory_count - diff
        update_inventory(inventory_product)
    })

    const item_info = document.createElement('div')
    item_info.className = 'cart-info'
    item_info.appendChild(item_text)
    item_info.appendChild(input_area)

    let item = document.createElement('div')
    item.className = 'cart-item'
    item.id = product_info['name']
    item.appendChild(item_image)
    item.appendChild(item_price)
    item.appendChild(item_info)

    return item
}

// restore cart items
function restore_cart_from_json(data) {
    for (let i = 0; i < data.length; ++i) {
        const node = data[i]
        const product_info = {
            'item_number': node['ItemNumber'],
            'name': node['Name'],
            'count': node['Quantity'],
            'image': node['Image'],
            'price': node['UnitPrice']
        }
        const item = create_cart_item(product_info)
        cart_div.appendChild(item)
    }
    calTotalPrice()
}

function read_cart(user_info) {
    console.log(user_info)
    let cart_json = null
    $.ajax({
        async: false,
        global: false,
        type: 'get',
        url: 'read_cart_sql.php',
        data: user_info,
        success: function(data) {
            cart_json = JSON.parse(data)
        }
    })
    return cart_json
}

const user_info = check_user_info()
if ('0' !== user_info['CustomerID']) {
    restore_cart_from_json(read_cart(user_info))
}

function get_inventory_product(inventory, item_name) {
    let target_product = null
    $.each(inventory, function(category, node) {
        if (null !== target_product) return
        if (item_name === node['Name']) {
            target_product = node
        }
    })
    return target_product
}

// add listener for all buttons
const buttons = document.getElementsByClassName("add-btn-div")
for (let i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener('click', function() {
        const user_info = check_user_info()
        if ('0' === user_info['CustomerID']) {
            alert('Please login first!')
            return
        }

        const item_name = this.parentNode.firstElementChild.textContent
        const inventory = read_inventory()
        const inventory_product = get_inventory_product(inventory, item_name)
        let inventory_count = parseInt(inventory_product['Quantity'])

        // if there is no products, alert customers
        if (0 === inventory_count) {
            alert('Out of stock!')
            return
        }

        // if already in cart, add one to the total amount
        const cart = read_cart(user_info)
        console.log(cart)
        let cart_product = null
        for (let i = 0; i < cart.length; ++i) {
            if (item_name === cart[i]['Name']) {
                cart_product = cart[i]
                break
            }
        }
        let product_info = null
        if (null !== cart_product) {
            console.log(cart_product)
            const item_div = document.getElementById(item_name)

            // update cart
            item_div.children[2].children[1].value = parseInt(item_div.children[2].children[1].value) + 1

            // update cart xml
            product_info = {
                'item_number': cart_product['ItemNumber'],
                'count': parseInt(cart_product['Quantity']) + 1,
            }
        } else {
            // create a div for an item
            product_info = {
                'item_number': inventory_product['ItemNumber'],
                'name': item_name,
                'count': 1,
                'image': this.parentNode.parentNode.children[0].src,
                'price': this.parentNode.children[2].textContent.split('$')[1],
            }

            // update cart
            const item = create_cart_item(product_info)
            cart_div.appendChild(item)
        }

        // update cart xml
        update_cart_sql(product_info)
        calTotalPrice()

        // update inventory
        inventory_product['Quantity'] = inventory_count - 1
        update_inventory(inventory_product)
    })
}

const cart_button = document.getElementById('cart-btn')
cart_button.addEventListener('mouseenter', function() {
    if (cart_div.childElementCount > 2) {
        cart_div.hidden = false
    }
})

function clear_cart(checkout=false) {
    console.log(checkout)
    const children = cart_div.children
    // delete from the last item to the first item
    for (let i = children.length - 1; i >= 2; --i) {
        if (false === checkout) {
            const item_name = children[i].getAttribute('id')
            const amount = parseInt(children[i].children[2].children[1].value)

            // update inventory sql
            const inventory = read_inventory(all=true)
            console.log(inventory, item_name)
            const inventory_product = get_inventory_product(inventory, item_name)
            console.log(inventory_product)
            const inventory_count = parseInt(inventory_product['Quantity'])
            inventory_product['Quantity'] = inventory_count + amount
            update_inventory(inventory_product)

            // update cart xml
            const product_info = {
                'item_number': inventory_product['ItemNumber'],
                'count': 0,
            }
            update_cart_sql(product_info)
        }

        // update cart
        cart_div.removeChild(children[i])
    }
    if (false === checkout) {
        calTotalPrice()
    }
}

const clear_cart_button = $('#clear-cart')
clear_cart_button.on('click', clear_cart)

const checkout_button = $('#submit-cart')
checkout_button.on('click', function() {
    // change transaction status
    let user_info = check_user_info()
    $.ajax({
        async: false,
        global: false,
        url: 'update_transaction_status.php',
        method: 'post',
        data: {
            'TransactionID': user_info['TransactionID'],
            'status': 'SHOPPED'
        },
        success: function (data) {
            console.log(data)
        }
    })

    // clear cart
    clear_cart(checkout=true)

    // create transaction
    let transaction_id
    $.ajax({
        async: false,
        global: false,
        method: 'post',
        url: 'insert_transaction.php',
        success: function (data) {
            transaction_id = data
        }
    })

    // change current user status
    console.log(transaction_id)
    user_info['TransactionID'] = transaction_id
    // record customerID and transactionID in the local file
    $.ajax({
        async: false,
        global: false,
        method: 'post',
        url: 'write_user_info_json.php',
        data: {'user_info': user_info},
        success: function (data) {
            console.log(data)
        }
    })
})

// display items by selecting a tag
const tags = document.getElementsByClassName('sidenav')[0]
for (let tag of tags.children) {
    if ('A' !== tag.tagName) continue
    tag.addEventListener('click', function(event) {
        const tag_id = this.href.split('#')[1]

        if (undefined === tag_id) {
            alert('No items!')
            event.preventDefault()
            return false
        }

        // if select all items, show all
        if ('allitems' === tag_id) {
            const contents = document.getElementsByClassName('content')[0]
            const products = contents.getElementsByClassName('product')
            for (let product of products) {
                product.style.display = 'flex'
            }
            return
        }

        // hide all products
        const contents = document.getElementsByClassName('content')[0]
        const products = contents.getElementsByClassName('product')
        for (product of products) {
            product.style.display = 'none'
        }

        // show the current one
        const show_div = document.getElementById(tag_id)
        show_div.style.display = 'flex'
    })
}

// search bar
const search_bar = document.getElementById('searchbar')
if (search_bar != null) {
    search_bar.addEventListener('keydown', function(event) {
        if('Enter' === event.key) {
            const contents = document.getElementsByClassName('content')[0]
            const products = contents.getElementsByClassName('product')
            let target = null;
            for (product of products) {
                const product_name = product.children[1].children[0].textContent
                if (this.value.toLowerCase() === product_name.toLowerCase()) {
                    target = product
                    break
                }
            }
            if (null === target) {
                alert('No such item')
            } else {
                // hide all products
                const contents = document.getElementsByClassName('content')[0]
                const products = contents.getElementsByClassName('product')
                for (product of products) {
                    product.style.display = 'none'
                }
    
                // show the current one
                target.style.display = 'flex'
            }
        }
    })
}
