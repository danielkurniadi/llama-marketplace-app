// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@thirdweb-dev/contracts/extension/interface/IMintableERC721.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC721Supply.sol";

/**
 * @title LlamaNFT
 * @dev This contract represents a non-fungible token (NFT) that represents ownership of a unique llama.
 * Each llama has a unique ID and is associated with a specific owner address.
 */
contract LlamaNFT is ERC721URIStorage, IMintableERC721, IERC721Supply {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    /**
     * @dev See {IERC165-supportsInterface}.
     * Returns true if `interfaceId` is supported by this contract.
     * See the {IERC165} documentation for details.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     * Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev See {ERC721-_burn}.
     * Destroys `tokenId`.
     * Throws if `tokenId` does not exist.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
    }

    /**
     * @dev See {ERC721URIStorage-_setTokenURI}.
     * Sets `uri` as the tokenURI of `tokenId`.
     * Throws if `tokenId` does not exist.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {IMintableERC721-mintTo}.
     * Mints a new NFT.
     * Throws if `to` is the zero address.
     * Throws if `uri` is empty.
     */
    function mintTo(address to, string calldata uri) external override returns (uint256) {
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        _tokenIds.increment();
        emit TokensMinted(to, newTokenId, uri);
        return newTokenId;
    }

    /**
     * @dev See {IMintableERC721-mintBatchTo}.
     * Mints a batch of new NFTs.
     * Throws if `to` is the zero address.
     * Throws if `uris` is empty.
     */
    function totalSupply() public view override returns (uint256) {
        return _tokenIds.current();
    }
}
