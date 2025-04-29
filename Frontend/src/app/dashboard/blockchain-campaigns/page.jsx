"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const contractABI = contractArtifact.abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export default function BlockchainCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [donationInputs, setDonationInputs] = useState({});
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      setError("");

      try {
        let provider;

        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
        } else {
          provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
        }

        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        let counter = 1;
        try {
          const bn = await contract.campaignCounter();
          counter = bn.toNumber();
        } catch {
          counter = 1;
        }

        if (counter <= 1) {
          setCampaigns([]);
          return;
        }

        const calls = [];
        for (let i = 1; i < counter; i++) {
          calls.push(contract.viewCampaign(i));
        }
        const results = await Promise.all(calls);

        const formatted = results.map((c, i) => ({
          id:            i + 1,
          title:         c[0],
          description:   c[1],
          goalAmount:    ethers.utils.formatEther(c[2]),
          totalRaised:   ethers.utils.formatEther(c[3]), // changed from currentAmount
          startTime:     new Date(c[4] * 1000),
          endTime:       new Date(c[5] * 1000),
          creator:       c[6],
          closed:        c[7],
          goalReached:   c[8],
          fundsClaimed:  c[9],
        }));

        setCampaigns(formatted);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  const handleDonate = async (id) => {
    const amountStr = donationInputs[id];
    if (!amountStr || isNaN(amountStr) || Number(amountStr) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      if (!window.ethereum) {
        alert("Install MetaMask first");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const value = ethers.utils.parseEther(amountStr);
      const tx = await contract.donateCampaign(id, { value });
      await tx.wait();

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Donation failed: " + err.message);
    }
  };

  const handleClaimFunds = async (id) => {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask first");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.claimFunds(id);
      await tx.wait();

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Claim failed: " + err.message);
    }
  };

  if (loading) return <div className="p-4">Loading on‑chain campaigns…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (campaigns.length === 0)
    return <div className="p-4">No campaigns found on‑chain.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Campaigns on the Blockchain</h1>
      {campaigns.map((c) => (
        <div key={c.id} className="border rounded-lg p-4 shadow bg-white/10">
          <h2 className="text-xl font-semibold">{c.title}</h2>
          <p className="mt-1">{c.description}</p>
          <div className="mt-3 text-sm space-y-1">
            <p>🎯 Goal: {c.goalAmount} ETH</p>
            <p>💰 Total Raised: {c.totalRaised} ETH</p>
            <p>⏰ Starts: {c.startTime.toLocaleString()}</p>
            <p>⏱ Ends: {c.endTime.toLocaleString()}</p>
            <p>👤 Creator: {c.creator}</p>
            <p>🏦 Funds Claimed: {c.fundsClaimed ? "✅ Yes" : "❌ No"}</p>
          </div>

          {/* Donate UI */}
          {!c.closed && (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="ETH amount"
                className="w-28 p-2 border rounded bg-black/20"
                value={donationInputs[c.id] || ""}
                onChange={(e) =>
                  setDonationInputs({
                    ...donationInputs,
                    [c.id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => handleDonate(c.id)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
              >
                Donate
              </button>
            </div>
          )}

          {/* Claim Funds Button */}
          {!c.closed && c.goalReached && c.creator.toLowerCase() === userAddress.toLowerCase() && (
            <div className="mt-4">
              <button
                onClick={() => handleClaimFunds(c.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Claim Funds
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
