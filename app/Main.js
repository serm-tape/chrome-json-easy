import React, {Component} from 'react'
import JsonHtmlNode from './JsonHtmlNode'

class Main extends Component{
    constructor(){
        super()
        this.state = {
            src: {},
            suggestKey: []
        }
        this.originalSrc = {}
    }

    componentDidMount(){
        const pre = document.getElementsByTagName('pre')
        const src = JSON.parse(pre[0].innerText.trim('"'))
        this.originalSrc = src
        console.log(this.originalSrc)
        this.setState({src:src})
        document.body.removeChild(pre[0])
    }

    render(){
        return (
            <div style={{margin:0, padding:0, backgroundColor: '#222'}}>
                <input type='text' onChange={query.bind(this)} />
                {this.state.suggestKey.map( k => (
                    <span key={k.join('')}>
                        <span style={{color:'#E91E63'}}>{k[0]}</span>
                        <span style={{color:'#888'}}>{k[1]}</span>
                        &nbsp;
                    </span>
                ))}
                <JsonHtmlNode nkey='result' value={this.state.src} />
            </div>
        )
    }
}

function query(e){
    let src = Object.assign({}, this.originalSrc)
    const result = checkIsOnFilter(src, e.target.value)
    const suggest = getSuggestKeys(src, e.target.value)
    this.setState({src: result, suggestKey: suggest})
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
