// real datetime
function realTime() {
    const timeDisplay = document.getElementById("realtime");
    const dateString = new Date().toLocaleString();
    timeDisplay.textContent = dateString.replace(", ", " - ");
}
setInterval(realTime, 1000);

function user_login() {
    let username = document.getElementById('username').value
    let password = document.getElementById('current-password').value

    // call php to check user status
    const user_info = {
        'username': username,
        'password': password
    }
    let flag = false
    let customer_id
    $.ajax({
        async: false,
        global: false,
        url: 'login.php',
        method: 'get',
        data: user_info,
        success: function(data) {
            console.log(data)
            if ('exists' === data.substring(0, 6)) {
                flag = true
                customer_id = data.substring(6)
                alert('Login success!')
            } else {
                alert('Please register an account!')
            }
        }
    })
    if (flag) {
        const content = $('#content')
        content.attr('hidden', true)
        if ('admin' === username) {
            admin_management()
        } else {
            users_management(customer_id)
        }
    }
    return false
}

function user_register() {
    window.location.href = "/registration.html";
    return true
}

// hide table button
const hide_button = $('#hide-table')
hide_button.on('click', function() {
    $(this).parent().attr('hidden', 'true')
    $($(this).parent().children()[1]).empty()
})
