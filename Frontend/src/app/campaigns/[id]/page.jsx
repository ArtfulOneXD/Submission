"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const LOCAL_RPC_URL = "http://127.0.0.1:8545";
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI = contractArtifact.abi;

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id?.replace("onchain-", "");
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const c = await contract.viewCampaign(parseInt(id));

        const goal = parseFloat(ethers.utils.formatEther(c[2]));
        const raised = parseFloat(ethers.utils.formatEther(c[3]));
        const progress = Math.min((raised / goal) * 100, 100);

        setCampaign({
          title: c[0],
          description: c[1],
          goal,
          raised,
          creator: c[6],
          start: new Date(c[4] * 1000).toLocaleString(),
          end: new Date(c[5] * 1000).toLocaleString(),
          fundsClaimed: c[9],
          progress,
        });
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load campaign data.");
      }
    };

    if (id) fetchCampaign();
  }, [id]);

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert("Please enter a valid donation amount");
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

      const value = ethers.utils.parseEther(donationAmount);
      const tx = await contract.donateCampaign(parseInt(id), { value });
      await tx.wait();

      alert("Donation successful!");

      // Refresh the campaign info
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Donation failed: " + err.message);
    }
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!campaign) return <div className="p-6">Loading on-chain campaign…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{campaign.title}</h1>
      <p className="text-gray-400">{campaign.description}</p>

      <div className="text-sm mt-4 space-y-1">
        <p>👤 Creator: {campaign.creator}</p>
        <p>🎯 Goal: {campaign.goal} ETH</p>
        <p>💰 Total Raised: {campaign.raised} ETH</p>
        <p>🏦 Funds Claimed: {campaign.fundsClaimed ? "✅ Yes" : "❌ No"}</p>

        {/* Animated progress bar */}
        <div className="mt-4 bg-gray-700 rounded-full h-4 w-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-green-500 transition-all duration-700 ease-in-out"
            style={{ width: `${campaign.progress}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-300">
          {campaign.progress.toFixed(1)}% funded
        </p>

        <p>⏰ Starts: {campaign.start}</p>
        <p>🏁 Ends: {campaign.end}</p>
      </div>

      {/* 🧡 Donation input and button */}
      <div className="mt-6 flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          placeholder="ETH amount"
          className="w-32 p-2 border rounded bg-black/20"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
        />
        <button
          onClick={handleDonate}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
        >
          Donate
        </button>
      </div>
    </div>
  );
}
