import React, { Component } from 'react';
import './App.less'
export default class App extends Component<{},{
    showLoginBtn: boolean;
}> {
    constructor(props:any) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="App">
            </div>
        )
    }
}