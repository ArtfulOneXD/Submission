"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const LOCAL_RPC_URL = "http://127.0.0.1:8545";
const contractAddress = "0xbC4035141C91Eea75189deD24c2A13674c3E8B8E";
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
        const c = await contract.campaigns(parseInt(id));

        setCampaign({
          title: c.title,
          description: c.description,
          goal: ethers.utils.formatEther(c.goalAmount),
          raised: ethers.utils.formatEther(c.currentAmount),
          creator: c.creator,
          start: new Date(c.startTime * 1000).toLocaleString(),
          end: new Date(c.endTime * 1000).toLocaleString(),
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
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{campaign.title}</h1>
      <p className="text-gray-400">{campaign.description}</p>

      <div className="text-sm mt-4 space-y-1">
        <p>👤 Creator: {campaign.creator}</p>
        <p>🎯 Goal: {campaign.goal} ETH</p>
        <p>💰 Raised: {campaign.raised} ETH</p>
        <p>⏰ Starts: {campaign.start}</p>
        <p>🏁 Ends: {campaign.end}</p>
      </div>
    </div>
  );
}
