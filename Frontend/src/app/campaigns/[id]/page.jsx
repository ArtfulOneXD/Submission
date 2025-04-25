"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { data, error, isLoading, mutate } = useSWR(
    id ? `http://localhost:8001/api/campaigns/campaign/${id}/` : null,
    fetcher
  );

  const [amount, setAmount] = useState("");
  const [donating, setDonating] = useState(false);

  const handleDonate = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    setDonating(true);
    try {
      const res = await fetch("http://localhost:8001/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parsedAmount,
          campaign_id: parseInt(id),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Stripe error: ${errorText}`);
      }

      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Donation failed: no redirect URL returned.");
      }
    } catch (err) {
      console.error("Donation error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setDonating(false);
    }
  };

  if (error) return <div className="p-4 text-red-600">❌ Failed to load campaign.</div>;
  if (isLoading || !data) return <div className="p-4">Loading campaign...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-muted-foreground">{data.description}</p>

      <div className="text-sm mt-4 space-y-1">
        <p>🎯 <strong>Goal:</strong> ${Number(data.goal_amount).toFixed(2)}</p>
        <p>💰 <strong>Raised:</strong> ${Number(data.current_amount).toFixed(2)}</p>
        <p>📅 <strong>Starts:</strong> {new Date(data.start_date).toLocaleDateString()}</p>
        <p>🏁 <strong>Ends:</strong> {data.end_date ? new Date(data.end_date).toLocaleDateString() : "N/A"}</p>
        <p>📌 <strong>Created:</strong> {new Date(data.created_at).toLocaleString()}</p>
        <p>🛠️ <strong>Updated:</strong> {new Date(data.updated_at).toLocaleString()}</p>
      </div>

      {/* 💳 Donation Section */}
      <div className="mt-6 space-y-2">
        <input
          type="number"
          placeholder="Enter amount (e.g., 20)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-full max-w-xs"
        />
        <button
          onClick={handleDonate}
          disabled={donating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {donating ? "Redirecting to Stripe..." : "Donate with Stripe"}
        </button>
      </div>
    </div>
  );
}
