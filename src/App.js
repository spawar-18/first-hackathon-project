import React, { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contracts/CollegeDAO";
import "./App.css";

function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [proposals, setProposals] = useState([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {

        const provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();

        const address = await signer.getAddress();

        setWalletAddress(address);

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("Contract connected:", contract);

      } catch (error) {
        console.log(error);
      }

    } else {
      alert("Please install MetaMask");
    }
  };

  /*
  const createProposal = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    const tx = await contract.createProposal(proposalText);

    await tx.wait();

    alert("Proposal created on blockchain!");
  };
  */

  const createProposal = () => {

    if (!proposalText) return;

    const newProposal = {
      id: proposals.length,
      description: proposalText,
      votes: 0
    };

    setProposals([...proposals, newProposal]);

    setProposalText("");
  };

  const voteProposal = (id) => {

    const updated = proposals.map((proposal) => {
      if (proposal.id === id) {
        return { ...proposal, votes: proposal.votes + 1 };
      }
      return proposal;
    });

    setProposals(updated);
  };

 return (
  <div className="container">

    <h1 className="title">College Community DAO</h1>

    <button className="connectBtn" onClick={connectWallet}>
      Connect Wallet
    </button>

    {walletAddress && (
      <p className="wallet">Connected Wallet: {walletAddress}</p>
    )}

    <br/><br/>

    <input
      className="inputBox"
      type="text"
      placeholder="Enter proposal"
      value={proposalText}
      onChange={(e) => setProposalText(e.target.value)}
    />

    <button className="createBtn" onClick={createProposal}>
      Create Proposal
    </button>

    <h2>Proposals</h2>

    {proposals.map((proposal) => (
      <div key={proposal.id} className="proposalCard">

        <p>{proposal.description}</p>

        <p>Votes: {proposal.votes}</p>

        <button
          className="voteBtn"
          onClick={() => voteProposal(proposal.id)}
        >
          Vote
        </button>

      </div>
    ))}

  </div>
);
}

export default App;