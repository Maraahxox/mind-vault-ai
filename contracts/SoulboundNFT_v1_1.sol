// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SoulboundNFT
 * @dev Enhanced soulbound NFT contract with burn functionality and metadata support.
 * Soulbound tokens cannot be transferred once minted, representing non-transferable credentials.
 */
contract SoulboundNFT_v1_1 is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIds;
    uint256 public immutable MAX_SUPPLY;

    // Base URI for token metadata
    string private _baseTokenURI;

    mapping(address => bool) public hasMinted;
    mapping(uint256 => bool) public isBurned;

    // Events
    event SoulboundMinted(address indexed recipient, uint256 indexed tokenId);
    event SoulboundBurned(address indexed owner, uint256 indexed tokenId);

    /**
     * @dev Constructor to initialize the contract
     * @param maxSupply Maximum number of tokens that can be minted
     * @param baseURI Base URI for token metadata
     * @param initialOwner Address of the contract owner
     */
    constructor(
        uint256 maxSupply,
        string memory baseURI,
        address initialOwner
    )
        ERC721("MindVault Soulbound", "MVSB")
        Ownable(initialOwner)
    {
        require(maxSupply > 0, "Max supply must be greater than 0");
        MAX_SUPPLY = maxSupply;
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Mint a soulbound NFT to the caller
     * Requirements:
     * - Caller hasn't minted before
     * - Total supply hasn't reached max supply
     */
    function mintSoulbound() external {
        require(!hasMinted[msg.sender], "You already own a Soulbound NFT");
        require(_tokenIds < MAX_SUPPLY, "Max supply reached");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        hasMinted[msg.sender] = true;

        emit SoulboundMinted(msg.sender, newTokenId);
    }

    /**
     * @dev Burn a soulbound NFT - can only be called by token owner
     * @param tokenId The token ID to burn
     */
    function burnSoulbound(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(!isBurned[tokenId], "Token already burned");

        isBurned[tokenId] = true;
        hasMinted[msg.sender] = false; // Allow re-minting after burn

        _burn(tokenId);

        emit SoulboundBurned(msg.sender, tokenId);
    }

    /**
     * @dev Set base URI for metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Get total supply of minted tokens (including burned)
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Get active supply (total minted minus burned)
     */
    function activeSupply() external view returns (uint256) {
        uint256 burnedCount = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (isBurned[i]) {
                burnedCount++;
            }
        }
        return _tokenIds - burnedCount;
    }

    /**
     * @dev Get base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Get token URI with metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(!isBurned[tokenId], "Token burned");
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString()))
            : "";
    }

    /**
     * @dev Override transfer functions to prevent transfers (soulbound logic)
     */
    function transferFrom(address, address, uint256) public pure override {
        revert("Soulbound: Token cannot be transferred");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("Soulbound: Token cannot be transferred");
    }

    function approve(address, uint256) public pure override {
        revert("Soulbound: Approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: Approvals disabled");
    }

    /**
     * @dev Check if token exists and is not burned
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0) && !isBurned[tokenId];
    }
}
