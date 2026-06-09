import React, { useRef, useState, useEffect } from 'react'
import { t } from '../utils/i18n'

type WhiteboardPageProps = {
  uiLanguage: 'ko' | 'en' | 'ja'
  themeColor?: string
  isActive?: boolean
}

type ColorPreset = {
  name: string
  value: string
}

type ToolType = 'pen' | 'eraser'
type ThicknessLevel = 'thin' | 'medium' | 'thick'

type Stroke = {
  id: string
  points: Array<{ x: number; y: number }>
  tool: 'pen' | 'eraser'
  color: string
  thickness: number
  minX: number
  maxX: number
  minY: number
  maxY: number
}

// Helper: Calculate shortest distance from point P to line segment AB
function distanceToSegment(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const dx = b.x - a.x
  const dy = b.y - a.y

  if (dx === 0 && dy === 0) {
    return Math.hypot(p.x - a.x, p.y - a.y)
  }

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)
  t = Math.max(0, Math.min(1, t))

  const projX = a.x + t * dx
  const projY = a.y + t * dy

  return Math.hypot(p.x - projX, p.y - projY)
}

// Tool 1: Premium Pencil / Pen with Wood neck and Lead tip
const PenTool: React.FC<{ isActive: boolean; color: string; onClick: () => void }> = ({
  isActive,
  color,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
        transform: isActive ? 'translateY(-16px)' : 'translateY(12px)',
        width: '24px',
        height: '90px',
        position: 'relative'
      }}
    >
      {/* Wooden Neck + Lead Tip Cone */}
      <div
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: '#E8C39E', // Natural wood color
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          position: 'relative'
        }}
      >
        {/* Lead Tip Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: color,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}
        />
      </div>
      {/* Pencil Body */}
      <div
        style={{
          width: '24px',
          height: '66px',
          backgroundColor: '#2C2C2E', // Matte dark grey body
          borderRadius: '0 0 4px 4px',
          boxShadow:
            'inset 3px 0 3px rgba(255,255,255,0.05), inset -3px 0 3px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Colored Collar Band */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: color,
            marginTop: '4px',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.2)'
          }}
        />
        <span
          style={{
            fontSize: '7px',
            color: '#8E8E93',
            fontWeight: 800,
            transform: 'rotate(-90deg)',
            whiteSpace: 'nowrap',
            marginTop: '24px',
            letterSpacing: '0.1em'
          }}
        >
          PENCIL
        </span>
      </div>
    </div>
  )
}

// Tool 2: Pink Block Eraser
const EraserTool: React.FC<{ isActive: boolean; onClick: () => void }> = ({
  isActive,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
        transform: isActive ? 'translateY(-16px)' : 'translateY(12px)',
        width: '24px',
        height: '90px'
      }}
    >
      {/* Eraser Tip */}
      <div
        style={{
          width: '24px',
          height: '28px',
          backgroundColor: '#FF8A9A', // Premium rubber pink
          borderRadius: '4px 4px 0 0',
          borderBottom: '2px solid #E15B70',
          boxShadow:
            'inset 3px 3px 3px rgba(255,255,255,0.3), inset -3px -3px 3px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      {/* Eraser Sleeve */}
      <div
        style={{
          width: '24px',
          height: '62px',
          backgroundColor: '#F2F2F7',
          borderRadius: '0 0 4px 4px',
          boxShadow:
            'inset 3px 0 3px rgba(255,255,255,0.5), inset -3px 0 3px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Sleeve Accent Strip */}
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#3B82F6',
            position: 'absolute',
            top: '8px'
          }}
        />
        <span
          style={{
            fontSize: '7px',
            color: '#8E8E93',
            fontWeight: 800,
            transform: 'rotate(-90deg)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.1em'
          }}
        >
          ERASER
        </span>
      </div>
    </div>
  )
}

const WhiteboardPage: React.FC<WhiteboardPageProps> = ({ uiLanguage, themeColor, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)

  // Vector drawing stroke memory
  const strokesRef = useRef<Stroke[]>([])
  const currentStrokeRef = useRef<Stroke | null>(null)
  const lastEraserPosRef = useRef<{ x: number; y: number } | null>(null)
  const isErasingModeRef = useRef<boolean>(false)

  const [isDrawing, setIsDrawing] = useState(false)
  const [activeTool, setActiveTool] = useState<ToolType>('pen')
  const [selectedColor, setSelectedColor] = useState<string>('#0B1C30')
  const [thicknessLevel, setThicknessLevel] = useState<ThicknessLevel>('medium')

  const [showGuide, setShowGuide] = useState(true)
  const [confirmClear, setConfirmClear] = useState(false)

  const colors: ColorPreset[] = [
    { value: '#0B1C30', name: 'Dark' },
    { value: '#EF4444', name: 'Red' },
    { value: '#3B82F6', name: 'Blue' },
    { value: 'var(--primary)', name: 'Theme' }
  ]

  const getDisplayColor = () => {
    if (selectedColor.startsWith('var(')) {
      return (
        themeColor ||
        getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() ||
        '#006c49'
      )
    }
    return selectedColor
  }

  const hexToRgba = (color: string, alpha: number) => {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    return color
  }

  const getThicknessPx = (level: ThicknessLevel) => {
    if (activeTool === 'eraser') {
      return level === 'thin' ? 15 : level === 'medium' ? 35 : 70
    } else {
      return level === 'thin' ? 3 : level === 'medium' ? 8 : 18
    }
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()

    strokesRef.current.forEach((stroke) => {
      if (stroke.points.length === 0) return
      ctx.beginPath()

      const first = stroke.points[0]
      ctx.moveTo(first.x, first.y)

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i]
        ctx.lineTo(pt.x, pt.y)
      }

      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = '#000000'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = stroke.color
      }

      ctx.lineWidth = stroke.thickness
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    })

    // Reset composite operation to default
    ctx.globalCompositeOperation = 'source-over'
  }

  const updateCursorVisibility = (tool: ToolType) => {
    const cursor = cursorRef.current
    if (!cursor) return

    if (tool === 'eraser') {
      const size = getThicknessPx(thicknessLevel)
      cursor.style.width = `${size}px`
      cursor.style.height = `${size}px`
      cursor.style.display = 'block'

      const canvas = canvasRef.current
      if (canvas) {
        canvas.style.cursor = 'none'
      }
    } else {
      cursor.style.display = 'none'
      const canvas = canvasRef.current
      if (canvas) {
        canvas.style.cursor = 'crosshair'
      }
    }
  }

  // Update cursor visibility when tool or thickness changes
  useEffect(() => {
    updateCursorVisibility(activeTool)
  }, [thicknessLevel, activeTool])

  // Fade out the guide toolbar tip after 4.5 seconds on active status
  useEffect(() => {
    if (isActive) {
      setShowGuide(true)
      const timer = setTimeout(() => {
        setShowGuide(false)
      }, 4500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isActive])

  // Auto-revert clear confirmation after 3.5 seconds
  useEffect(() => {
    if (confirmClear) {
      const timer = setTimeout(() => {
        setConfirmClear(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [confirmClear])

  // Resize canvas dynamically keeping high-DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return // Skip resizing when hidden

      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        // Redraw vector strokes cleanly at the new resolution!
        redrawCanvas()
      }
    }

    if (isActive) {
      resizeCanvas()
    }

    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [isActive])

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const eraseAtPoint = (x: number, y: number) => {
    const eraserSize = getThicknessPx(thicknessLevel)
    const eraserRadius = eraserSize / 2

    let hitDetected = false

    strokesRef.current = strokesRef.current.filter((stroke) => {
      // Keep pixel eraser strokes in the database
      if (stroke.tool === 'eraser') return true

      // 1. Fast bounding box check with padding
      const padding = eraserRadius + stroke.thickness / 2
      if (
        x < stroke.minX - padding ||
        x > stroke.maxX + padding ||
        y < stroke.minY - padding ||
        y > stroke.maxY + padding
      ) {
        return true // Keep this stroke
      }

      // 2. Precise distance check for each segment
      for (let i = 0; i < stroke.points.length - 1; i++) {
        const dist = distanceToSegment({ x, y }, stroke.points[i], stroke.points[i + 1])
        if (dist <= padding) {
          hitDetected = true
          return false // Delete this stroke (collision detected!)
        }
      }

      return true // Keep
    })

    if (hitDetected) {
      redrawCanvas()
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Prevent context menu firing on drawing
    if ('button' in e && e.button === 2) {
      e.preventDefault()
    }

    // Right-click drawing acts as OBJECT ERASER!
    const isRightClick = 'button' in e && e.button === 2

    // Determine eraser behavior:
    // Right-click -> isErasingModeRef (object eraser, removes entire stroke)
    // Toolbar eraser -> draws a pixel-eraser stroke (destination-out)
    isErasingModeRef.current = isRightClick

    setIsDrawing(true)
    const { x, y } = getCoords(e)

    if (!isErasingModeRef.current) {
      // Drawing normal line (pencil) or toolbar pixel-eraser
      const newStroke: Stroke = {
        id: Math.random().toString(36).substring(2, 9),
        points: [{ x, y }],
        tool: activeTool,
        color: activeTool === 'eraser' ? 'transparent' : getDisplayColor(),
        thickness: getThicknessPx(thicknessLevel),
        minX: x,
        maxX: x,
        minY: y,
        maxY: y
      }
      currentStrokeRef.current = newStroke

      ctx.beginPath()
      ctx.moveTo(x, y)

      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = '#000000'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = getDisplayColor()
      }
      ctx.lineWidth = getThicknessPx(thicknessLevel)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    } else {
      // Right-click object eraser activation
      lastEraserPosRef.current = { x, y }
      eraseAtPoint(x, y)
      canvas.style.cursor = 'none'
    }

    // Update cursor immediately for mouse events
    if (!('touches' in e)) {
      const currentCursorTool = isRightClick ? 'eraser' : activeTool
      updateCursorVisibility(currentCursorTool)
      const cursor = cursorRef.current
      if (cursor) {
        cursor.style.left = `${x}px`
        cursor.style.top = `${y}px`
      }
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (e.cancelable) {
      e.preventDefault()
    }

    const { x, y } = getCoords(e)

    if (!isErasingModeRef.current) {
      // Drawing stroke (pen or pixel-eraser)
      const stroke = currentStrokeRef.current
      if (stroke) {
        stroke.points.push({ x, y })
        stroke.minX = Math.min(stroke.minX, x)
        stroke.maxX = Math.max(stroke.maxX, x)
        stroke.minY = Math.min(stroke.minY, y)
        stroke.maxY = Math.max(stroke.maxY, y)

        ctx.lineTo(x, y)
        ctx.stroke()
      }
    } else {
      // Right-click Object Eraser path with sweep interpolation
      const lastPos = lastEraserPosRef.current
      if (lastPos) {
        const dist = Math.hypot(x - lastPos.x, y - lastPos.y)
        const step = 8 // evaluate collision every 8px along the drag line
        if (dist > step) {
          const steps = Math.floor(dist / step)
          for (let i = 1; i <= steps; i++) {
            const tVal = i / steps
            const ix = lastPos.x + (x - lastPos.x) * tVal
            const iy = lastPos.y + (y - lastPos.y) * tVal
            eraseAtPoint(ix, iy)
          }
        } else {
          eraseAtPoint(x, y)
        }
      } else {
        eraseAtPoint(x, y)
      }
      lastEraserPosRef.current = { x, y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const cursor = cursorRef.current
    const { x, y } = getCoords(e)
    if (cursor) {
      cursor.style.left = `${x}px`
      cursor.style.top = `${y}px`
    }
    draw(e)
  }

  const handleMouseEnter = () => {
    updateCursorVisibility(activeTool)
  }

  const handleMouseLeave = () => {
    const cursor = cursorRef.current
    if (cursor) {
      cursor.style.display = 'none'
    }
    stopDrawing()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (currentStrokeRef.current) {
      strokesRef.current.push(currentStrokeRef.current)
      currentStrokeRef.current = null
    }
    isErasingModeRef.current = false
    lastEraserPosRef.current = null
    updateCursorVisibility(activeTool)
  }

  const clearAll = () => {
    strokesRef.current = []
    redrawCanvas()
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#FFFFFF',
        backgroundImage: 'radial-gradient(#CBD5E1 2.5px, transparent 2.5px)',
        backgroundSize: '36px 36px',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      {/* Dynamic Cursor Eraser Circle (PointerEvents: None) */}
      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          borderRadius: '50%',
          border: '1px solid rgba(0, 0, 0, 0.35)',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 0 4px rgba(0, 0, 0, 0.1)',
          transform: 'translate(-50%, -50%)',
          display: 'none',
          zIndex: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }}
      />

      {/* Explanatory Guide Speech Bubble (anchored above the toolbar and fading out) */}
      <div
        style={{
          position: 'absolute',
          bottom: '148px', // directly above the toolbar
          left: '50%',
          transform: showGuide
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(12px)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '10px 20px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#FFFFFF',
          opacity: showGuide ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 20,
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transition: 'opacity 0.4s ease, transform 0.4s ease'
        }}
      >
        {t('whiteboardGuide', uiLanguage)}
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          display: 'block',
          cursor: activeTool === 'eraser' ? 'none' : 'crosshair', // Hide default cursor when active tool is eraser
          touchAction: 'none'
        }}
      />

      {/* Floating Freeform Toolbar in Light Glassmorphism */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '24px',
          padding: '0 28px 12px 28px',
          height: '110px',
          borderRadius: '32px',
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
          zIndex: 10,
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        {/* Tools Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '22px',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            paddingRight: '24px',
            height: '100%'
          }}
        >
          <PenTool
            isActive={activeTool === 'pen'}
            color={getDisplayColor()}
            onClick={() => setActiveTool('pen')}
          />
          <EraserTool isActive={activeTool === 'eraser'} onClick={() => setActiveTool('eraser')} />
        </div>

        {/* Thickness Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            paddingRight: '24px',
            height: '100%',
            paddingBottom: '8px'
          }}
        >
          {(['thin', 'medium', 'thick'] as const).map((level) => {
            const isSelected = thicknessLevel === level
            const dotSize = level === 'thin' ? 4 : level === 'medium' ? 8 : 14
            const pxSize = getThicknessPx(level)
            return (
              <button
                key={level}
                onClick={() => setThicknessLevel(level)}
                style={{
                  width: '36px',
                  height: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 0',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  boxShadow: isSelected ? 'inset 0 1px 3px rgba(0,0,0,0.06)' : 'none'
                }}
                title={`Thickness: ${level}`}
              >
                {/* Visual Dot Preview Container */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '24px'
                  }}
                >
                  <div
                    style={{
                      width: `${dotSize}px`,
                      height: `${dotSize}px`,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? getDisplayColor() : '#8E8E93',
                      boxShadow: isSelected
                        ? `0 0 4px ${hexToRgba(getDisplayColor(), 0.3)}`
                        : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>
                {/* Text Label displaying px size */}
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: isSelected ? 800 : 500,
                    color: isSelected ? '#1C1C1E' : '#8E8E93',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {pxSize}px
                </span>
              </button>
            )
          })}
        </div>

        {/* Color Palette Section (3D Recessed Well Buttons with Checkmarks) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            paddingRight: '24px',
            height: '100%',
            paddingBottom: '8px'
          }}
        >
          {colors.map((color) => {
            const isSelected = selectedColor === color.value
            const colorVal = color.value.startsWith('var(')
              ? themeColor ||
                getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() ||
                '#006c49'
              : color.value
            return (
              <div
                key={color.name}
                onClick={() => setSelectedColor(color.value)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#EAEAEA',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 1px rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
                title={color.name}
              >
                {/* 3D Color Plug inside the Well */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: colorVal,
                    boxShadow: isSelected
                      ? `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 8px ${colorVal}`
                      : 'inset 0 2px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 24 24"
                      style={{
                        width: '10px',
                        height: '10px',
                        stroke:
                          color.name === 'Theme' && colorVal.toLowerCase() === '#ffffff'
                            ? '#000000'
                            : '#FFFFFF',
                        strokeWidth: 4,
                        fill: 'none',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                      }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Clear Button Section with Confirmation Protection */}
        <div
          style={{ height: '100%', display: 'flex', alignItems: 'center', paddingBottom: '8px' }}
        >
          <button
            onClick={() => {
              if (confirmClear) {
                clearAll()
                setConfirmClear(false)
              } else {
                setConfirmClear(true)
              }
            }}
            style={{
              backgroundColor: confirmClear ? '#EF4444' : 'rgba(0, 0, 0, 0.04)',
              border: confirmClear ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
              color: confirmClear ? '#FFFFFF' : '#EF4444',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: confirmClear ? '0 4px 10px rgba(239, 68, 68, 0.3)' : 'none',
              transform: confirmClear ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
            onMouseEnter={(e) => {
              if (!confirmClear) {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'
              } else {
                e.currentTarget.style.backgroundColor = '#DC2626'
              }
            }}
            onMouseLeave={(e) => {
              if (!confirmClear) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'
              } else {
                e.currentTarget.style.backgroundColor = '#EF4444'
              }
            }}
            title="Clear Board"
          >
            <svg
              style={{
                width: '16px',
                height: '16px',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: 2.5,
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }}
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>{confirmClear ? t('confirmClear', uiLanguage) : t('deleteAll', uiLanguage)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default WhiteboardPage
