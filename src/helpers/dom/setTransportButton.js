export default function setTransportButton(housingCard) {
    const buttonDiv = document.createElement('div')
    const buttonElement = document.createElement('button')

    buttonElement.textContent = 'Kalkuler kollektivavstand'
    buttonElement.title = 'Kalkuler kollektivavstand'

    buttonElement.classList.add('button', 'button--transport')
    buttonDiv.classList.add('u-position-relative', 'ads__unit__content__status')

    buttonDiv.dataset.callOutBoxPosition = true

    setStyles(buttonDiv, {
        zIndex: '2'
    })

    setStyles(buttonElement, {
        fontSize: '14px',
        margin: '8px 0',
    })

    buttonElement.addEventListener('click', () => {
        console.log('hello')
    })

    buttonDiv.append(buttonElement)
    housingCard.append(buttonDiv)
}

function setStyles(element, styles) {
    for (const key of Object.keys(styles)) {
        const styleValue = styles[key]
        element.style[key] = styleValue
    }
}