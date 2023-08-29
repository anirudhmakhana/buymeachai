import { ethers } from "hardhat";

// Interface to represent the Memo structure from the Chai contract
interface Memo {
  name: string; // Sender's name
  message: string; // The memo message itself
  timestamp: number; // Timestamp of the memo
  from: string; // Ethereum address of the sender
}

// Function to get and return the balance of an Ethereum address
async function getBalance(address: string): Promise<string> {
  const balance = await ethers.provider.getBalance(address);
  console.log(ethers.formatEther(balance));
  return ethers.formatEther(balance);
}

// Function to print the balances of an array of Ethereum addresses
async function consoleBalance(addresses: string[]) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter++}: ${address}`, await getBalance(address));
  }
}

// Function to print the memos to the console
async function consoleMemos(memos: Memo[]) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    console.log(`Memo: ${timestamp} ${name} ${from} ${message}`);
  }
}

// Main function to demonstrate the process
async function main() {
  // Fetching signers from the Hardhat runtime environment
  const [owner, fromOne, fromTwo, fromThree] = await ethers.getSigners();

  // Storing the Ethereum addresses of the signers into an array
  const addresses = [
    await owner.getAddress(),
    await fromOne.getAddress(),
    await fromTwo.getAddress(),
    await fromThree.getAddress(),
  ];

  // Deploying the Chai contract
  const chai = await ethers.getContractFactory("Chai");
  const chaiContract = await chai.deploy();
  chaiContract.waitForDeployment();

  // Printing the contract address to the console
  console.log("Address of the Chai contract:", await chaiContract.getAddress());
  console.log("Before buying Chai:");
  await consoleBalance(addresses);

  // Simulating a purchase of Chai from the first signer
  const amount = ethers.parseEther("0.001");
  await chaiContract
    .connect(fromOne)
    .buyChai(await fromOne.getAddress(), "Very nice chai", { value: amount });

  // Printing balances after the purchase
  console.log("After buying Chai:");
  await consoleBalance(addresses);
}

// Ensuring that we can use async/await and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
