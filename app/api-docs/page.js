"use client";

import { useState } from "react";

export default function APIDocs() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, language = "bash", id }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
      <pre className="text-sm text-gray-100 font-mono">{code}</pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition"
      >
        {copied === id ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );

  const EndpointCard = ({ method, path, title, description, requestExample, responseExample, curlExample, jsExample }) => (
    <div className="bg-gray-800 border border-purple-500 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <span className={`px-3 py-1 rounded font-bold text-sm ${
          method === "POST" ? "bg-blue-600" : "bg-green-600"
        }`}>
          {method}
        </span>
        <code className="text-gray-300 font-mono">{path}</code>
      </div>

      <h3 className="text-xl font-bold text-purple-400 mb-2">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Request</h4>
          <CodeBlock code={requestExample} id={`req-${method}-${path}`} />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Response</h4>
          <CodeBlock code={responseExample} id={`res-${method}-${path}`} />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-300 mb-2">cURL Example</h4>
          <CodeBlock code={curlExample} id={`curl-${method}-${path}`} />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-300 mb-2">JavaScript Example</h4>
          <CodeBlock code={jsExample} language="javascript" id={`js-${method}-${path}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">🧠 Mind Vault API</h1>
          <p className="text-gray-400 text-lg">Build with AI identity and semantic memory</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Overview</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              The Mind Vault API enables decentralized AI identity, semantic memory retrieval, and soulbound credentials on Ethereum.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-purple-400 font-semibold mb-2">Base URL</p>
                <code className="text-gray-300">https://mind-vault-tan.vercel.app/api</code>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-purple-400 font-semibold mb-2">Response Format</p>
                <code className="text-gray-300">application/json</code>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Authentication</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300 mb-4">Authentication via Ethereum wallet (MetaMask):</p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Connect wallet via MetaMask</li>
              <li>Include wallet address in request body</li>
              <li>Server validates and normalizes address</li>
              <li>Proceed with authenticated request</li>
            </ol>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">Endpoints</h2>

          <EndpointCard
            method="POST"
            path="/connect-wallet"
            title="Connect Wallet"
            description="Initialize a wallet in the system and enable vault operations."
            requestExample={`{
  "wallet": "0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D"
}`}
            responseExample={`{
  "success": true,
  "message": "Wallet connected successfully",
  "wallet": "0x742d35cc6634c0532925a3b844bc0e5f5e48ff6d",
  "upserted": true
}`}
            curlExample={`curl -X POST https://mind-vault-tan.vercel.app/api/connect-wallet \\
  -H "Content-Type: application/json" \\
  -d '{"wallet": "0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D"}'`}
            jsExample={`const response = await fetch('/api/connect-wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: '0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D'
  })
});`}
          />

          <EndpointCard
            method="POST"
            path="/save-vault"
            title="Save Memory"
            description="Save an encrypted memory with semantic embeddings for AI retrieval."
            requestExample={`{
  "wallet": "0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D",
  "vaultData": "Building AI systems that respect user autonomy"
}`}
            responseExample={`{
  "success": true,
  "message": "Vault data saved successfully",
  "id": "665f1234567890abcdef1234",
  "embeddingStored": true
}`}
            curlExample={`curl -X POST https://mind-vault-tan.vercel.app/api/save-vault \\
  -H "Content-Type: application/json" \\
  -d '{"wallet": "0x...", "vaultData": "..."}'`}
            jsExample={`const response = await fetch('/api/save-vault', {
  method: 'POST',
  body: JSON.stringify({
    wallet: '0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D',
    vaultData: 'My important memory'
  })
});`}
          />

          <EndpointCard
            method="GET"
            path="/get-vault?wallet=0x..."
            title="Get Memories"
            description="Retrieve all vault entries for a wallet (up to 50), sorted by recency."
            requestExample={`GET /get-vault?wallet=0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D`}
            responseExample={`{
  "success": true,
  "count": 5,
  "vault": [
    {
      "_id": "665f1234567890abcdef1234",
      "vaultData": "Decrypted memory content",
      "createdAt": "2026-04-29T10:30:00.000Z"
    }
  ]
}`}
            curlExample={`curl -X GET "https://mind-vault-tan.vercel.app/api/get-vault?wallet=0x..."`}
            jsExample={`const response = await fetch('/api/get-vault?wallet=0x...');
const data = await response.json();
data.vault.forEach(entry => console.log(entry.vaultData));`}
          />

          <EndpointCard
            method="POST"
            path="/ai-twin"
            title="Query AI Twin"
            description="Get personalized AI response using semantic search over your memories (RAG)."
            requestExample={`{
  "wallet": "0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D",
  "message": "What excites me most about technology?"
}`}
            responseExample={`{
  "success": true,
  "response": "Based on my memories, I'm most excited about...",
  "entriesUsed": 5,
  "searchMethod": "vector_search"
}`}
            curlExample={`curl -X POST https://mind-vault-tan.vercel.app/api/ai-twin \\
  -d '{"wallet": "0x...", "message": "..."}'`}
            jsExample={`const response = await fetch('/api/ai-twin', {
  method: 'POST',
  body: JSON.stringify({
    wallet: '0x742d35Cc6634C0532925a3b844Bc0e5f5e48fF6D',
    message: 'What do I believe?'
  })
});`}
          />

          <EndpointCard
            method="GET"
            path="/metadata/[tokenId]"
            title="Get NFT Metadata"
            description="Retrieve dynamic metadata for a soulbound NFT with evolving AI attributes."
            requestExample={`GET /metadata/1`}
            responseExample={`{
  "name": "MindVault Soulbound #1",
  "image": "ipfs://...",
  "attributes": [
    { "trait_type": "AI Level", "value": 3 },
    { "trait_type": "Soulbound", "value": "True" }
  ]
}`}
            curlExample={`curl -X GET https://mind-vault-tan.vercel.app/api/metadata/1`}
            jsExample={`const response = await fetch('/api/metadata/1');
const metadata = await response.json();
console.log('AI Level:', metadata.attributes[0].value);`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Rate Limiting</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300">30 requests per minute per IP address. Responses include rate limit headers.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Status Codes</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-3">
            <div className="flex gap-4"><span className="text-green-400 font-mono">200</span><span className="text-gray-300">Success</span></div>
            <div className="flex gap-4"><span className="text-yellow-400 font-mono">400</span><span className="text-gray-300">Bad Request</span></div>
            <div className="flex gap-4"><span className="text-yellow-400 font-mono">404</span><span className="text-gray-300">Not Found</span></div>
            <div className="flex gap-4"><span className="text-red-400 font-mono">429</span><span className="text-gray-300">Rate Limited</span></div>
            <div className="flex gap-4"><span className="text-red-400 font-mono">500</span><span className="text-gray-300">Server Error</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
