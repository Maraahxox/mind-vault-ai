import "dotenv/config";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function uploadToIPFS() {
  try {
    // Validate environment variables
    const pinataJwt = process.env.PINATA_JWT;
    const pinataGateway = process.env.PINATA_GATEWAY;

    if (!pinataJwt || !pinataGateway) {
      throw new Error("Missing PINATA_JWT or PINATA_GATEWAY in .env file");
    }

    console.log("🚀 Initializing Pinata API...");
    const config = {
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
    };

    // Step 1: Upload image
    console.log("\n📤 Uploading base image to IPFS...");
    const imagePath = path.join(__dirname, "../assets/mindvault-nft.png");

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at ${imagePath}`);
    }

    const imageStream = fs.createReadStream(imagePath);
    const imageFormData = new FormData();
    imageFormData.append("file", imageStream);

    const imageResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      imageFormData,
      {
        ...config,
        headers: {
          ...config.headers,
          ...imageFormData.getHeaders(),
        },
      }
    );

    const imageCID = imageResponse.data.IpfsHash;
    const imageURL = `${pinataGateway}/ipfs/${imageCID}`;

    console.log(`✅ Image uploaded successfully!`);
    console.log(`   CID: ${imageCID}`);
    console.log(`   URL: ${imageURL}`);

    // Step 2: Create and upload metadata
    console.log("\n📝 Creating base metadata JSON...");
    const baseMetadata = {
      name: "MindVault Soulbound",
      description: "Your eternal AI identity stored inside MindVault.",
      image: imageURL,
      external_url: "https://mind-vault-tan.vercel.app",
      attributes: [
        { trait_type: "AI Level", value: "Dynamic" },
        { trait_type: "Memory Capacity", value: "Dynamic" },
        { trait_type: "Soulbound", value: "True" },
      ],
    };

    console.log("📤 Uploading metadata to IPFS...");
    const metadataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      baseMetadata,
      config
    );

    const metadataCID = metadataResponse.data.IpfsHash;
    const metadataURL = `${pinataGateway}/ipfs/${metadataCID}`;

    console.log(`✅ Metadata uploaded successfully!`);
    console.log(`   CID: ${metadataCID}`);
    console.log(`   URL: ${metadataURL}`);

    // Step 3: Output summary
    console.log("\n" + "=".repeat(70));
    console.log("✨ IPFS Upload Summary");
    console.log("=".repeat(70));
    console.log(`Image CID:    ${imageCID}`);
    console.log(`Metadata CID: ${metadataCID}`);
    console.log("\n📋 Update your .env file with:");
    console.log(`IPFS_IMAGE_CID=${imageCID}`);
    console.log(`IPFS_METADATA_CID=${metadataCID}`);
    console.log("\n🔗 Full Metadata URI:");
    console.log(metadataURL);
    console.log("=".repeat(70));

    return {
      imageCID,
      metadataCID,
      imageURL,
      metadataURL,
    };
  } catch (error) {
    console.error("❌ Error uploading to IPFS:", error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the upload
uploadToIPFS();
