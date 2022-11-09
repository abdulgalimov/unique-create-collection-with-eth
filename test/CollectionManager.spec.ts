import { config } from "../scripts/config";
import { ethers } from "hardhat";
import {
  CollectionHelpers__factory,
  CollectionManager,
  CollectionManager__factory,
} from "../typechain-types";

describe("CollectionManager", function () {
  it("test update", async () => {
    const wallet = new ethers.Wallet(
      config.metamaskPrivateKey,
      ethers.getDefaultProvider(config.uniquerc.rpcUrl)
    );

    const collectionHelpers = CollectionHelpers__factory.connect(
      "0x6C4E9fE1AE37a41E93CEE429e8E1881aBdcbb54F",
      wallet
    );

    const collectionManager: CollectionManager =
      CollectionManager__factory.connect(
        config.uniquerc.contractAddress,
        wallet
      );

    const feeValue = await collectionHelpers.collectionCreationFee();

    const result = await (
      await collectionManager.createCollection(
        "name",
        "description",
        "prefix",
        {
          value: feeValue,
        }
      )
    ).wait();

    const collectionCreatedEvent = result.events?.find(
      (event) => event.event === "CollectionCreated"
    );
    const collectionAddress = collectionCreatedEvent?.args
      ? collectionCreatedEvent?.args[0]
      : null;
    const collectionId = parseInt("0x" + collectionAddress.substring(34), 16);

    console.log(`collection created: ${collectionAddress} / ${collectionId}`);

    const updateTx = await collectionManager.updateCollection(
      collectionAddress,
      {
        setCollectionProperty: [
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
        ],
        setCollectionLimit: [{ limit: "tokenLimit", value: 123 }],
      },
      {
        gasLimit: 10_000_000,
      }
    );
    await updateTx.wait();

    console.log("collection updated");
  });
});
