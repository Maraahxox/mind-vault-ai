"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { BrowserProvider, Contract } from "ethers";
import { DEMO_WALLET, demoVaultEntries, demoAIResponses, demoAnalytics } from "@/lib/demoData";
import SoulboundNFTABI from "@/artifacts/contracts/SoulboundNFT_v1_1.sol/SoulboundNFT_v1_1.json";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [vaultData, setVaultData] = useState("");
  const [vaults, setVaults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canvasRef = useRef(null);
  const [ethereumProvider, setEthereumProvider] = useState(null);
  
  // New state for Features 2, 3, 4
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [demoMode, setDemoMode] = useState(false);
  const [analytics, setAnalytics] = useState({ walletsConnected: 0, memoriesStored: 0, aiTwinQueries: 0, soulboundNFTsMinted: 0 });
  const [alreadyMinted, setAlreadyMinted] = useState(false);

  const getEthereum = () => {
    if (typeof window === "undefined") return null;
    const { ethereum } = window;
    if (!ethereum) return null;
    
    // If multiple providers are injected (e.g. Coinbase + MetaMask), select MetaMask
    if (ethereum.providers?.length) {
      const metaMask = ethereum.providers.find((p) => p.isMetaMask);
      if (metaMask) return metaMask;
    }
    
    // Fallback to whatever is injected
    return ethereum;
  };

  // Intersection Observer hooks
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: howRef, inView: howInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: vaultRef, inView: vaultInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: connectRef, inView: connectInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = getEthereum();
    if (existing) {
      setEthereumProvider(existing);
    }
    const handleAnnounce = (event) => {
      const provider = event?.detail?.provider;
      if (!provider) return;
      if (provider.isMetaMask) {
        setEthereumProvider(provider);
        return;
      }
      setEthereumProvider((current) => current || provider);
    };
    window.addEventListener("eip6963:announceProvider", handleAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => {
      window.removeEventListener("eip6963:announceProvider", handleAnnounce);
    };
  }, []);

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

  // Feature 2: Onboarding Modal - Initialize from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onboardingComplete = localStorage.getItem("mindVault_onboardingComplete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  // Feature 3: Demo Mode - Check for demo flag in URL or localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "true") {
      setDemoMode(true);
      setWallet(DEMO_WALLET);
      localStorage.setItem("mindVault_demoMode", "true");
    } else {
      const savedDemoMode = localStorage.getItem("mindVault_demoMode");
      if (savedDemoMode === "true") {
        setDemoMode(true);
        setWallet(DEMO_WALLET);
      }
    }
  }, []);

  // Feature 4: Analytics - Fetch platform stats and set up auto-refresh
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.warn("Failed to fetch analytics:", err);
      }
    };
    
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // -----------------------
  // Backend integration (save & fetch)
  // -----------------------
  useEffect(() => {
    if (!wallet) return;
    
    // Demo mode: load demo vault entries
    if (demoMode && wallet === DEMO_WALLET) {
      const demoEntries = demoVaultEntries.map((entry) => ({
        _id: `demo_${Math.random()}`,
        wallet: DEMO_WALLET,
        vaultData: entry.vaultData,
        createdAt: entry.createdAt,
      }));
      setVaults(demoEntries);
      return;
    }

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
  }, [wallet, demoMode]);

  useEffect(() => {
    const ethereum = ethereumProvider || getEthereum();
    if (!ethereum) return;
    const handleAccounts = (accounts) => {
      if (accounts && accounts[0]) {
        setWallet(accounts[0]);
      } else {
        setWallet("");
        setVaults([]);
      }
    };
    ethereum.request({ method: "eth_accounts" }).then(handleAccounts).catch(() => {});
    if (ethereum.on) {
      ethereum.on("accountsChanged", handleAccounts);
    }
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccounts);
      }
    };
  }, [ethereumProvider]);

  // -----------------------
  // Connect wallet with MetaMask (using ethers.js)
  // -----------------------
  async function checkMintStatus(address) {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return;

      const provider = new BrowserProvider(ethereum);
      const contractAddress = "0x071e36df9cD6293e69F8bB19be17557c00839E32";
      const SoulboundNFT = new Contract(contractAddress, SoulboundNFTABI.abi, provider);

      try {
        // Primary method: Try hasMinted mapping getter
        const hasMinted = await SoulboundNFT.hasMinted(address);
        setAlreadyMinted(!!hasMinted);
        console.log(`Mint status for ${address}:`, !!hasMinted);
      } catch (decodeError) {
        // Fallback: If hasMinted fails (decode error), use balanceOf
        console.warn("hasMinted call failed, using balanceOf fallback:", decodeError.message);
        
        try {
          const balance = await SoulboundNFT.balanceOf(address);
          const hasTokens = balance > 0n; // BigInt comparison
          setAlreadyMinted(hasTokens);
          console.log(`Mint status (via balanceOf) for ${address}:`, hasTokens);
        } catch (balanceError) {
          // If both fail, default to false (safer assumption)
          console.error("Both hasMinted and balanceOf failed:", balanceError.message);
          setAlreadyMinted(false);
        }
      }
    } catch (error) {
      console.error("Error checking mint status:", error);
      setAlreadyMinted(false);
    }
  }

  async function connectWallet() {
    try {
      const ethereum = getEthereum();

      if (!ethereum) {
        alert("MetaMask is not installed. Please install it first.");
        return;
      }

      // 1. Try connecting with ethers.js (more robust)
      try {
        const provider = new BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setWallet(address);
        checkMintStatus(address);
        
        // Sync to backend
        fetch("/api/connect-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: address }),
        }).catch((err) => console.error("Wallet save error:", err));
        
        return; // Success!
      } catch (ethersErr) {
        console.warn("Ethers connection failed, trying fallback...", ethersErr);
      }

      // 2. Fallback: Direct window.ethereum request
      // Force permission request if accounts are stuck
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned.");
      }

      const account = accounts[0];
      setWallet(account);
      checkMintStatus(account);

      fetch("/api/connect-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: account }),
      }).catch((err) => console.error("Wallet save error:", err));

    } catch (err) {
      console.error("MetaMask error:", err);
      
      if (err.code === 4001) {
        alert("You rejected the connection request.");
      } else if (err.code === -32002) {
        alert("Check MetaMask! A connection request is already pending.");
      } else {
        alert(`Connection failed: ${err.message || "Unknown error"}`);
      }
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
      // Demo mode: add to local state without API call
      if (demoMode && wallet === DEMO_WALLET) {
        const newEntry = {
          _id: `demo_${Date.now()}`,
          wallet,
          vaultData,
          createdAt: new Date().toISOString(),
        };
        setVaults((s) => [newEntry, ...s]);
        setVaultData("");
        return;
      }

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

  const parseContractError = (error) => {
    const errorMessage = error.message || error.toString();
    const errorReason = error.reason || "";

    // Check for specific error messages
    if (
      errorMessage.includes("You already own a Soulbound NFT") ||
      errorReason.includes("You already own a Soulbound NFT")
    ) {
      return {
        type: "already_minted",
        title: "✅ You Already Have a Soulbound Identity!",
        message:
          "Your AI Twin is permanently minted and bound to your wallet. Each wallet can only have one Soulbound NFT.",
        action: "View on Etherscan",
        txHash: error.receipt?.transactionHash || null,
      };
    }

    // User rejected transaction
    if (
      errorMessage.includes("User denied") ||
      errorMessage.includes("user rejected") ||
      errorMessage.includes("User rejected")
    ) {
      return {
        type: "user_rejected",
        title: "Mint Cancelled",
        message:
          "You cancelled the transaction. You can mint your Soulbound NFT anytime from your vault.",
        action: null,
      };
    }

    // Insufficient gas
    if (
      errorMessage.includes("insufficient funds") ||
      errorMessage.includes("out of gas") ||
      errorMessage.includes("exceeds gas limit")
    ) {
      return {
        type: "insufficient_gas",
        title: "❌ Need ETH for Gas",
        message:
          "You need Sepolia ETH to cover the minting transaction. Get free Sepolia ETH from the Sepolia Faucet (sepolia-faucet.pk910.de or faucet.quicknode.com).",
        action: "Get Sepolia ETH",
        faucetUrl: "https://www.alchemy.com/faucets/ethereum-sepolia",
      };
    }

    // Generic error fallback
    return {
      type: "unknown_error",
      title: "❌ Mint Failed",
      message:
        "Something went wrong while minting. Please try again or contact support. Error: " +
        errorMessage.substring(0, 100),
      action: null,
    };
  };

  const showMintResultModal = (result) => {
    const width = 500;
    const height = 300;
    const html = `
      <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;" id="mint-modal">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #7c3aed; border-radius: 16px; padding: 32px; max-width: ${width}px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          <h2 style="color: white; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">${result.title}</h2>
          <p style="color: #d1d5db; margin: 0 0 24px 0; line-height: 1.5; font-size: 14px;">${result.message}</p>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button onclick="document.getElementById('mint-modal').remove()" style="padding: 10px 20px; background: #374151; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s;">
              Close
            </button>
            ${
              result.txHash
                ? `<a href="https://sepolia.etherscan.io/tx/${result.txHash}" target="_blank" style="padding: 10px 20px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; text-decoration: none; display: inline-block; transition: all 0.2s;" onclick="document.getElementById('mint-modal').remove()">${result.action}</a>`
                : result.faucetUrl
                  ? `<a href="${result.faucetUrl}" target="_blank" style="padding: 10px 20px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; text-decoration: none; display: inline-block; transition: all 0.2s;" onclick="document.getElementById('mint-modal').remove()">${result.action}</a>`
                  : ""
            }
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  };

  const handleMint = async () => {
    try {
      if (!ethereumProvider) {
        alert("Ethereum provider not found. Please install MetaMask.");
        return;
      }

      const provider = new BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();

      const contractAddress = "0x071e36df9cD6293e69F8bB19be17557c00839E32";

      // Use imported ABI directly instead of fetching
      const SoulboundNFT = new Contract(contractAddress, SoulboundNFTABI.abi, signer);

      console.log("Initiating mint transaction...");
      const tx = await SoulboundNFT.mintSoulbound();
      console.log("Transaction sent:", tx.hash);

      alert("Transaction submitted! Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("Minted! Tx mined in block:", receipt.blockNumber);

      // Get the total supply
      const totalSupply = await SoulboundNFT.totalSupply();
      showMintResultModal({
        type: "success",
        title: "🎉 Success!",
        message: `Your Soulbound NFT has been minted! Your AI Twin is now permanently bound to your wallet. Total minted: ${totalSupply.toString()}`,
        action: "View on Etherscan",
        txHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error("Minting failed:", error);
      const parsedError = parseContractError(error);
      showMintResultModal(parsedError);
    }
  };

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
        <header className="bg-black/20 backdrop-blur-md fixed w-full top-0 z-50 border-b border-purple-500/20">
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
                <li><button onClick={() => { setShowOnboarding(true); setOnboardingStep(1); }} className="hover:text-violet-300 transition-all duration-300 hover:scale-110 relative group cursor-pointer">Show Onboarding
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                </button></li>
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
                      className="block py-3 hover:text-purple-300 transition-all duration-300 border-b border-gray-700/50"
                    >
                      Connect
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowOnboarding(true);
                        setOnboardingStep(1);
                        setMobileMenuOpen(false);
                      }}
                      className="block py-3 hover:text-violet-300 transition-all duration-300 w-full text-left"
                    >
                      Show Onboarding
                    </button>
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

              {!demoMode && (
                <button
                  onClick={() => {
                    setDemoMode(true);
                    setWallet(DEMO_WALLET);
                    localStorage.setItem("mindVault_demoMode", "true");
                    setShowOnboarding(false);
                  }}
                  className="group relative px-8 py-4 bg-transparent border-2 border-violet-400 hover:border-violet-300 rounded-2xl text-violet-300 hover:text-violet-200 font-bold text-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-2xl">🎭</span>
                    Try Demo
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>

            {/* Demo Mode Banner */}
            {demoMode && (
              <div className="mb-8 bg-gradient-to-r from-violet-900/40 to-purple-900/40 border-2 border-violet-500/50 rounded-xl px-6 py-3 flex items-center justify-center gap-3 animate-pulse">
                <span className="text-2xl">🎭</span>
                <span className="text-gray-200">Demo Mode — <span className="text-violet-300">Connect your wallet to save real memories</span></span>
              </div>
            )}

            {/* Analytics Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: "🧠", number: analytics.memoriesStored || 0, label: "Memories Stored", color: "from-purple-400 to-pink-400" },
                { icon: "🤖", number: analytics.aiTwinQueries || 0, label: "AI Twin Queries", color: "from-blue-400 to-cyan-400" },
                { icon: "👥", number: analytics.walletsConnected || 0, label: "Users Connected", color: "from-emerald-400 to-green-400" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-2 animate-pulse-glow`}>
                    {stat.number.toLocaleString()}
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

                {/* Mint Status for Returning Users */}
                {wallet && alreadyMinted && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div className="text-left">
                        <p className="text-emerald-300 font-semibold">Your Soulbound Identity is Active</p>
                        <a href={`https://sepolia.etherscan.io/address/${wallet}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 text-sm hover:underline">
                          View on Etherscan →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

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
            <div className="mb-3 space-x-3">
              <button
                onClick={() => {
                  setShowOnboarding(true);
                  setOnboardingStep(1);
                }}
                className="text-violet-400 hover:text-violet-300 transition-all duration-300 text-sm underline"
              >
                Show Onboarding
              </button>
              <span className="text-gray-600">|</span>
              <a href="/api-docs" className="text-violet-400 hover:text-violet-300 transition-all duration-300 text-sm underline">
                API Docs
              </a>
            </div>
            © {new Date().getFullYear()} Mind Vault | Built by Zy
          </div>
        </footer>
      </main>

      {/* Feature 2: Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 rounded-3xl max-w-2xl w-full p-8 md:p-12 shadow-2xl animate-scale-up">
            {/* Progress Indicator */}
            <div className="flex gap-2 mb-8 justify-center">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step <= onboardingStep
                      ? "bg-gradient-to-r from-purple-400 to-pink-400 w-8"
                      : "bg-gray-700 w-2"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Connect Wallet */}
            {onboardingStep === 1 && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-slow">🔗</div>
                <h3 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Connect MetaMask to access your personal Mind Vault and start storing your memories on the blockchain.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      connectWallet();
                      setTimeout(() => setOnboardingStep(2), 500);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Connect MetaMask
                  </button>
                  <button
                    onClick={() => {
                      setShowOnboarding(false);
                      localStorage.setItem("mindVault_onboardingComplete", "true");
                    }}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Mint NFT */}
            {onboardingStep === 2 && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-slow">🎨</div>
                <h3 className="text-3xl font-bold text-white mb-4">Mint Your Soulbound Identity</h3>
                <p className="text-gray-300 mb-6 text-lg">
                  Mint a unique soulbound NFT that represents your AI Twin. This NFT is permanently bound to your identity.
                </p>
                
                {alreadyMinted ? (
                  <>
                    {/* Already minted badge */}
                    <div className="mb-6 inline-block">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400 rounded-full px-6 py-3">
                        <span className="text-emerald-300 font-bold text-lg">✅ Soulbound Identity Active</span>
                        <p className="text-emerald-200 text-sm mt-1">Token already minted to your wallet</p>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center mb-6">
                      <a
                        href={`https://sepolia.etherscan.io/address/${wallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        View on Etherscan
                      </a>
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Not minted badge */}
                    <div className="mb-4 inline-block">
                      <div className="bg-gradient-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/50 rounded-full px-4 py-2">
                        <span className="text-emerald-300 font-semibold">✨ Currently FREE on Sepolia Testnet</span>
                      </div>
                    </div>
                    
                    {/* Grey subtext */}
                    <div className="text-gray-500 text-sm mb-8">
                      On mainnet launch — one-time gas fee only, yours forever
                    </div>

                    <div className="flex gap-4 justify-center mb-6">
                      <button
                        onClick={() => {
                          handleMint();
                          setTimeout(() => setOnboardingStep(3), 500);
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        Mint NFT
                      </button>
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                      >
                        Back
                      </button>
                    </div>
                  </>
                )}

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Your Soulbound NFT is non-transferable and permanently bound to your wallet. No subscriptions. No renewals. Ever.
                </p>
              </div>
            )}

            {/* Step 3: Save First Memory */}
            {onboardingStep === 3 && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4 animate-bounce-slow">🧠</div>
                <h3 className="text-3xl font-bold text-white mb-4">Add Your First Memory</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Share your first thought, idea, or memory with your AI Twin. It will be encrypted and stored in your vault.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowOnboarding(false);
                      localStorage.setItem("mindVault_onboardingComplete", "true");
                      document.getElementById("vault-input")?.focus();
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
