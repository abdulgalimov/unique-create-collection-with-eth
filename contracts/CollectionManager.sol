pragma solidity ^0.8.0;

import {CollectionHelpers} from  "@unique-nft/solidity-interfaces/contracts/CollectionHelpers.sol";
import {Collection} from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

contract CollectionManager {
    CollectionHelpers helpers = CollectionHelpers(0x6C4E9fE1AE37a41E93CEE429e8E1881aBdcbb54F);

    event CollectionCreated(address collectionAddress);

    constructor() {}

    function createCollection(
        string memory name,
        string memory description,
        string memory symbol
    ) external payable returns (address) {
        address collectionAddress = helpers.createNFTCollection{value: helpers.collectionCreationFee()}(name, description, symbol);
        emit CollectionCreated(collectionAddress);
        return collectionAddress;
    }

    struct SetCollectionProperty {
        string key;
        string value;
    }

    struct SetCollectionLimit {
        string limit;
        uint32 value;
    }

    struct UpdateData {
        SetCollectionProperty[] setCollectionProperty;
        SetCollectionLimit[] setCollectionLimit;
    }

    function updateCollection(address collectionAddress, UpdateData calldata update) external {
        Collection collection = Collection(collectionAddress);

        for (uint i=0; i<update.setCollectionProperty.length; i++) {
            SetCollectionProperty calldata setCollectionProperty = update.setCollectionProperty[i];
            collection.setCollectionProperty(setCollectionProperty.key, bytes(setCollectionProperty.value));
        }

        for (uint i=0; i<update.setCollectionLimit.length; i++) {
            SetCollectionLimit calldata setCollectionLimit = update.setCollectionLimit[i];
            collection.setCollectionLimit(setCollectionLimit.limit, setCollectionLimit.value);
        }
    }
}
