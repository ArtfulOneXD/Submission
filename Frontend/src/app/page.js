"use client";

import Link from "next/link";
import { ShieldCheckIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { motion } from "framer-motion";


export default function Home() {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-16 h-16 text-blue-600" />,
      title: "Secure & Reliable",
      desc: "Smart contracts & Web3 protect your funds and data.",
    },
    {
      icon: <UsersIcon className="w-16 h-16 text-blue-600" />,
      title: "Effortless Collaboration",
      desc: "Connect, manage, and update your supporters easily.",
    },
    {
      icon: <LightBulbIcon className="w-16 h-16 text-blue-600" />,
      title: "Built for Innovation",
      desc: "Designed to help you launch fast and scale smart.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">

      {/* Hero Section */}
      <section className="relative text-center py-28 px-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-black overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight"
        >
          Fuel Your Dreams with <span className="text-blue-600">CrowdX</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Launch secure crowdfunding campaigns, backed by Web3 and real-time support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl shadow-lg transition-all"
          >
            🚀 Explore Campaigns
          </Link>
          <Link
            href="/create"
            className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 text-lg font-medium rounded-xl transition-all"
          >
            ✨ Start a Campaign
          </Link>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-500/10"></div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">Why Choose CrowdX?</h3>
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {feature.icon}
              <h4 className="text-xl font-semibold text-blue-600">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 text-center bg-blue-50 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-12 text-gray-800 dark:text-white">How It Works</h3>
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto text-left">
          {[
            {
              title: "1. Create a Project",
              steps: ["Describe your vision.", "Set goals and payout milestones."],
            },
            {
              title: "2. Connect with Backers",
              steps: ["Build trust with updates.", "Engage with real-time feedback."],
            },
            {
              title: "3. Achieve Your Goals",
              steps: ["Receive funds milestone-by-milestone.", "Deliver results transparently."],
            },
          ].map((block, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col gap-3 bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <h4 className="text-xl font-semibold text-blue-700">{block.title}</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {block.steps.map((step, j) => <li key={j}>{step}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CrowdX. Built with transparency in mind.
      </footer>
    </div>
  );
}
