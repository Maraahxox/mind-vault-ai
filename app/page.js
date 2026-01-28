"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer"; // Import for viewport detection

/**
 * Mind Vault - Full landing + interactive vault + neon web3 visuals
 * With MetaMask integration
 */

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [vaultData, setVaultData] = useState("");
  const [vaults, setVaults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canvasRef = useRef(null);

  // Intersection Observer hooks for animating sections
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: howRef, inView: howInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: vaultRef, inView: vaultInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: connectRef, inView: connectInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // -----------------------
  // Canvas: Spinning Purple Galaxy + Enhanced Particles
  // -----------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Enhanced particles with different types
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.3,
      type: Math.random() > 0.7 ? 'star' : 'particle',
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));

    // Galaxy spiral arms
    const galaxyArms = 4;
    const galaxyParticles = Array.from({ length: 200 }).map((_, i) => {
      const arm = i % galaxyArms;
      const distance = Math.random() * Math.min(w, h) * 0.4;
      const angle = (arm / galaxyArms) * Math.PI * 2 + (distance / 100) + Math.random() * 0.5;
      return {
        x: w / 2 + Math.cos(angle) * distance,
        y: h / 2 + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        angle,
        distance,
        arm,
      };
    });

    let t = 0;
    let raf;

    function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      // Galaxy background gradient
      const galaxyGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
      galaxyGrad.addColorStop(0, "rgba(147, 51, 234, 0.15)"); // Purple center
      galaxyGrad.addColorStop(0.3, "rgba(139, 69, 255, 0.1)");
      galaxyGrad.addColorStop(0.6, "rgba(168, 85, 247, 0.05)");
      galaxyGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = galaxyGrad;
      ctx.fillRect(0, 0, w, h);

      // Spinning galaxy arms
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(t * 0.1);

      for (const p of galaxyParticles) {
        const rotatedAngle = p.angle + t * 0.05;
        const x = Math.cos(rotatedAngle) * p.distance;
        const y = Math.sin(rotatedAngle) * p.distance;

        ctx.beginPath();
        ctx.globalAlpha = p.alpha * (0.8 + Math.sin(t + p.arm) * 0.2);
        const colors = [
          "rgba(147, 51, 234, 0.9)",   // Purple
          "rgba(168, 85, 247, 0.8)",   // Light purple
          "rgba(139, 69, 255, 0.7)",   // Blue purple
          "rgba(196, 181, 253, 0.6)",  // Light lavender
        ];
        ctx.fillStyle = colors[p.arm % colors.length];
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.globalAlpha = 1;

      // Enhanced floating particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        // Wrap around screen
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        const twinkleAlpha = p.alpha * (0.7 + Math.sin(p.twinkle) * 0.3);

        if (p.type === 'star') {
          // Star particles with glow
          ctx.shadowColor = "rgba(168, 85, 247, 0.8)";
          ctx.shadowBlur = 8;
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkleAlpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          // Add cross lines for star effect
          ctx.strokeStyle = `rgba(168, 85, 247, ${twinkleAlpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - p.r * 2, p.y);
          ctx.lineTo(p.x + p.r * 2, p.y);
          ctx.moveTo(p.x, p.y - p.r * 2);
          ctx.lineTo(p.x, p.y + p.r * 2);
          ctx.stroke();
        } else {
          // Regular particles
          ctx.shadowColor = "rgba(168, 85, 247, 0.6)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = `rgba(168, 85, 247, ${twinkleAlpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // -----------------------
  // Backend integration (save & fetch)
  // -----------------------
  useEffect(() => {
    if (!wallet) return;
    (async () => {
      try {
        const res = await fetch(`/api/get-vault?wallet=${encodeURIComponent(wallet)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.vault) {
          const arr = Array.isArray(data.vault) ? data.vault : [data.vault];
          arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setVaults(arr);
        } else {
          setVaults([]);
        }
      } catch (err) {
        console.error("Fetch vault error:", err);
      }
    })();
  }, [wallet]);

  // -----------------------
  // Connect wallet with MetaMask
  // -----------------------
  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts[0]) {
          setWallet(accounts[0]);
          await fetch("/api/connect-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: accounts[0] }),
          });
          return;
        }
      } catch (err) {
        console.error("MetaMask error:", err);
        alert("MetaMask connection failed. Check console for details.");
      }
    } else {
      alert("MetaMask is not installed. Please install it first.");
    }
  }

  // -----------------------
  // Save vault automatically linked to wallet
  // -----------------------
  async function saveVault(e) {
    e?.preventDefault?.();
    if (!wallet) {
      alert("Please connect your wallet first (top-right Connect).");
      return;
    }
    if (!vaultData || !vaultData.trim()) {
      alert("Enter something to save.");
      return;
    }

    try {
      const res = await fetch("/api/save-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, vaultData }),
      });
      const data = await res.json();
      if (data.success) {
        const newEntry = {
          _id: data.id,
          wallet,
          vaultData,
          createdAt: new Date().toISOString(),
        };
        setVaults((s) => [newEntry, ...s]);
        setVaultData("");
      } else {
        alert("Failed to save: " + (data.error || data.message || "unknown"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed, check console.");
    }
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <>
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      <main className="relative z-10 min-h-screen">
        {/* Enhanced Navbar */}
        <header className="bg-black/20 backdrop-blur-md fixed w-full top-0 z-30 border-b border-purple-500/20">
          <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 animate-fade-in">
            <div className="flex items-center gap-6">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-500 to-pink-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-neon-flicker hover:scale-105 transition-transform">
                🧠 Mind Vault
              </div>
              <ul className="hidden lg:flex gap-8 text-sm text-gray-200">
                <li><a href="#features" className="hover:text-purple-300 transition-all duration-300 hover:scale-110 relative group">Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                </a></li>
                <li><a href="#how" className="hover:text-purple-300 transition-all duration-300 hover:scale-110 relative group">How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                </a></li>
                <li><a href="#vault" className="hover:text-purple-300 transition-all duration-300 hover:scale-110 relative group">Vault
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                </a></li>
                <li><a href="#connect" className="hover:text-purple-300 transition-all duration-300 hover:scale-110 relative group">Connect
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                </a></li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={connectWallet}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-black px-6 py-2.5 rounded-full font-bold shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 animate-pulse-glow border border-emerald-300/50"
              >
                <span className="text-lg">🔗</span>
                {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
              </button>
              {wallet && (
                <button
                  onClick={() => { setWallet(""); setVaults([]); }}
                  className="text-sm text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                >
                  Disconnect
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-purple-300 hover:text-purple-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-black/95 backdrop-blur-md border-b border-purple-500/20">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <ul className="flex flex-col gap-4 text-sm text-gray-200">
                  <li>
                    <a
                      href="#features"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 hover:text-purple-300 transition-all duration-300 border-b border-gray-700/50"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 hover:text-purple-300 transition-all duration-300 border-b border-gray-700/50"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#vault"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 hover:text-purple-300 transition-all duration-300 border-b border-gray-700/50"
                    >
                      Vault
                    </a>
                  </li>
                  <li>
                    <a
                      href="#connect"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 hover:text-purple-300 transition-all duration-300"
                    >
                      Connect
                    </a>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => {
                      connectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 animate-pulse-glow border border-emerald-300/50"
                  >
                    <span className="text-lg">🔗</span>
                    {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
                  </button>
                  {wallet && (
                    <button
                      onClick={() => {
                        setWallet("");
                        setVaults([]);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-3 text-sm text-gray-400 hover:text-red-400 transition-all duration-300 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Enhanced Hero */}
        <section
          id="hero"
          ref={heroRef}
          className={`pt-32 pb-20 transition-opacity duration-1000 ${heroInView ? "animate-slide-up" : "opacity-0"} relative overflow-hidden`}
        >
          {/* Floating background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-bounce-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold text-purple-300 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 animate-pulse-glow">
                🚀 Powered by AI & Web3
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-neon-flicker">
              Create Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-purple-600 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse-glow">
                AI Twin
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Mind Vault is a <span className="text-purple-400 font-semibold">decentralized</span>, AI-powered vault that stores your memories, ideas, and knowledge.
              <br className="hidden md:block" />
              Mint a <span className="text-pink-400 font-semibold">soulbound identity</span> and keep your digital self forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a
                href="#vault"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-500 hover:via-purple-600 hover:to-pink-500 rounded-2xl shadow-2xl hover:shadow-purple-500/50 text-white font-bold text-lg transition-all duration-300 hover:scale-105 animate-pulse-glow border border-purple-400/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  Open Your Vault
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </a>

              <button
                onClick={connectWallet}
                className="group relative px-8 py-4 bg-transparent border-2 border-emerald-400 hover:border-emerald-300 rounded-2xl text-emerald-300 hover:text-emerald-200 font-bold text-lg transition-all duration-300 hover:scale-105 animate-bounce-slow overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">🔗</span>
                  Connect Wallet
                  <span className="text-sm opacity-70">MetaMask</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: "∞", label: "Memories Stored", color: "from-purple-400 to-pink-400" },
                { number: "100%", label: "Decentralized", color: "from-emerald-400 to-green-400" },
                { number: "AI", label: "Powered Learning", color: "from-blue-400 to-purple-400" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-2 animate-pulse-glow`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features */}
        <section
          id="features"
          ref={featuresRef}
          className={`py-20 transition-opacity duration-1000 ${featuresInView ? "animate-slide-up" : "opacity-0"} relative`}
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-pink-900/5 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-neon-flicker">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Mind Vault</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
                Experience the future of personal data management with cutting-edge AI and blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: "🔒",
                  title: "Military-Grade Security",
                  desc: "AES-256 encrypted vault entries with optional on-chain proofs and zero-knowledge verification.",
                  gradient: "from-emerald-500 to-green-600",
                  glow: "shadow-emerald-500/25"
                },
                {
                  icon: "🧠",
                  title: "Evolving AI Twin",
                  desc: "Your AI learns from your inputs, mirrors your writing style, and becomes your perfect digital companion.",
                  gradient: "from-purple-500 to-pink-600",
                  glow: "shadow-purple-500/25"
                },
                {
                  icon: "🎭",
                  title: "Soulbound Identity",
                  desc: "Mint a non-transferable NFT that permanently binds your vault to your digital identity forever.",
                  gradient: "from-blue-500 to-purple-600",
                  glow: "shadow-blue-500/25"
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-pulse-glow overflow-hidden`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>

                  {/* Icon with glow */}
                  <div className="relative z-10 mb-6">
                    <div className={`text-6xl mb-4 animate-bounce-slow drop-shadow-2xl`}>
                      {feature.icon}
                    </div>
                    <div className={`w-16 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed relative z-10 group-hover:text-gray-200 transition-colors duration-300">
                    {feature.desc}
                  </p>

                  {/* Hover glow border */}
                  <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-400/50 transition-all duration-500`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how"
          ref={howRef}
          className={`py-12 bg-gradient-to-b from-transparent to-gray-900/20 transition-opacity duration-1000 ${howInView ? "animate-fade-in" : "opacity-0"}`}
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4 animate-neon-flicker">How It Works</h2>
            <ol className="text-gray-300 space-y-3">
              <li className="animate-fade-in">1. Connect your MetaMask wallet.</li>
              <li className="animate-fade-in" style={{ animationDelay: "100ms" }}>2. Save private memories to your encrypted vault.</li>
              <li className="animate-fade-in" style={{ animationDelay: "200ms" }}>3. Let the AI learn and evolve.</li>
            </ol>
          </div>
        </section>

        {/* Enhanced Vault */}
        <section
          id="vault"
          ref={vaultRef}
          className={`py-20 transition-opacity duration-1000 ${vaultInView ? "animate-slide-up" : "opacity-0"} relative`}
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-purple-900/20 pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-neon-flicker">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Digital Vault</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
                Store your memories, thoughts, and knowledge in a secure, AI-powered vault that evolves with you
              </p>
            </div>

            {/* Vault Form */}
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md p-8 rounded-3xl border border-purple-500/20 shadow-2xl animate-pulse-glow mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Secure Entry Form</h3>
                  <p className="text-gray-300">Your thoughts are encrypted and AI-powered</p>
                </div>
              </div>

              <form onSubmit={saveVault} className="space-y-6">
                <div className="relative">
                  <textarea
                    value={vaultData}
                    onChange={(e) => setVaultData(e.target.value)}
                    placeholder={wallet ? "✨ Share your thoughts, memories, or ideas with your AI twin..." : "🔗 Connect your wallet first to access your vault"}
                    className="w-full min-h-[160px] p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 resize-none backdrop-blur-sm text-lg leading-relaxed"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={!wallet || !vaultData.trim()}
                      className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-500 hover:via-purple-600 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-white shadow-2xl hover:shadow-purple-500/50 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:hover:scale-100 animate-pulse-glow disabled:animate-none overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-lg">💾</span>
                        Save to Vault
                        <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>

                    <button
                      type="button"
                      onClick={() => wallet && window.location.reload()}
                      disabled={!wallet}
                      className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-white shadow-2xl hover:shadow-blue-500/50 disabled:shadow-none transition-all duration-300 hover:scale-105 disabled:hover:scale-100 animate-pulse-glow disabled:animate-none overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-lg">🔄</span>
                        Refresh Entries
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-600/50">
                    <div className={`w-3 h-3 rounded-full ${wallet ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-sm text-gray-300">
                      {wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Wallet not connected"}
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Vault Entries */}
            <div className="space-y-6">
              {vaults.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 animate-bounce-slow">📭</div>
                  <p className="text-xl text-gray-400 animate-fade-in">Your vault is empty</p>
                  <p className="text-gray-500 mt-2">Start by sharing your first memory above</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">🗂️</span>
                      Your Memories ({vaults.length})
                    </h3>
                    <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600/50">
                      Latest first
                    </div>
                  </div>

                  {vaults.map((v, index) => (
                    <div
                      key={v._id}
                      className={`group relative p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 rounded-2xl shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] animate-slide-up overflow-hidden`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <p className="text-gray-100 leading-relaxed text-lg mb-4 whitespace-pre-wrap">{v.vaultData}</p>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-700/50">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                              <span className="text-purple-400">📅</span>
                              {formatDate(v.createdAt)}
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="text-emerald-400">🔗</span>
                              {v.wallet ? `${v.wallet.slice(0, 6)}...${v.wallet.slice(-4)}` : "Unknown"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                              Entry #{vaults.length - index}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-400/30 transition-all duration-500"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section
          id="connect"
          ref={connectRef}
          className={`py-12 transition-opacity duration-1000 ${connectInView ? "animate-slide-up" : "opacity-0"}`}
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-4 animate-neon-flicker">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-6 animate-fade-in">Authenticate to mint your Soulbound NFT and unlock your AI Vault.</p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-black rounded-full font-semibold shadow-lg animate-pulse-glow"
            >
              {wallet ? `Connected: ${wallet.slice(0,6)}...` : "Connect MetaMask"}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-400 animate-fade-in">
          <div className="max-w-6xl mx-auto px-6">
            © {new Date().getFullYear()} Mind Vault | Built with ❤️ by Maraah
          </div>
        </footer>
      </main>
    </>
  );
}
