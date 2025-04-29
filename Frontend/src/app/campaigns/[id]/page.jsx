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
    </div>
  );
}
