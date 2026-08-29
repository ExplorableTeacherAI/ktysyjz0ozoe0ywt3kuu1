/**
 * Shared geometry, palette and small SVG building blocks for the circle
 * theorem lesson. Every figure in the lesson draws from this one model so the
 * circle looks and behaves identically from section to section.
 */

import React, { useRef, useState } from "react";
import { useVar, useSetVar } from "@/stores";
import { clamp, useSpring, type Vec2 } from "@/lib/motion";

// ── View constants (generous padding, safe viewBox) ─────────────────────────

export const VIEW_WIDTH = 520;
export const VIEW_HEIGHT = 380;
export const CENTRE: Vec2 = { x: 260, y: 212 };
export const RADIUS = 120;
export const ANCHOR_A = 210; // degrees, standard position — point A never moves

export const INK = "#334155";
export const INK_STRUCTURE = "#64748B";
export const INK_QUIET = "#CBD5E1";
export const CENTRE_HUE = "#62D0AD";
export const EDGE_HUE = "#8E90F5";
export const GUESS_HUE = "#F7B23B";
export const WARN_HUE = "#F4A89A";

export const EASE_150 = {
    transition: "opacity 150ms ease, stroke-width 150ms ease",
} as const;

// ── Geometry helpers ────────────────────────────────────────────────────────

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const normalizeDegrees = (degrees: number) => ((degrees % 360) + 360) % 360;

/** One formatter per quantity: every angle in the lesson prints like this. */
export const formatAngle = (degrees: number) => `${Math.round(degrees)}°`;

export const pointOnCircle = (
    degrees: number,
    radius = RADIUS,
    centre: Vec2 = CENTRE,
): Vec2 => ({
    x: centre.x + Math.cos(toRadians(degrees)) * radius,
    y: centre.y - Math.sin(toRadians(degrees)) * radius,
});

/** Standard-position angle (y up) of the vector from `from` to `to`. */
export const angleOfVector = (from: Vec2, to: Vec2) =>
    normalizeDegrees((Math.atan2(from.y - to.y, to.x - from.x) * 180) / Math.PI);

export const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.y - b.y);

/** Arc of the main circle, swept counter-clockwise from `fromDeg` to `toDeg`. */
export const circleArcPath = (
    fromDeg: number,
    toDeg: number,
    radius = RADIUS,
    centre: Vec2 = CENTRE,
) => {
    const sweep = normalizeDegrees(toDeg - fromDeg);
    const start = pointOnCircle(fromDeg, radius, centre);
    const end = pointOnCircle(toDeg, radius, centre);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 0 ${end.x} ${end.y}`;
};

/** Pointer position in viewBox coordinates. */
export const pointerToView = (
    event: React.PointerEvent,
    svg: SVGSVGElement | null,
    width = VIEW_WIDTH,
    height = VIEW_HEIGHT,
): Vec2 => {
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
        x: ((event.clientX - rect.left) / rect.width) * width,
        y: ((event.clientY - rect.top) / rect.height) * height,
    };
};

// ── Small shared SVG pieces ─────────────────────────────────────────────────

/** Soft shadow used only on draggable handles. */
export function HandleShadow({ id }: { id: string }) {
    return (
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>
    );
}

interface AngleMarkProps {
    vertex: Vec2;
    first: Vec2;
    second: Vec2;
    color: string;
    radius?: number;
    label?: string;
    /** Highlight state: pops the arc and deepens the wedge fill. */
    active?: boolean;
    opacity?: number;
    labelOffset?: number;
}

/**
 * The angle between two rays leaving `vertex`: a translucent wedge, an arc
 * stroke and a direct label placed on the bisector.
 */
export function AngleMark({
    vertex,
    first,
    second,
    color,
    radius = 34,
    label,
    active = false,
    opacity = 1,
    labelOffset = 22,
}: AngleMarkProps) {
    const a1 = angleOfVector(vertex, first);
    const a2 = angleOfVector(vertex, second);
    const forward = normalizeDegrees(a2 - a1);
    const start = forward > 180 ? a2 : a1;
    const span = forward > 180 ? 360 - forward : forward;
    const end = start + span;

    const startPoint = pointOnCircle(start, radius, vertex);
    const endPoint = pointOnCircle(end, radius, vertex);
    const arc = `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 0 ${endPoint.x} ${endPoint.y}`;
    const wedge = `M ${vertex.x} ${vertex.y} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 0 ${endPoint.x} ${endPoint.y} Z`;
    const labelPoint = pointOnCircle(start + span / 2, radius + labelOffset, vertex);

    return (
        <g opacity={opacity} style={EASE_150}>
            <path d={wedge} fill={color} fillOpacity={active ? 0.35 : 0.15} style={EASE_150} />
            {active && <path d={arc} fill="none" stroke={color} strokeWidth={9} opacity={0.28} strokeLinecap="round" />}
            <path
                d={arc}
                fill="none"
                stroke={color}
                strokeWidth={active ? 4 : 2.5}
                strokeLinecap="round"
                style={EASE_150}
            />
            {label && (
                <text
                    x={labelPoint.x}
                    y={labelPoint.y + 4}
                    fill={color}
                    fontSize="13"
                    fontWeight="600"
                    textAnchor="middle"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {label}
                </text>
            )}
        </g>
    );
}

/** Draggable accent handle: filled circle, soft shadow, spring hover scale. */
export function DragHandle({
    position,
    color,
    shadowId,
    active,
    radius = 9,
}: {
    position: Vec2;
    color: string;
    shadowId: string;
    active: boolean;
    radius?: number;
}) {
    const scale = useSpring(active ? 1.18 : 1, { stiffness: 400, damping: 26 });
    return (
        <g transform={`translate(${position.x} ${position.y}) scale(${scale})`}>
            <circle r={radius} fill={color} filter={`url(#${shadowId})`} />
        </g>
    );
}

// ── Shared drag state hook ──────────────────────────────────────────────────

export function useDragState() {
    const draggingRef = useRef(false);
    const [dragging, setDragging] = useState(false);
    const [hovered, setHovered] = useState(false);
    return {
        dragging,
        hovered,
        active: dragging || hovered,
        draggingRef,
        handlers: {
            onPointerDown: (event: React.PointerEvent<SVGCircleElement>) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                draggingRef.current = true;
                setDragging(true);
            },
            onPointerUp: () => {
                draggingRef.current = false;
                setDragging(false);
            },
            onPointerCancel: () => {
                draggingRef.current = false;
                setDragging(false);
            },
            onPointerEnter: () => setHovered(true),
            onPointerLeave: () => setHovered(false),
        },
        cursorStyle: {
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none" as const,
        },
    };
}

// ── The shared "two angles on one arc" drawing ──────────────────────────────

export const MIN_CENTRE_ANGLE = 40;
export const MAX_CENTRE_ANGLE = 170;
const MIN_POSITION = 0.08;
const MAX_POSITION = 0.92;

export interface TwoAngleCircleProps {
    /** Number variable holding the angle at the centre, in degrees. */
    centreVar: string;
    /** Number variable holding where the edge point sits along the major arc. */
    positionVar: string;
    /** Optional shared highlight channel: '' | 'arc' | 'centre' | 'edge'. */
    highlightVar?: string;
    /** Word labels for the intro figure, single letters for the summary. */
    labelMode?: "words" | "letters";
    idPrefix: string;
}

/**
 * Circle with a fixed point A, a draggable point B and a draggable point P on
 * the major arc. Both angles standing on arc AB are drawn and read out live.
 */
export function TwoAngleCircleDrawing({
    centreVar,
    positionVar,
    highlightVar,
    labelMode = "words",
    idPrefix,
}: TwoAngleCircleProps) {
    const setVar = useSetVar();
    const centreAngle = useVar<number>(centreVar, 120);
    const position = useVar<number>(positionVar, 0.5);
    const highlight = useVar<string>(highlightVar ?? "__unused", "");
    const svgRef = useRef<SVGSVGElement>(null);

    const pointDrag = useDragState();
    const arcDrag = useDragState();

    const bAngle = ANCHOR_A + centreAngle;
    const majorSpan = 360 - centreAngle;
    const pAngle = bAngle + position * majorSpan;

    const pointA = pointOnCircle(ANCHOR_A);
    const pointB = pointOnCircle(bAngle);
    const pointP = pointOnCircle(pAngle);
    const edgeAngle = centreAngle / 2;

    const shadowId = `${idPrefix}-handle-shadow`;
    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const isOn = (id: string) => highlight === id;
    const hoverProps = (id: string) =>
        highlightVar
            ? {
                  onPointerEnter: () => setVar(highlightVar, id),
                  onPointerLeave: () => setVar(highlightVar, ""),
              }
            : {};

    const handleMoveB = (event: React.PointerEvent<SVGCircleElement>) => {
        if (!arcDrag.draggingRef.current) return;
        const pointer = pointerToView(event, svgRef.current);
        const degrees = angleOfVector(CENTRE, pointer);
        setVar(
            centreVar,
            Math.round(clamp(normalizeDegrees(degrees - ANCHOR_A), MIN_CENTRE_ANGLE, MAX_CENTRE_ANGLE)),
        );
    };

    const handleMoveP = (event: React.PointerEvent<SVGCircleElement>) => {
        if (!pointDrag.draggingRef.current) return;
        const pointer = pointerToView(event, svgRef.current);
        const degrees = angleOfVector(CENTRE, pointer);
        const along = normalizeDegrees(degrees - bAngle) / majorSpan;
        setVar(positionVar, clamp(Number(along.toFixed(3)), MIN_POSITION, MAX_POSITION));
    };

    const centreLabel = labelMode === "words" ? formatAngle(centreAngle) : `x = ${formatAngle(centreAngle)}`;
    const edgeLabel = labelMode === "words" ? formatAngle(edgeAngle) : `y = ${formatAngle(edgeAngle)}`;

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full select-none"
            role="img"
            aria-label="A circle with an angle at the centre and an angle at the edge, both standing on the same arc"
        >
            <defs>
                <HandleShadow id={shadowId} />
            </defs>

            {/* Readouts — beside the drawing, never over it. */}
            <g fontSize="13" style={{ fontVariantNumeric: "tabular-nums", ...EASE_150 }}>
                <text x="24" y="30" fill={CENTRE_HUE} fontWeight="600" opacity={dim("centre")}>
                    {`angle at the centre = ${formatAngle(centreAngle)}`}
                </text>
                <text
                    x={VIEW_WIDTH - 24}
                    y="30"
                    fill={EDGE_HUE}
                    fontWeight="600"
                    textAnchor="end"
                    opacity={dim("edge")}
                >
                    {`angle at the edge = ${formatAngle(edgeAngle)}`}
                </text>
            </g>

            {/* The circle itself — quiet structure. */}
            <g opacity={dim("__structure")} style={EASE_150}>
                <circle cx={CENTRE.x} cy={CENTRE.y} r={RADIUS} fill="none" stroke={INK_QUIET} strokeWidth="1.5" />
            </g>

            {/* Arc AB — the stretch of edge both angles stand on. */}
            <g {...hoverProps("arc")} opacity={dim("arc")} style={EASE_150}>
                {isOn("arc") && (
                    <path d={circleArcPath(ANCHOR_A, bAngle)} fill="none" stroke={INK_STRUCTURE} strokeWidth={10} opacity={0.28} strokeLinecap="round" />
                )}
                <path
                    d={circleArcPath(ANCHOR_A, bAngle)}
                    fill="none"
                    stroke={INK_STRUCTURE}
                    strokeWidth={isOn("arc") ? 5 : 3.5}
                    strokeLinecap="round"
                    style={EASE_150}
                />
                <text
                    x={pointOnCircle(ANCHOR_A + centreAngle / 2, RADIUS + 26).x}
                    y={pointOnCircle(ANCHOR_A + centreAngle / 2, RADIUS + 26).y + 4}
                    fill={INK}
                    fontSize="12"
                    textAnchor="middle"
                >
                    arc AB
                </text>
            </g>

            {/* Angle at the centre. */}
            <g {...hoverProps("centre")} opacity={dim("centre")} style={EASE_150}>
                <line x1={CENTRE.x} y1={CENTRE.y} x2={pointA.x} y2={pointA.y} stroke={CENTRE_HUE} strokeWidth={isOn("centre") ? 4 : 2.5} strokeLinecap="round" style={EASE_150} />
                <line x1={CENTRE.x} y1={CENTRE.y} x2={pointB.x} y2={pointB.y} stroke={CENTRE_HUE} strokeWidth={isOn("centre") ? 4 : 2.5} strokeLinecap="round" style={EASE_150} />
                <AngleMark vertex={CENTRE} first={pointA} second={pointB} color={CENTRE_HUE} radius={38} label={centreLabel} active={isOn("centre")} />
            </g>

            {/* Angle at the edge. */}
            <g {...hoverProps("edge")} opacity={dim("edge")} style={EASE_150}>
                <line x1={pointP.x} y1={pointP.y} x2={pointA.x} y2={pointA.y} stroke={EDGE_HUE} strokeWidth={isOn("edge") ? 4 : 2.5} strokeLinecap="round" style={EASE_150} />
                <line x1={pointP.x} y1={pointP.y} x2={pointB.x} y2={pointB.y} stroke={EDGE_HUE} strokeWidth={isOn("edge") ? 4 : 2.5} strokeLinecap="round" style={EASE_150} />
                <AngleMark vertex={pointP} first={pointA} second={pointB} color={EDGE_HUE} radius={30} label={edgeLabel} active={isOn("edge")} />
            </g>

            {/* Fixed point A and the centre marker. */}
            <g opacity={dim("__structure")} style={EASE_150}>
                <circle cx={pointA.x} cy={pointA.y} r="5" fill={INK_STRUCTURE} />
                <text x={pointA.x - 14} y={pointA.y + 16} fill={INK} fontSize="12" textAnchor="middle">A</text>
                <circle cx={CENTRE.x} cy={CENTRE.y} r="4.5" fill={INK_STRUCTURE} />
                <text x={CENTRE.x - 34} y={CENTRE.y + 4} fill={INK} fontSize="12" textAnchor="middle">
                    {labelMode === "words" ? "centre" : "O"}
                </text>
            </g>

            {/* Draggable B — moving it opens or closes the arc. */}
            <DragHandle position={pointB} color={CENTRE_HUE} shadowId={shadowId} active={arcDrag.active} />
            <text x={pointB.x + 16} y={pointB.y + 18} fill={INK} fontSize="12" textAnchor="middle">B</text>
            <circle
                cx={pointB.x}
                cy={pointB.y}
                r="24"
                fill="transparent"
                style={arcDrag.cursorStyle}
                {...arcDrag.handlers}
                onPointerMove={handleMoveB}
            />

            {/* Draggable P — the point on the edge. */}
            <DragHandle position={pointP} color={EDGE_HUE} shadowId={shadowId} active={pointDrag.active} />
            <text x={pointP.x} y={pointP.y - 18} fill={INK} fontSize="12" textAnchor="middle">P</text>
            <circle
                cx={pointP.x}
                cy={pointP.y}
                r="24"
                fill="transparent"
                style={pointDrag.cursorStyle}
                {...pointDrag.handlers}
                onPointerMove={handleMoveP}
            />
        </svg>
    );
}
