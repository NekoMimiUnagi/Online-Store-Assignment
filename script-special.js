// real datetime
function realTime() {
    const timeDisplay = document.getElementById("realtime");
    const dateString = new Date().toLocaleString();
    const formattedString = dateString.replace(", ", " - ");
    timeDisplay.textContent = formattedString;
}
setInterval(realTime, 1000);

const questions = [
    'Are you a teacher / military person?',
    'Are you a low income person?',
    'Do you have any disability?'
]

const reasons = [
    'you are a teacher / military person',
    'you are a low income person',
    'you have disability'
]

const results = []

// special offer
function createQuestionDiv(i, question) {
    // question text
    const question_text = document.createElement('div')
    question_text.innerHTML = questions[i]

    // option yes
    const option_yes = document.createElement('div')
    const yes_html = '<input type="radio" name="yes-no-' + i + '">'
    option_yes.innerHTML = yes_html
    const yes_label = document.createElement('div')
    yes_label.innerHTML = 'yes'
    option_yes.appendChild(yes_label)
    option_yes.className = 'question-option'
    option_yes.children[0].addEventListener('click', function(event) {
        const index = parseInt(this.parentNode.parentNode.parentNode.getAttribute('index'))
        results[index] = 'yes'
        createQuestion(index+1)
    })

    // option no
    const option_no = document.createElement('div')
    const no_html = '<input type="radio" name="yes-no-' + i + '">'
    option_no.innerHTML = no_html
    const no_label = document.createElement('div')
    no_label.innerHTML = 'no'
    option_no.className = 'question-option'
    option_no.appendChild(no_label)
    option_no.children[0].addEventListener('click', function(event) {
        const index = parseInt(this.parentNode.parentNode.parentNode.getAttribute('index'))
        results[index] = 'no'
        createQuestion(index+1)
    })

    // combine yes and no
    const question_options = document.createElement('div')
    question_options.className = 'question-options'
    question_options.appendChild(option_yes)
    question_options.appendChild(option_no)

    // combine text and option
    const question_div = document.createElement('div')
    question_div.append(question_text)
    question_div.append(question_options)
    question_div.setAttribute('index', i)

    return question_div
}

function createQuestion(index) {
    // find and clear special offer div
    const special_div = document.getElementById('specialoffer')
    special_div.innerHTML = ''

    // normal case, shift to next question
    if (index < questions.length) {
        special_div.appendChild(createQuestionDiv(index, questions[index]))
        return
    }

    // show results by iterating results
    let earn = 0;
    let idx = 0;
    special_div.innerHTML = 'Because:<br/>'
    for (let i = 0; i < results.length; ++i) {
        if ('yes' === results[i]) {
            ++idx
            special_div.innerHTML += idx + ': ' + reasons[i] + '<br/>'
            earn += 5
        }
    }
    special_div.innerHTML += 'You qualify for ' + earn + '% off your purchase!'
}

// display items by selecting a tag
const tags = document.getElementsByClassName('sidenav')[0]
for (tag of tags.children) {
    if ('A' != tag.tagName) continue
    tag.addEventListener('click', function(event) {
        const tag_id = this.href.split('#')[1]

        // special offer
        if ('specialoffer' === tag_id) {
            const contents = document.getElementsByClassName('content')[0]
            const products = contents.getElementsByClassName('product')
            for (product of products) {
                product.style.display = 'none'
            }
            results.splice(0, results.length)
            createQuestion(0)
            return
        }

        // if select all items, show all
        if ('allitems' === tag_id) {
            const contents = document.getElementsByClassName('content')[0]
            const products = contents.getElementsByClassName('product')
            for (product of products) {
                product.style.display = 'flex'
            }
            const special_div = document.getElementById('specialoffer')
            special_div.innerHTML = ''
            return
        }

        // hide all products
        const contents = document.getElementsByClassName('content')[0]
        const products = contents.getElementsByClassName('product')
        for (product of products) {
            product.style.display = 'none'
        }
        const special_div = document.getElementById('specialoffer')
        special_div.innerHTML = ''

        // show the current one
        const show_div = document.getElementById(tag_id)
        show_div.style.display = 'flex'
    })
}

