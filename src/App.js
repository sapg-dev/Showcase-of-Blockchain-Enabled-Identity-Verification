import React, { useState } from 'react';
import { Blockchain } from './Blockchain';
import './App.css';

const App = () => {
    const [blockchain, setBlockchain] = useState(new Blockchain());
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [chainValid, setChainValid] = useState(true);
    const [tamperedBlock, setTamperedBlock] = useState(null);

    const handleAddBlock = async () => {
        await blockchain.addBlock({ name, idNumber });
        setName('');
        setIdNumber('');
        validateChain();
    };

    const tamperWithBlock = (index) => {
        if (blockchain.chain[index]) {
            setTamperedBlock(JSON.parse(JSON.stringify(blockchain.chain[index])));
            blockchain.chain[index].data.name = "TAMPERED NAME";
            validateChain();
        }
    };

    const resetTampering = () => {
        setBlockchain(new Blockchain());  // Reset the entire blockchain
        setTamperedBlock(null);
        setChainValid(true);  // Since it's a new blockchain, it's valid by default
    };

    const validateChain = async () => {
        const isValid = await blockchain.isChainValid();
        setChainValid(isValid);
    };

    return (
        <div className="App">
            <h1>Blockchain Identification Cards</h1>

            <div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                <input value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="ID Number" />
                <button onClick={handleAddBlock}>Add Block</button>
            </div>

            <h2>Blockchain</h2>
            <div>
                {blockchain.chain.map((block, index) => (
                    <div key={index} className="block">
                        <pre>{JSON.stringify(block, null, 2)}</pre>
                        <button onClick={() => tamperWithBlock(index)}>Tamper with this Block</button>
                    </div>
                ))}
            </div>

            {tamperedBlock && (
                <div>
                    <h2>Comparison</h2>
                    <div className="comparison">
                        <div className="block">
                            <h3>Original Block</h3>
                            <pre>{JSON.stringify(tamperedBlock, null, 2)}</pre>
                        </div>
                        <div className="block">
                            <h3>Tampered Block</h3>
                            <pre>{JSON.stringify(blockchain.chain[tamperedBlock.index], null, 2)}</pre>
                            <button onClick={resetTampering}>Reset Tampering</button>
                        </div>
                    </div>
                </div>
            )}

            <p>Is chain valid? {chainValid ? "Yes" : "No"}</p>
        </div>
    );
};

export default App;
