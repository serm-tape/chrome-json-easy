import React from 'react'
import {render} from 'react-dom'

import Main from './Main'

const div = document.createElement('div')
div.setAttribute('id', 'app')
div.setAttribute('style', 'position:absolute; top:0; left:0; width:100%;')
document.body.appendChild(div)

render(<Main />, document.getElementById('app'))