# 🎨 POWER SCANNER PRO
## Design System & Visual Guidelines

### 🌈 Color System

#### Primary Power Palettes
```
NORMAL POWER (0-1,000)
Primary: #4A90E2 (Bright Blue)
Secondary: #87CEEB (Sky Blue)
Accent: #B2EBF2 (Light Blue)
Glow: rgba(74, 144, 226, 0.6)

ENHANCED POWER (1,000-5,000)
Primary: #2ECC71 (Emerald)
Secondary: #A5D6A7 (Sage)
Accent: #C8E6C9 (Mint)
Glow: rgba(46, 204, 113, 0.6)

SUPER POWER (5,000-10,000)
Primary: #F1C40F (Golden)
Secondary: #FFE082 (Light Gold)
Accent: #FFF3E0 (Cream)
Glow: rgba(241, 196, 15, 0.8)

ULTRA POWER (10,000-50,000)
Primary: #9B59B6 (Royal Purple)
Secondary: #CE93D8 (Lavender)
Accent: #E1BEE7 (Light Purple)
Glow: rgba(155, 89, 182, 0.7)

LEGENDARY POWER (50,000+)
Primary: #FF4081 (Hot Pink)
Secondary: #FF80AB (Light Pink)
Accent: #FF94C2 (Soft Pink)
Glow: rgba(255, 64, 129, 0.8)
```

#### Interface Colors
```
Background: #1A1A2E (Deep Space)
Surface: #232344 (Night Blue)
Card: #2A2A4A (Twilight)
Border: #3D3D6B (Cosmic)

Text-Primary: #FFFFFF (White)
Text-Secondary: #B8B8D1 (Lavender Gray)
Text-Disabled: #6B6B8E (Muted Purple)
```

#### Status Colors
```
Success: #00E676 (Electric Green)
Warning: #FFD600 (Bright Yellow)
Error: #FF1744 (Plasma Red)
Info: #00B0FF (Crystal Blue)
```

### 📱 Typography

#### Font Hierarchy
```
Headings: "Power Font" (Custom)
- H1: 32px/40px
- H2: 24px/32px
- H3: 20px/28px
- H4: 18px/24px

Body: "Cosmic Sans" (Custom)
- Large: 16px/24px
- Regular: 14px/20px
- Small: 12px/16px

Power Levels: "Energy Display" (Custom)
- Huge: 48px/56px
- Large: 36px/44px
- Regular: 24px/32px
```

### 🎭 Icon System

#### Power Level Icons
```
Normal: <Simple Energy Orb>
Enhanced: <Pulsing Crystal>
Super: <Golden Aura>
Ultra: <Cosmic Sphere>
Legendary: <Divine Crown>
```

#### Action Icons
```
Scan: <Energy Radar>
Analyze: <Power Lens>
Share: <Energy Burst>
Profile: <Power Avatar>
Settings: <Control Matrix>
```

### 🌟 Effects & Animations

#### Scanning Effects
```css
/* Power Build-up */
@keyframes powerBuildUp {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Energy Waves */
@keyframes energyWave {
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

/* Power Surge */
@keyframes powerSurge {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
  100% { filter: brightness(1); }
}
```

#### Transition Effects
```css
/* Power Level Changes */
.power-change {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Element Transformations */
.element-transform {
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 🎨 Component Library

#### Power Cards
```
STRUCTURE:
- Power Level (Large Display)
- Element Icon
- Stats Bar
- Glow Effect
- Share Button
```

#### Power Meters
```
VARIANTS:
- Linear (Horizontal)
- Circular (Radial)
- Burst (Explosive)
- Wave (Flowing)
```

#### Action Buttons
```
STATES:
- Default: Solid fill
- Hover: Glow effect
- Active: Pulse animation
- Disabled: Reduced opacity
```

#### Progress Indicators
```
TYPES:
- Power Loading: Energy spiral
- Analysis: Scanning waves
- Processing: Data flow
- Complete: Power burst
```

### 📱 Layout Guidelines

#### Spacing System
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

#### Grid System
```
Columns: 12
Gutters: 16px
Margins: 24px
Breakpoints:
- Mobile: 0-599px
- Tablet: 600-1023px
- Desktop: 1024px+
```

### 🎮 Interactive Elements

#### Gesture Animations
```
Tap: Power ripple
Hold: Energy charge
Swipe: Element trail
Pinch: Power focus
```

#### Feedback Effects
```
Success: Rising particles
Error: Energy dispersion
Warning: Pulsing glow
Loading: Energy rotation
```

### 🎨 Visual Hierarchy

#### Scanning Phases
1. Initialization
   - Subtle grid pattern
   - Soft ambient glow
   - Quiet energy hum

2. Analysis
   - Active scan lines
   - Data particle effects
   - Rising power indicators

3. Results
   - Power level burst
   - Element manifestation
   - Stats formation

### 📱 Screen States

#### Loading States
```
MINIMAL:
- Simple power pulse
- Subtle background wave
- Basic progress indicator

DETAILED:
- Particle system
- Energy field
- Data flow effects
```

#### Empty States
```
COMPONENTS:
- Friendly mascot
- Encouraging message
- Clear CTA button
- Subtle background animation
```

#### Error States
```
ELEMENTS:
- Energy disruption
- Power fluctuation
- Recovery suggestion
- Retry animation
```

### 🎮 Interaction Patterns

#### Touch Feedback
```
PRIMARY:
- Instant glow
- Power ripple
- Haptic pulse

SECONDARY:
- Subtle highlight
- Soft fade
- Quiet click
```

#### Gestures
```
SCAN:
- Hold to charge
- Release to analyze
- Swipe to compare
- Pinch to focus

SHARE:
- Swipe up to post
- Hold to preview
- Tap to quick share
```

