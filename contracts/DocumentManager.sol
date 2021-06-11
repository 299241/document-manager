// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract DocumentManager {
    struct Document {
        uint256 blockNumber;
        address author;
        mapping(address => uint8) signed;
        address[] signatures;
        bool importantOrder;
    }

    mapping(bytes32 => Document) documents;

    function create(
        bytes32 _hash,
        address[] memory _signatures,
        bool _importantOrder
    ) external {
        require(documents[_hash].blockNumber == 0, "already tracked");
        Document storage d = documents[_hash];
        d.blockNumber = block.number;
        d.author = msg.sender;
        d.signatures = _signatures;
        for (uint256 i = 0; i < _signatures.length; i++) {
            addSignerInternal(_hash, _signatures[i]);
        }
        d.importantOrder = _importantOrder;
    }

    function addSignerInternal(bytes32 _hash, address _signer)
        internal
        onlyTracked(_hash)
    {
        documents[_hash].signed[_signer] = 1;
    }

    function addSigner(bytes32 _hash, address _signer)
        external
        onlyTracked(_hash)
        onlyAuthor(_hash, msg.sender)
        onlyNotExisted(_hash, _signer)
    {
        documents[_hash].signatures.push(_signer);
        documents[_hash].signed[_signer] = 1;
    }

    function removeSigner(bytes32 _hash, address _signer)
        external
        onlyTracked(_hash)
        onlyAuthor(_hash, msg.sender)
        onlyNotRemoved(_hash, _signer)
        onlyToSigned(_hash, _signer)
    {
        documents[_hash].signed[_signer] = 3;
    }

    function sign(bytes32 _hash)
        external
        onlyTracked(_hash)
        onlySignatures(_hash, msg.sender)
        onlyToSigned(_hash, msg.sender)
    {
        if (documents[_hash].importantOrder) {
            address actualSigner = getActualSigner(_hash);
            if (actualSigner != address(0)) {
                require(actualSigner == msg.sender, "no sequence");
            }
        }
        documents[_hash].signed[msg.sender] = 2;
    }

    function get(bytes32 _hash)
        external
        view
        onlyTracked(_hash)
        returns (uint256, address[] memory)
    {
        Document storage d = documents[_hash];
        return (d.blockNumber, d.signatures);
    }

    function isSigned(bytes32 _hash, address _signer)
        external
        view
        onlyTracked(_hash)
        onlySignatures(_hash, _signer)
        returns (uint256)
    {
        return documents[_hash].signed[_signer];
    }

    function getActualSigner(bytes32 _hash) internal view returns (address) {
        for (uint256 i = 0; i < documents[_hash].signatures.length; i++) {
            if (documents[_hash].signed[documents[_hash].signatures[i]] == 1) {
                return documents[_hash].signatures[i];
            }
        }
        return address(0);
    }

    modifier onlyTracked(bytes32 _hash) {
        require(documents[_hash].blockNumber != 0, "only tracked");
        _;
    }

    modifier onlySignatures(bytes32 _hash, address _signer) {
        require(documents[_hash].signed[_signer] != 0, "only signatures");
        _;
    }

    modifier onlyAuthor(bytes32 _hash, address _signer) {
        require(documents[_hash].author == _signer, "only author");
        _;
    }

    modifier onlyNotExisted(bytes32 _hash, address _signer) {
        uint256 signed = documents[_hash].signed[_signer];
        require(signed != 1 || signed != 2, "it already exists");
        _;
    }

    modifier onlyToSigned(bytes32 _hash, address _signer) {
        require(documents[_hash].signed[_signer] == 1, "not allowed to sign");
        _;
    }

    modifier onlyNotSigned(bytes32 _hash, address _signer) {
        require(documents[_hash].signed[_signer] != 2, "already signed");
        _;
    }

    modifier onlyNotRemoved(bytes32 _hash, address _signer) {
        require(documents[_hash].signed[_signer] != 3, "already removed");
        _;
    }
}
