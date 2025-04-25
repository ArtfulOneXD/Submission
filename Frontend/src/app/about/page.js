"use client"

import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-800 dark:text-white">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-black overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-bold mb-6 leading-tight tracking-tight"
        >
          Reimagining Crowdfunding with <span className="text-blue-600">CrowdX</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl"
        >
          CrowdX is a decentralized, blockchain-powered platform designed to shake up the funding game. We cut the fees, increase transparency, and put power in the hands of creators, not middlemen.
        </motion.p>
        <div className="absolute inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-500/10"></div>
      </section>

      {/* About Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-10 text-left space-y-10 w-full"
        >
          <section>
            <h3 className="text-3xl font-semibold text-blue-600 mb-4">🚨 The Problem</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Crowdfunding today is broken — bloated with fees, plagued by delays, and locked behind borders. Platforms like GoFundMe and Kickstarter take up to 12% while offering little clarity on where funds go. For millions around the world, the door to innovation remains shut.
            </p>
          </section>

          <section>
            <h3 className="text-3xl font-semibold text-blue-600 mb-4">💡 The Solution</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              CrowdX uses smart contracts to automate trust. No middlemen, no surprises. Funds are automatically released upon milestone completion. Our dual payment system supports both crypto and fiat, and real-time updates ensure you're always in the loop.
            </p>
          </section>

          <section>
            <h3 className="text-3xl font-semibold text-blue-600 mb-4">🌐 Features that Change the Game</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg pl-5 space-y-2">
              <li>Smart contract-based milestone disbursement</li>
              <li>Payment system that allows users to use Crypto</li>
              <li>Global, borderless participation</li>
              <li>Real-time updates via WebSockets</li>
              <li>Backer transparency & fund tracking</li>
            </ul>
          </section>

          <section>
            <h3 className="text-3xl font-semibold text-blue-600 mb-4">🎯 Our Mission</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              To break down financial barriers and empower innovators across the globe. Whether you're in Silicon Valley or rural Ghana, you deserve equal access to funding — no friction, no bias, no barriers.
            </p>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CrowdX. Built by Team 9A to decentralize opportunity.
      </footer>
    </div>
  );
}
