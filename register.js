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

    let username = document.getElementById('username').value
    let username_exists = false
    $.ajax({
        async: false,
        global: false,
        url: 'check_username.php',
        method: 'get',
        data: {'username': username,},
        success: function(data) {
            if ('exists' === data) {
                username_exists = true
            }
        }
    })
    if (username_exists) {
        alertext += 'User Name exists!\n'
    }

    let password = document.getElementById('current-password').value
    let confirm_password = document.getElementById('confirm-password').value
    if (password !== confirm_password) {
        alertext += "Two passwords are not the same!\n"
    }
    if (password.length < 8) {
        alertext += "The password must be at least 8 characters.\n"
    }

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

    let dob = document.getElementById('dob').value
    const today = new Date()
    const birthday = new Date(dob)
    const age = today.getFullYear() - birthday.getFullYear()
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    let phone = document.getElementById('phone').value

    let email = document.getElementById('email').value
    if (!email.includes('@') || !email.includes('.com')) {
        alertext += "Email address must contain '@' and '.com'.\n"
    }

    let address = document.getElementById('address').value

    let zipcode = document.getElementById('zipcode').value

    if ('' !== alertext) {
        alert(alertext)
        return false
    }

    // call php to register user info
    const user_info = {
        'username': username,
        'password': password,
        'firstname': firstname,
        'lastname': lastname,
        'age': age,
        'phone': phone,
        'email': email,
        'address': address,
        'zipcode': zipcode
    }
    let flag = false
    $.ajax({
        async: false,
        global: false,
        url: 'register_customer.php',
        method: 'post',
        data: user_info,
        success: function(data) {
            if ('success' === data) {
                alert('Success!')
                flag = true
            } else {
                alert('Something wrong happened!')
            }
        }
    })
    if (flag) {
        window.location.href = "/my-account.html";
        return true
    }
    return false
}


