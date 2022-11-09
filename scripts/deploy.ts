import { ethers } from "hardhat";
import { config } from "./config";
import fs from "fs";

const distDir = `./dist`;
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
const outFilename = `${distDir}/${config.network}.json`;


async function main() {
  await deployCollectionManager()
}

async function deployCollectionManager() {
  const Factory = await ethers.getContractFactory("CollectionManager");
  const collectionManager = await Factory.deploy();

  await collectionManager.deployed();

  const saveData = {
    contractAddress: collectionManager.address,
  };
  const saveStr = JSON.stringify(saveData, null, 2);
  fs.writeFileSync(outFilename, saveStr);

  console.log(`CollectionManager deployed to ${collectionManager.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
