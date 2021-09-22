import React, { useState, useEffect } from 'react'

const App = () => {
    const [output, setOutput] = useState('')

    useEffect(() => {
        fetch('/test')
            .then((res) => res.text())
            .then((data) => setOutput(data))
            .catch((err) => console.log(err.message))
    }, [])

    return <div className='App'>{output}</div>
}

export default App
