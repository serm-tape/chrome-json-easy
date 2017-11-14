import React, {Component} from 'react'

const TypeStyle = {
    string: {color:'#ccff99'},
    number: {color:'#99ccff'},
    boolean: {color:'#ff99cc'},
    'null': {color:'#ddd'}
}

class JsonHtmlNode extends Component{
    constructor(){
        super()
        this.state = {
            isDisplayed: true
        }
    }

    render(){
        const props = this.props
        let value
        const type = typeof props.value
        if(props.nkey == 'Value' && props.value && props.value.split(';').length > 1){
            let kv = props.value.split(';')
            value = kv.sort().map( pair => {
                const splited = pair.split(/:(.+)/)
                return (<JsonHtmlNode key={`val-${splited[0]}`} nkey={splited[0].toUpperCase()} value={splited[1]} />)
            })
        }else if (props.value == null){
            value = (<span style={TypeStyle['null']}><i> null </i></span>)
        }else if (type == 'string'){
            value = (<span style={TypeStyle['string']}> "{props.value}" </span>)
        }else if (type != 'object'){
            value = (<span style={TypeStyle[type]}> {props.value} </span>)
        }else if(type == 'object'){
            value = Object.keys(props.value).map( k => (<JsonHtmlNode key={k} nkey={k} value={props.value[k]} />))
        }
        
        return (
            <div style={{marginLeft:'30px'}}>
                <span style={{color:'orange'}}> {props.nkey} : </span>
                {
                    (type=='object' && props.value)?
                        <button
                            onClick={toggleVisible.bind(this)}
                            style={{background:'#666', border:0, color:'white', borderRadius:'10%', padding: 2}}
                        >
                            {this.state.isDisplayed?'–':'+'}
                        </button>
                    :
                        null
                }
                <span hidden={!this.state.isDisplayed}>{value}</span>
            </div>
        )
    }
}

function toggleVisible(){
    this.setState({isDisplayed: !this.state.isDisplayed})
}

export default JsonHtmlNode
