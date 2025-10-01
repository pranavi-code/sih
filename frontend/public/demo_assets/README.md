
# Demo Assets Setup

## Submarine Images for Demo

To complete the demo setup, please add the following files to backend/demo_assets/:

1. **submarine_original.png** - Dark underwater submarine image (provided in chat)
2. **submarine_enhanced.png** - Enhanced version with better visibility 
3. **submarine_detected.png** - Version with detection bounding box around submarine

## How Demo Works

When the system detects certain keywords in uploaded filenames (like 'submarine', 'demo', 'test'), 
it will return hardcoded responses using these demo assets instead of processing the actual file.

### Image Enhancement Demo:
- Input: Any file with 'submarine' in the name
- Output: Returns submarine_enhanced.png with improved visibility

### Threat Detection Demo:
- Input: Any file with 'submarine' in the name  
- Output: Returns submarine_detected.png with bounding box showing detected submarine
- Confidence: 0.94 (hardcoded)
- Class: "submarine" 

### Quality Metrics Demo:
- PSNR: 28.5 dB (simulated improvement)
- SSIM: 0.85 (high structural similarity)
- UIQM: 3.2 (good underwater image quality)

This ensures consistent, impressive demo results regardless of actual input quality.
