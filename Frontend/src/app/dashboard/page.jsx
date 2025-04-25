"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAuth } from "@/components/authProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import contractArtifact from "@/lib/CrowdXCampaign.json";

import { AppSidebar, SidebarItem } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (res.status === 401) throw { status: 401 };
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const CAMPAIGN_API_URL = "/api/campaigns";
const LOCAL_RPC_URL = "http://127.0.0.1:8545";
const contractAddress = "0xbC4035141C91Eea75189deD24c2A13674c3E8B8E";
const contractABI = contractArtifact.abi;

export default function DashboardPage() {
  const auth = useAuth();
  const { data: dbCampaigns, error, isLoading } = useSWR(CAMPAIGN_API_URL, fetcher);
  const [chainCampaigns, setChainCampaigns] = useState([]);

  useEffect(() => {
    if (error?.status === 401) auth.loginRequiredRedirect();
  }, [error, auth]);

  useEffect(() => {
    const fetchChainCampaigns = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const counter = (await contract.campaignCounter()).toNumber();

        const calls = [];
        for (let i = 1; i < counter; i++) {
          calls.push(contract.campaigns(i));
        }

        const results = await Promise.all(calls);

        const formatted = results.map((c, i) => ({
          id: `onchain-${i + 1}`,
          title: c.title,
          description: c.description,
          creator: { username: c.creator.slice(0, 6) + "..." },
          goal_amount: ethers.utils.formatEther(c.goalAmount),
          current_amount: ethers.utils.formatEther(c.currentAmount),
        }));

        setChainCampaigns(formatted);
      } catch (err) {
        console.error("Error fetching on-chain campaigns:", err);
      }
    };

    fetchChainCampaigns();
  }, []);

  const allCampaigns = [
    ...(Array.isArray(dbCampaigns) ? dbCampaigns : []),
    ...chainCampaigns,
  ];

  const isEmpty = allCampaigns.length === 0;

  if (isLoading) return <p className="p-6 text-center">Loading campaigns…</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error loading campaigns.</p>;

  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarItem label="All Campaigns" href="/dashboard" />
        <SidebarItem label="My Campaigns" href="/dashboard/my-campaigns" />
        <SidebarItem label="Create Campaign" href="/create" />
        <SidebarItem label="Blockchain Campaigns" href="/dashboard/blockchain-campaigns" />
        <SidebarItem label="Edit Account" href="/dashboard/account" />
        <SidebarItem label="Logout" href="/logout" />
      </AppSidebar>

      <SidebarInset className="p-6 bg-white/90 dark:bg-gray-900 flex-1 overflow-auto">
        {isEmpty ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No campaigns yet</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              You haven’t created or joined any campaigns.
            </p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ✨ Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* “Create” card always first */}
            <Link href="/create">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition"
              >
                <span className="text-4xl mb-2">+</span>
                <p className="font-medium">Create Campaign</p>
              </motion.div>
            </Link>

            {allCampaigns.map((c) => (
  <Link key={c.id} href={`/campaigns/${c.id}`}>
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{c.title}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {c.description}
      </p>
      <div className="mt-4 text-sm space-y-1">
        <p>👤 By: <span className="font-medium">{c.creator?.username || "—"}</span></p>
        <p>🎯 Goal: <span className="font-medium">${c.goal_amount}</span></p>
        <p>💰 Raised: <span className="font-medium">${c.current_amount}</span></p>
      </div>
    </motion.div>
  </Link>
))}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
