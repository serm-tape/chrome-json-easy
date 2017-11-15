import React, {Component} from 'react'
import JsonHtmlNode from './JsonHtmlNode'
import jsonata from 'jsonata'

class Main extends Component{
    constructor(){
        super()
        this.state = {
            src: {},
            suggestKey: [],
            detected: false,
            overwrote: false,
        }
        this.originalSrc = {}
    }

    componentDidMount(){
        let rawText
        const headerJson = document.getElementsByTagName('pre')[0]
        if(headerJson) rawText = headerJson.innerText.trim('"')
        else rawText = document.body.childNodes[0].nodeValue.trim('"') //json returned as text/html
        
        let src, isJson
        try{
            src = JSON.parse(rawText)
            isJson = true
        }catch(e){
            src = {}
            isJson = false
            console.log('parse failed') //TODO: show error on screen
        }
        this.originalSrc = src
        this.setState({src:src, detected:isJson, overwrote:true})

        if(headerJson) document.body.removeChild(headerJson)
        else {
            console.log(document.body.innerHTML)
            document.body.childNodes[0].nodeValue = ''
        }

    }

    render(){
        if(!this.state.detected) return null
        return (
            <div style={{margin:0, padding:0, backgroundColor: '#222'}}>
                <input type='text' onChange={query.bind(this)} style={{width:'95%', backgroundColor:'#323232', color:'white', border:0, margin:3, padding:2}}/>
                {this.state.suggestKey.map( k => (
                    <span key={k.join('')}>
                        <span style={{color:'#E91E63'}}>{k[0]}</span>
                        <span style={{color:'#888'}}>{k[1]}</span>
                        &nbsp;
                    </span>
                ))}
                <JsonHtmlNode nkey='Result' value={this.state.src} />
            </div>
        )
    }
}

function query(e){
    let src = Object.assign({}, this.originalSrc)
    const expression = new jsonata(e.target.value)
    const result = expression.evaluate(src)
    //const suggest = getSuggestKeys(src, e.target.value)
    this.setState({src: result, suggestKey: []})
}

function checkIsOnFilter(obj, filterExp){
    console.log('params:')
    console.log(obj)
    console.log(filterExp)
    const splited = filterExp.split('.').map(k => k.trim())
    const interestKey = splited[0]
    const matchKeys = Object.keys(obj).filter( k => k==interestKey || interestKey=='' || interestKey=='*')
    const matchChild = {}
    matchKeys.map( key => matchChild[key] = obj[key] )
    if (splited.length > 1){
        splited.shift()
        matchKeys.map( key => {
            matchChild[key] = checkIsOnFilter(matchChild[key], splited.join('.'))
        })
    }
    console.log('matched:')
    console.log(matchChild)
    return matchChild
}

function getObjectAt(obj, path){
    const keys = path.split('.')
    if( keys == '')
        return obj
    else
        return keys.reduce( (obj, key) => {
            if(key === '*'){
                return obj[0]
            }else{
                return obj[key]
            }
        }, obj )
}

function getSuggestKeys(obj, filterExp){
    const splited = filterExp.split('.').map( k => k.trim())
    const name = splited.pop()
    const keys = Object.keys(getObjectAt(obj, splited.join('.')))
    const matched = keys.filter( k => k.indexOf(name)==0)
    return matched.map( m => {
        const splited = m.split(name).filter( token => token!='' )
        return [name, splited.join('')]
    })
}

export default Main
