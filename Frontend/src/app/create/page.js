"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const contractABI = contractArtifact.abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;


export default function CreateCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const goalWei = ethers.utils.parseEther(goalAmount.toString());
      const startTs = Math.floor(new Date(startDate).getTime() / 1000);
      const endTs = Math.floor(new Date(endDate).getTime() / 1000);

      const tx = await contract.createCampaign(
        title,
        description,
        goalWei,
        startTs,
        endTs
      );

      await tx.wait();
      router.push("/dashboard/blockchain-campaigns");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-4xl font-bold text-white mb-6">
            Create Campaign (On‑Chain)
          </h1>
          {error && (
            <div className="bg-red-800 text-red-200 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Goal Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-md hover:from-indigo-700 hover:to-purple-700 transition"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
