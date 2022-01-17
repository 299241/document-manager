// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract DocumentManager {
    enum DocumentStatus {
        EDITING,
        SIGNING,
        FINISHED
    }
    enum SignatureStatus {
        NOT_INITIALIZED,
        AWAITING,
        SIGNED
    }

    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    struct Document {
        uint256 blockNumber;
        uint256 signaturesCount;
        address author;
        bool importantOrder;
        string name;
        address[] signers;
        mapping(address => SignatureStatus) signed;
    }

    event DocumentCreated(
        bytes32 indexed _hash,
        uint256 _blockNumber,
        string _name,
        bool _importantOrder,
        bool _filesEncrypted,
        address indexed _author,
        address[] _signers,
        Multihash[] _files
    );
    event DocumentSigned(bytes32 indexed _hash, address _author);
    event DocumentOpened(bytes32 indexed _hash, address _author);
    event DocumentNameChanged(
        bytes32 indexed _hash,
        string oldName,
        string newName
    );
    event DocumentSignersUpdated(bytes32 indexed _hash, address[] _signers);
    event DocumentSent(bytes32 indexed _hash, address[] _signers);
    event DocumentSentToSigner(bytes32 _hash, address indexed _signer);
    event DocumentRequiresSignature(bytes32 _hash, address indexed _signer);

    mapping(bytes32 => Document) documents;

    function create(
        bytes32 _hash,
        string calldata _name,
        address[] calldata _signers,
        Multihash[] calldata _files,
        bool _importantOrder,
        bool _filesEncrypted
    ) external {
        require(documents[_hash].blockNumber == 0, "already_tracked");
        require(bytes(_name).length > 0, "empty_name");
        require(_signers.length > 0, "empty_signers");
        require(_files.length > 0, "empty_files");
        Document storage d = documents[_hash];
        d.blockNumber = block.number;
        d.name = _name;
        d.author = msg.sender;
        d.signers = _signers;
        d.importantOrder = _importantOrder;
        emit DocumentCreated(
            _hash,
            block.number,
            _name,
            _importantOrder,
            _filesEncrypted,
            msg.sender,
            _signers,
            _files
        );
    }

    function changeName(bytes32 _hash, string calldata _newName)
        external
        onlyTracked(_hash)
        onlyAuthor(_hash, msg.sender)
    {
        require(bytes(_newName).length > 0, "empty_new_name");
        string memory oldName = documents[_hash].name;
        documents[_hash].name = _newName;
        emit DocumentNameChanged(_hash, oldName, _newName);
    }

    function updateSigners(
        bytes32 _hash,
        address[] calldata _signers,
        bool _importantOrder
    )
        external
        onlyTracked(_hash)
        onlyAuthor(_hash, msg.sender)
        onlyEditable(_hash)
    {
        require(_signers.length > 0, "empty_signers");
        delete documents[_hash].signers;
        documents[_hash].signers = _signers;
        documents[_hash].importantOrder = _importantOrder;
        emit DocumentSignersUpdated(_hash, _signers);
    }

    function sendDocument(bytes32 _hash)
        external
        onlyTracked(_hash)
        onlyAuthor(_hash, msg.sender)
        onlyEditable(_hash)
    {
        for (uint256 i = 0; i < documents[_hash].signers.length; i++) {
            documents[_hash].signed[
                documents[_hash].signers[i]
            ] = SignatureStatus.AWAITING;
            emit DocumentSentToSigner(_hash, documents[_hash].signers[i]);
        }
        emit DocumentSent(_hash, documents[_hash].signers);
    }

    function sign(bytes32 _hash)
        external
        onlyTracked(_hash)
        onlySigners(_hash, msg.sender)
        onlyToSigned(_hash, msg.sender)
    {
        Document storage d = documents[_hash];

        if (d.importantOrder) {
            address actualSigner = d.signers[d.signaturesCount];
            if (actualSigner != address(0)) {
                require(actualSigner == msg.sender, "no_sequence");
            }
        }

        d.signed[msg.sender] = SignatureStatus.SIGNED;
        d.signaturesCount++;
        emit DocumentSigned(_hash, msg.sender);

        if (d.importantOrder && d.signaturesCount < d.signers.length) {
            address nextSigner = d.signers[d.signaturesCount];
            if (nextSigner != address(0)) {
                emit DocumentRequiresSignature(_hash, nextSigner);
            }
        }
    }

    function openDocument(bytes32 _hash) external onlyTracked(_hash) {
        emit DocumentOpened(_hash, msg.sender);
    }

    function getDocumentStatus(bytes32 _hash)
        external
        view
        onlyTracked(_hash)
        returns (DocumentStatus, uint256)
    {
        if (
            documents[_hash].signed[documents[_hash].signers[0]] ==
            SignatureStatus.NOT_INITIALIZED
        ) {
            return (DocumentStatus.EDITING, documents[_hash].signaturesCount);
        } else if (
            documents[_hash].signaturesCount == documents[_hash].signers.length
        ) {
            return (DocumentStatus.FINISHED, documents[_hash].signaturesCount);
        } else {
            return (DocumentStatus.SIGNING, documents[_hash].signaturesCount);
        }
    }

    function getDocument(bytes32 _hash)
        external
        view
        onlyTracked(_hash)
        returns (
            uint256,
            uint256,
            bool,
            address,
            string memory,
            address[] memory,
            DocumentStatus
        )
    {
        Document storage d = documents[_hash];
        DocumentStatus status;
        uint256 count;
        (status, count) = this.getDocumentStatus(_hash);
        return (
            d.blockNumber,
            count,
            d.importantOrder,
            d.author,
            d.name,
            d.signers,
            status
        );
    }

    modifier onlyTracked(bytes32 _hash) {
        require(documents[_hash].blockNumber != 0, "only_tracked");
        _;
    }

    modifier onlySigners(bytes32 _hash, address _signer) {
        require(
            documents[_hash].signed[_signer] != SignatureStatus.NOT_INITIALIZED,
            "only_signers"
        );
        _;
    }

    modifier onlyAuthor(bytes32 _hash, address _author) {
        require(documents[_hash].author == _author, "only_author");
        _;
    }

    modifier onlyToSigned(bytes32 _hash, address _signer) {
        require(
            documents[_hash].signed[_signer] == SignatureStatus.AWAITING,
            "not_allowed_to_sign"
        );
        _;
    }

    modifier onlyEditable(bytes32 _hash) {
        require(
            documents[_hash].signed[documents[_hash].signers[0]] ==
                SignatureStatus.NOT_INITIALIZED,
            "not_editable"
        );
        _;
    }
}
