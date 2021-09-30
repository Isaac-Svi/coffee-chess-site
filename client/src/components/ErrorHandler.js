import React, { Component } from 'react'

export default class ErrorHandler extends Component {
    state = {
        error: '',
        errorInfo: {},
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error.toString(),
            errorInfo,
        })
    }
    render() {
        if (this.state.error) {
            return (
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary>{this.state.error}</summary>
                    {this.state.errorInfo.componentStack}
                </details>
            )
        }
        return this.props.children
    }
}
