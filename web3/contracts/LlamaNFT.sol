// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@thirdweb-dev/contracts/extension/interface/IMintableERC721.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC721Supply.sol";

contract LlamaNFT is ERC721URIStorage, IMintableERC721, IERC721Supply {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    function mint(address to, string memory tokenURI) public override returns (uint256) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    function totalSupply() public view override returns (uint256) {
        return _tokenIds.current();
    }
}
