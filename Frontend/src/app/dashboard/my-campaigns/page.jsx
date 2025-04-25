"use client";
import useSWR from "swr";
import Link from "next/link";
import { useAuth } from "@/components/authProvider";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MyCampaignsPage() {
  const auth = useAuth();
  const {
    data: campaigns,
    error,
    isLoading,
  } = useSWR("/api/campaigns/mine", fetcher);

  if (error) return <div className="p-6">⚠️ Failed to load your campaigns</div>;
  if (isLoading) return <div className="p-6">⏳ Loading your campaigns...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <Link
          href="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Create Campaign
        </Link>
      </div>

      {Array.isArray(campaigns) && campaigns.length === 0 && (
        <div className="text-muted-foreground">
          You haven’t created any campaigns yet.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(campaigns) &&
          campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
              <div className="p-4 rounded bg-gray-100 hover:bg-gray-200 transition">
                <h2 className="font-semibold">{campaign.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {campaign.description}
                </p>
                <p className="text-xs mt-2">🎯 Goal: ${campaign.goal_amount}</p>
                <p className="text-xs">💰 Raised: ${campaign.current_amount}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
