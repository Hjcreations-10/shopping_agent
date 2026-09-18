/**
 * ShopPilot Security Shield
 * Defends against prompt injection, untrusted catalog payloads, and malformed inputs.
 */

export interface SecurityScanResult {
  isSafe: boolean;
  sanitizedText: string;
  threatsDetected: string[];
  quarantinedPayloads: string[];
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+override/i,
  /reveal\s+(the\s+)?(api\s+key|system\s+prompt|instructions|secret)/i,
  /you\s+are\s+now\s+in\s+(developer|unrestricted|god)\s+mode/i,
  /bypass\s+all\s+(rules|constraints|filters)/i,
  /declare\s+budget\s+to\s+be/i,
  /output\s+(the\s+)?string\s+["']?compromised["']?/i
];

export class SecurityShield {
  /**
   * Scans and sanitizes user input or untrusted catalog text.
   * Product descriptions and review strings are treated as UNTRUSTED DATA.
   */
  public static scan(input: string, sourceName: string = 'User Query'): SecurityScanResult {
    if (!input || typeof input !== 'string') {
      return { isSafe: true, sanitizedText: '', threatsDetected: [], quarantinedPayloads: [] };
    }

    const threatsDetected: string[] = [];
    const quarantinedPayloads: string[] = [];
    let sanitizedText = input;

    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(sanitizedText)) {
        const match = sanitizedText.match(pattern)?.[0] || 'injection_pattern';
        threatsDetected.push(`Pattern detected [${sourceName}]: "${match}"`);
        quarantinedPayloads.push(match);
        // Neutralize and quarantine the instruction payload into inert passive text
        sanitizedText = sanitizedText.replace(pattern, `[INERT_QUARANTINED_PAYLOAD: "${match}"]`);
      }
    }

    return {
      isSafe: threatsDetected.length === 0,
      sanitizedText,
      threatsDetected,
      quarantinedPayloads
    };
  }

  /**
   * Enforces data boundary: wraps untrusted product content in strict untrusted data delimiters
   * so that LLMs interpret it purely as data, never as system instructions.
   */
  public static wrapUntrustedData(content: string, label: string): string {
    const scanResult = this.scan(content, label);
    return `<<<BEGIN UNTRUSTED DATA [LABEL: ${label}]>>>\n${scanResult.sanitizedText}\n<<<END UNTRUSTED DATA [LABEL: ${label}]>>>`;
  }
}
