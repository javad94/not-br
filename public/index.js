const inputText = document.getElementById('input-text')
const inputFixation = document.getElementById('input-fixation')
const inputSaccade = document.getElementById('input-saccade')
const inputOpacity = document.getElementById('input-opacity')

const inputSize = document.getElementById('input-size')
const inputHeight = document.getElementById('input-height')
const inputSpacing = document.getElementById('input-spacing')

const inputWeight1 = document.getElementById('input-weight1')
const inputWeight2 = document.getElementById('input-weight2')

const mainOutput = document.getElementById('main-output')
const codeOutput = document.getElementById('code-output')
const cssOutput = document.getElementById('css-output')
const htmlOutput = document.getElementById('html-output')

const toggleDisplayText = document.getElementById('toggle-display-text')
const toggleDisplayHtml = document.getElementById('toggle-display-html')
const toggleTheme = document.getElementById('toggle-theme')
const rootEl = document.getElementById('root')

let parEl = document.createElement('DIV')
parEl.classList.add('notbr-text')

const styleHeader = ".notbr-text { white-space: pre-wrap; font-size: var(--fixation-size); letter-spacing: var(--fixation-spacing); } .notbr-text p { font-weight: var(--fixation-weight2); line-height: var(--fixation-height); } .notbr-fixation { font-weight: var(--fixation-weight1); opacity: var(--fixation-opac); }"

let textInput = ''
let textOutput = ''
let controls = {
    fixation: 5, //percentage to be bolded
    saccade: 5, //frequency of words to be bolded
    opacity: 5, //bolded opacity
    size: 8,
    height: 8,
    spacing: 0,
    weight1: 6,
    weight2: 3
}
let displayHTML = false
let displayState = 0 //0 main, 1 html, 2 md
let pageTheme = 'light'

inputText.addEventListener('input', update)
inputFixation.addEventListener('input', update)
inputSaccade.addEventListener('input', update)
inputOpacity.addEventListener('input', update)
inputSize.addEventListener('input', update)
inputHeight.addEventListener('input', update)
inputSpacing.addEventListener('input', update)
inputWeight1.addEventListener('input', update)
inputWeight2.addEventListener('input', update)


//"BINDS"

function bindText() {
    textInput = inputText.value
}

function bindControls() {
    controls.fixation = inputFixation.value
    controls.saccade = inputSaccade.value
    controls.opacity = inputOpacity.value
    controls.size = inputSize.value
    controls.height = inputHeight.value
    controls.spacing = inputSpacing.value
    controls.weight1 = inputWeight1.value
    controls.weight2 = inputWeight2.value
}

function updateCSS() {
    parEl.style.setProperty('--fixation-opac', `${controls.opacity / parseInt(inputOpacity.max)}`)
    parEl.style.setProperty('--fixation-size', `${controls.size}px`)
    parEl.style.setProperty('--fixation-height', `${controls.height}px`)
    parEl.style.setProperty('--fixation-spacing', `${controls.spacing}px`)
    parEl.style.setProperty('--fixation-weight1', `${(parseInt(controls.weight1) + 1) * 100}`)
    parEl.style.setProperty('--fixation-weight2', `${(parseInt(controls.weight2) + 1) * 100}`)
}

function processText() {
    let paras = textInput.split(/[\n]/gmiu)
    paras.forEach((para, j) => {
        let inputArray = para.split(/[ ]/gmiu)
        const saccadeFreq = (parseInt(inputSaccade.max) + 1) - controls.saccade
        const fixationPerc = controls.fixation / parseInt(inputFixation.max)
        inputArray.forEach((el, i) => {
            if (i % saccadeFreq !== 0) {
                return
            }
            const fixPoint = Math.ceil(fixationPerc * el.length)
            const newStr = `<span class="notbr-fixation">${el.slice(0, fixPoint)}</span>${el.slice(fixPoint)}`
            inputArray[i] = newStr
        })
        const initReduce = '<p>'
        const sumReduce = inputArray.reduce(
            (prev, curr) => prev + curr + ' ',
            initReduce
        )
        paras[j] = `${sumReduce}</p>`
    })
    const initReduce = ''
    const sumReduce = paras.reduce(
        (prev, curr) => prev + curr + '\n',
        initReduce
    )
    textOutput = sumReduce
}

function bindOutput() {
    parEl.innerHTML = textOutput
    htmlOutput.textContent = mainOutput.innerHTML
}

function switchDisplay(displayType) {
    displayState = displayType

    //main
    if (displayState == 0) {
        mainOutput.style.display = 'block'
        codeOutput.style.display = 'none'
        toggleDisplayText.style.display = 'none'
        toggleDisplayHtml.style.display = 'block'
    }
    //html
    if (displayState == 1) {
        mainOutput.style.display = 'none'
        codeOutput.style.display = 'flex'
        toggleDisplayText.style.display = 'block'
        toggleDisplayHtml.style.display = 'none'
    } 
}

function switchTheme(themeType) {
    if (themeType) {
        pageTheme = themeType
    } else {
        if (pageTheme == 'light') {
            pageTheme = 'dark'
        } else {
            pageTheme = 'light'
        }
    }
    if (pageTheme == 'light') {
        rootEl.classList.add('theme-light')
        rootEl.classList.remove('theme-dark')
        toggleTheme.textContent = 'Dark Mode'
    } else {
        rootEl.classList.add('theme-dark')
        rootEl.classList.remove('theme-light')
        toggleTheme.textContent = 'Light Mode'
    }
}

function copyAsMd(){
	let paras = textInput.split(/[\n]/gmiu)
	let output = ''
    paras.forEach((para, j) => {
        let inputArray = para.split(/[ ]/gmiu)
        const saccadeFreq = (parseInt(inputSaccade.max) + 1) - controls.saccade
        const fixationPerc = controls.fixation / parseInt(inputFixation.max)
        inputArray.forEach((el, i) => {
            if (i % saccadeFreq !== 0) {
                return
            }
			if (el.trim().length === 0) {
				return;
			}
            const fixPoint = Math.ceil(fixationPerc * el.length)
            output += `**${el.slice(0, fixPoint)}**${el.slice(fixPoint)} `
        })
		output += '\n'
    })
	navigator.clipboard.writeText(output);
}

//LIFECYCLE

function init() {
    mainOutput.appendChild(parEl)
    cssOutput.textContent = styleHeader
    inputText.value = ''
    inputFixation.value = Math.floor(parseInt(inputFixation.max) / 2)
    inputSaccade.value = parseInt(inputSaccade.max)
    inputOpacity.value = parseInt(inputOpacity.max)
    inputSize.value = 16
    inputHeight.value = 24
    inputSpacing.value = 0
    inputWeight1.value = 6
    inputWeight2.value = 3
    bindControls()
    updateCSS()
    bindOutput()
}
init()

function update() {
    bindText()
    bindControls()
    updateCSS()
    processText()
    bindOutput()
}