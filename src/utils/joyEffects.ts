import confetti from 'canvas-confetti';

class JoyAudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shoppilot_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppilot_sound_enabled', String(enabled));
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.soundEnabled);
    return this.soundEnabled;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play soft celebratory chime chord (gentle pentatonic arpeggio)
  public playCelebrationChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 major chord
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        // Soft, warm, non-jarring envelope
        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.07, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch {
      // Audio autoplay policy or muted
    }
  }

  // Play a soft playful pop on rating or button click
  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.07);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio autoplay policy
    }
  }

  // Soft sparkle tone when discount is highlighted
  public playSparkle() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, now); // D6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.1); // G6

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Audio autoplay policy
    }
  }
}

export const joyAudio = new JoyAudioService();

// Confetti bursts for plan completion and savings milestones
export function fireCelebrationConfetti() {
  try {
    // Primary center burst
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6']
    });

    // Left cannon follow-up
    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0.12, y: 0.7 },
        colors: ['#34d399', '#fbbf24', '#f472b6', '#38bdf8']
      });
    }, 150);

    // Right cannon follow-up
    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 0.88, y: 0.7 },
        colors: ['#818cf8', '#f59e0b', '#a78bfa', '#10b981']
      });
    }, 280);
  } catch {
    // Canvas context fallback
  }
}

export function fireMiniSparkleConfetti(x = 0.5, y = 0.5) {
  try {
    confetti({
      particleCount: 25,
      spread: 45,
      startVelocity: 18,
      origin: { x, y },
      colors: ['#10b981', '#f59e0b', '#3b82f6'],
      ticks: 80
    });
  } catch {
    // Fallback
  }
}
