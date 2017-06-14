import React from 'react'
import {render} from 'react-dom'

import Main from './Main'

window.rawBody = document.body.innerHTML
window.jsonBody = JSON.parse(rawBody.replace(/<(?:.|\s)*?>/g, ''))

const div = document.createElement('div')
div.setAttribute('id', 'app')
document.body.appendChild(div)

render(<Main />, document.getElementById('app'))