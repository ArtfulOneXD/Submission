// src/app/dashboard/blockchain-campaigns/page.jsx
"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const contractABI     = contractArtifact.abi;
const contractAddress = "0xbC4035141C91Eea75189deD24c2A13674c3E8B8E";
const LOCAL_RPC_URL   = "http://127.0.0.1:8545";

export default function BlockchainCampaignsPage() {
  const [campaigns,      setCampaigns]      = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [donationInputs, setDonationInputs] = useState({}); // { [id]: amountStr }

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      setError("");

      try {
        let provider;

        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
          provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
        }

        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // get the counter (1 = no campaigns)
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
          calls.push(contract.campaigns(i));
        }
        const results = await Promise.all(calls);

        const formatted = results.map((c, i) => ({
          id:            i + 1,
          title:         c.title,
          description:   c.description,
          goalAmount:    ethers.utils.formatEther(c.goalAmount),
          currentAmount: ethers.utils.formatEther(c.currentAmount),
          startTime:     new Date(c.startTime * 1000).toLocaleString(),
          endTime:       new Date(c.endTime   * 1000).toLocaleString(),
          creator:       c.creator,
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

      // refresh on‑chain data
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Donation failed: " + err.message);
    }
  };

  if (loading) return <div className="p-4">Loading on‑chain campaigns…</div>;
  if (error)   return <div className="p-4 text-red-600">Error: {error}</div>;
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
            <p>🎯 Goal: {c.goalAmount} ETH</p>
            <p>💰 Raised: {c.currentAmount} ETH</p>
            <p>⏰ Starts: {c.startTime}</p>
            <p>⏱ Ends: {c.endTime}</p>


            <p>👤 Creator: {c.creator}</p>
          </div>

          {/* ← Donate UI */}
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
        </div>
      ))}
    </div>
  );
}
