const abi = [{
    'constant': true,
    'inputs': [],
    'name': 'owner_fee',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'type': 'function'
}, {
    'constant': false,
    'inputs': [],
    'name': 'destruct',
    'outputs': [],
    'payable': false,
    'type': 'function'
}, {
    'constant': true,
    'inputs': [],
    'name': 'total',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'type': 'function'
}, {
    'constant': false,
    'inputs': [],
    'name': 'withdraw',
    'outputs': [],
    'payable': false,
    'type': 'function'
}, {
    'constant': false,
    'inputs': [{'name': '_char', 'type': 'bytes1'}],
    'name': 'lottery',
    'outputs': [],
    'payable': false,
    'type': 'function'
}, {
    'constant': true,
    'inputs': [],
    'name': 'result',
    'outputs': [{'name': '', 'type': 'bytes1'}],
    'payable': false,
    'type': 'function'
}, {
    'constant': true,
    'inputs': [],
    'name': 'jackpot',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'type': 'function'
}, {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'type': 'function'
}, {
    'constant': false,
    'inputs': [{'name': '_char', 'type': 'bytes1'}],
    'name': 'play',
    'outputs': [],
    'payable': true,
    'type': 'function'
}, {
    'constant': true,
    'inputs': [],
    'name': 'fee',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'type': 'function'
}, {
    'constant': true,
    'inputs': [],
    'name': 'open',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'type': 'function'
}, {
    'inputs': [{'name': '_fee', 'type': 'uint256'}, {'name': '_jackpot', 'type': 'uint256'}, {
        'name': '_owner_fee',
        'type': 'uint256'
    }], 'payable': false, 'type': 'constructor'
}, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'total', 'type': 'uint256'}],
    'name': 'Total',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'result', 'type': 'bytes1'}],
    'name': 'Result',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'open', 'type': 'bool'}],
    'name': 'Open',
    'type': 'event'
}];

export default abi;
