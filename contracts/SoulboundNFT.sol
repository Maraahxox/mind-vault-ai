// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SoulboundNFT is ERC721 {
    uint256 private _tokenIds;
    mapping(address => bool) public hasMinted;

    constructor() ERC721("MindVault Soulbound", "MVSB") {}

    /// @notice Mint a soulbound NFT to the caller
    function mintSoulbound() external {
        require(!hasMinted[msg.sender], "You already own a Soulbound NFT");
        _tokenIds++;
        _safeMint(msg.sender, _tokenIds);
        hasMinted[msg.sender] = true;
    }

    /// @notice Disable transfers (only support minting)
    function transferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("Soulbound: Token cannot be transferred");
    }

    /// @notice Disable safe transfers (only support minting)
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public pure override {
        revert("Soulbound: Token cannot be transferred");
    }

    /// Disable approvals
    function approve(address, uint256) public pure override {
        revert("Soulbound: Approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: Approvals disabled");
    }
}
