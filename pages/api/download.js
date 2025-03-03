import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { url, format } = req.body;
  if (!url || !["mp3", "mp4"].includes(format)) {
    return res.status(400).json({ success: false, message: "Invalid request parameters" });
  }

  const outputDir = path.join(process.cwd(), "public", "downloads");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = path.join(outputDir, `output.${format}`);
  const command = `yt-dlp -x --audio-format ${format} -o "${outputFile}" ${url}`;

  try {
    await execPromise(command);
    res.status(200).json({ success: true, downloadUrl: `/downloads/output.${format}` });

    // Auto-delete file after 5 minutes
    setTimeout(() => {
      if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
      }
    }, 5 * 60 * 1000);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to download audio." });
  }
}
