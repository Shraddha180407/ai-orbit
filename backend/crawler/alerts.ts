import { logger } from "./logger.js";

/**
 * Posts a message to a Slack incoming webhook, if SLACK_WEBHOOK_URL is set.
 * No-ops silently if it's not configured — this is optional operational
 * polish, not a hard dependency.
 */
async function postToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    // Don't let a Slack failure fail the ingest run itself.
    logger.error("[alerts] failed to post to Slack:", err);
  }
}

export async function notifyIngestFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  await postToSlack(`🔴 *AI video ingest failed*\n\`\`\`${message}\`\`\``);
}

export async function notifyIngestSuspicious(result: { discovered: number; new: number; total: number }) {
  // "Discovered 0" on every query usually means quota exhaustion or a
  // revoked/misconfigured API key, not "genuinely no new AI videos today."
  // Worth a heads-up rather than failing silently for days.
  if (result.discovered === 0) {
    await postToSlack(
      `🟡 *AI video ingest: 0 videos discovered*\nLikely YouTube quota exhausted or an API key issue. Total stored: ${result.total}.`
    );
  }
}