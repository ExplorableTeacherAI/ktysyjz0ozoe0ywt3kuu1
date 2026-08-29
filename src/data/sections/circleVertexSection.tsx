import React, { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeChoice,
    InlineFeedback,
    InlineLinkedHighlight,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure } from "@/components/molecules";
import { useSetVar, useVar } from "@/stores";
import { clamp, type Vec2 } from "@/lib/motion";
import {
    choicePropsFromDefinition,
    getVariableInfo,
    linkedHighlightPropsFromDefinition,
} from "../variables";
import {
    ANCHOR_A,
    AngleMark,
    CENTRE,
    CENTRE_HUE,
    DragHandle,
    EASE_150,
    EDGE_HUE,
    HandleShadow,
    INK,
    INK_QUIET,
    INK_STRUCTURE,
    RADIUS,
    VIEW_HEIGHT,
    VIEW_WIDTH,
    WARN_HUE,
    angleOfVector,
    circleArcPath,
    distance,
    formatAngle,
    normalizeDegrees,
    pointOnCircle,
    pointerToView,
    useDragState,
} from "./circleTheoremGeometry";

// ── Fixed model for this figure ─────────────────────────────────────────────

const CENTRE_ANGLE = 100;
const B_ANGLE = ANCHOR_A + CENTRE_ANGLE; // 310°
const POINT_A = pointOnCircle(ANCHOR_A);
const POINT_B = pointOnCircle(B_ANGLE);
const CENTRE_SNAP = 18;
const EDGE_SNAP = 12;

type Zone = "centre" | "longArc" | "shortArc" | "inside";

function describeVertex(vertex: Vec2): { zone: Zone; angle: number } {
    const fromCentre = distance(vertex, CENTRE);
    const angleAtVertex = (() => {
        const a = angleOfVector(vertex, POINT_A);
        const b = angleOfVector(vertex, POINT_B);
        const forward = normalizeDegrees(b - a);
        return forward > 180 ? 360 - forward : forward;
    })();

    if (fromCentre < CENTRE_SNAP) return { zone: "centre", angle: CENTRE_ANGLE };
    if (Math.abs(fromCentre - RADIUS) < EDGE_SNAP) {
        const position = normalizeDegrees(angleOfVector(CENTRE, vertex) - B_ANGLE);
        const onLongArc = position > 2 && position < 360 - CENTRE_ANGLE - 2;
        return { zone: onLongArc ? "longArc" : "shortArc", angle: angleAtVertex };
    }
    return { zone: "inside", angle: angleAtVertex };
}

/** Snap the dragged point to the centre or onto the edge when it comes close. */
function snapVertex(raw: Vec2): Vec2 {
    const fromCentre = distance(raw, CENTRE);
    if (fromCentre < CENTRE_SNAP) return { ...CENTRE };
    const onEdge = Math.abs(fromCentre - RADIUS) < EDGE_SNAP || fromCentre > RADIUS;
    if (onEdge) {
        return pointOnCircle(angleOfVector(CENTRE, raw));
    }
    return raw;
}

function VertexDrawing() {
    const setVar = useSetVar();
    const vertexX = useVar<number>("vertexX", 281);
    const vertexY = useVar<number>("vertexY", 94);
    const highlight = useVar<string>("vertexViewHighlight", "");
    const drag = useDragState();
    const svgRef = React.useRef<SVGSVGElement>(null);

    const vertex: Vec2 = { x: vertexX, y: vertexY };
    const { zone, angle } = describeVertex(vertex);
    const valid = zone === "longArc";
    const vertexHue = zone === "centre" ? CENTRE_HUE : valid ? EDGE_HUE : WARN_HUE;

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const isOn = (id: string) => highlight === id;
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("vertexViewHighlight", id),
        onPointerLeave: () => setVar("vertexViewHighlight", ""),
    });

    const handleMove = (event: React.PointerEvent<SVGCircleElement>) => {
        if (!drag.draggingRef.current) return;
        const pointer = pointerToView(event, svgRef.current);
        const snapped = snapVertex(pointer);
        setVar("vertexX", Math.round(clamp(snapped.x, 100, 420)));
        setVar("vertexY", Math.round(clamp(snapped.y, 60, 360)));
    };

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block w-full select-none"
            role="img"
            aria-label="A circle with a freely draggable corner point whose angle is measured live"
        >
            <defs>
                <HandleShadow id="vertex-handle-shadow" />
            </defs>

            <g fontSize="13" style={{ fontVariantNumeric: "tabular-nums" }}>
                <text x="24" y="30" fill={CENTRE_HUE} fontWeight="600">
                    {`angle at the centre = ${formatAngle(CENTRE_ANGLE)}`}
                </text>
                <text x={VIEW_WIDTH - 24} y="30" fill={vertexHue} fontWeight="600" textAnchor="end">
                    {`your angle at V = ${formatAngle(angle)}`}
                </text>
            </g>

            <circle cx={CENTRE.x} cy={CENTRE.y} r={RADIUS} fill="none" stroke={INK_QUIET} strokeWidth="1.5" />

            {/* The short arc between A and B — the trap worth naming. */}
            <g {...hoverProps("shortArc")} opacity={dim("shortArc")} style={EASE_150}>
                {isOn("shortArc") && (
                    <path d={circleArcPath(ANCHOR_A, B_ANGLE)} fill="none" stroke={INK_STRUCTURE} strokeWidth={10} opacity={0.28} strokeLinecap="round" />
                )}
                <path
                    d={circleArcPath(ANCHOR_A, B_ANGLE)}
                    fill="none"
                    stroke={INK_STRUCTURE}
                    strokeWidth={isOn("shortArc") ? 5 : 3.5}
                    strokeLinecap="round"
                    style={EASE_150}
                />
            </g>

            {/* The angle at the centre, always on show as the reference. */}
            <g opacity={dim("centre")} style={EASE_150}>
                <line x1={CENTRE.x} y1={CENTRE.y} x2={POINT_A.x} y2={POINT_A.y} stroke={CENTRE_HUE} strokeWidth="2.5" strokeLinecap="round" />
                <line x1={CENTRE.x} y1={CENTRE.y} x2={POINT_B.x} y2={POINT_B.y} stroke={CENTRE_HUE} strokeWidth="2.5" strokeLinecap="round" />
                <AngleMark vertex={CENTRE} first={POINT_A} second={POINT_B} color={CENTRE_HUE} radius={32} label={formatAngle(CENTRE_ANGLE)} />
            </g>

            {/* The dragged vertex and its two arms. */}
            <line x1={vertex.x} y1={vertex.y} x2={POINT_A.x} y2={POINT_A.y} stroke={vertexHue} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={vertex.x} y1={vertex.y} x2={POINT_B.x} y2={POINT_B.y} stroke={vertexHue} strokeWidth="2.5" strokeLinecap="round" />
            {zone !== "centre" && (
                <AngleMark vertex={vertex} first={POINT_A} second={POINT_B} color={vertexHue} radius={30} label={formatAngle(angle)} />
            )}

            <circle cx={POINT_A.x} cy={POINT_A.y} r="5" fill={INK_STRUCTURE} />
            <text x={POINT_A.x - 15} y={POINT_A.y + 6} fill={INK} fontSize="12" textAnchor="middle">A</text>
            <circle cx={POINT_B.x} cy={POINT_B.y} r="5" fill={INK_STRUCTURE} />
            <text x={POINT_B.x + 15} y={POINT_B.y + 6} fill={INK} fontSize="12" textAnchor="middle">B</text>

            {/* The centre dot, named so it can never be mistaken for an edge point. */}
            <g {...hoverProps("centre")} opacity={dim("centre")} style={EASE_150}>
                <circle cx={CENTRE.x} cy={CENTRE.y} r={isOn("centre") ? 8 : 5} fill={CENTRE_HUE} style={EASE_150} />
                <text x={CENTRE.x - 34} y={CENTRE.y + 5} fill={INK} fontSize="12" textAnchor="middle">centre</text>
            </g>

            <DragHandle position={vertex} color={vertexHue} shadowId="vertex-handle-shadow" active={drag.active} radius={10} />
            <text x={vertex.x} y={vertex.y - 20} fill={INK} fontSize="12" textAnchor="middle">V</text>
            <circle
                cx={vertex.x}
                cy={vertex.y}
                r="24"
                fill="transparent"
                style={drag.cursorStyle}
                {...drag.handlers}
                onPointerMove={handleMove}
            />
        </svg>
    );
}

function VertexVerdict() {
    const vertexX = useVar<number>("vertexX", 281);
    const vertexY = useVar<number>("vertexY", 94);
    const { zone, angle } = describeVertex({ x: vertexX, y: vertexY });

    if (zone === "centre") {
        return (
            <span className="text-[#334155]">
                V is sitting on the centre, so this is the 100° the rule starts from.
            </span>
        );
    }
    if (zone === "longArc") {
        return (
            <span className="text-[#22c55e]">
                On the edge, on the long arc: {formatAngle(angle)}, exactly half of 100°.
            </span>
        );
    }
    if (zone === "shortArc") {
        return (
            <span className="text-[#334155]">
                Still on the edge, but on the short arc between A and B:{" "}
                {formatAngle(angle)} is not half of anything here.
            </span>
        );
    }
    return (
        <span className="text-[#334155]">
            V is floating inside the circle at {formatAngle(angle)}, neither on the edge
            nor at the centre, so the rule has nothing to say.
        </span>
    );
}

function VertexFigure() {
    const setVar = useSetVar();
    return (
        <Figure
            id="where-the-vertex-sits"
            onReset={() => {
                setVar("vertexX", 281);
                setVar("vertexY", 94);
                setVar("vertexViewHighlight", "");
            }}
            caption="A and B are pinned. Drag V anywhere: onto the far edge, down onto the short arc between A and B, or right onto the centre dot."
        >
            <VertexDrawing />
            <div className="px-6 pb-5 text-[13px] leading-snug">
                <VertexVerdict />
            </div>
            <InteractionHintSequence
                hintKey="where-the-vertex-sits-drag"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag V down onto the short arc between A and B",
                        position: { x: "54%", y: "23%" },
                        dragPath: { type: "line", startOffset: { x: 0, y: -20 }, endOffset: { x: -14, y: 24 } },
                    },
                    {
                        gesture: "drag",
                        label: "Now drag V onto the centre dot",
                        position: { x: "46%", y: "81%" },
                        dragPath: { type: "line", startOffset: { x: 0, y: 20 }, endOffset: { x: 6, y: -22 } },
                    },
                ]}
            />
        </Figure>
    );
}

export const circleVertexBlocks: ReactElement[] = [
    <StackLayout key="layout-vertex-heading" maxWidth="xl">
        <Block id="vertex-heading" padding="md">
            <EditableH2 id="h2-vertex-heading" blockId="vertex-heading">
                Where the Vertex Sits
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-vertex-setup" maxWidth="xl">
        <Block id="vertex-setup" padding="sm">
            <EditableParagraph id="para-vertex-setup" blockId="vertex-setup">
                One point, one question: where does the halving actually work? Drag V
                wherever you like, out on the far edge, down on the{" "}
                <InlineLinkedHighlight
                    id="link-vertex-short-arc"
                    varName="vertexViewHighlight"
                    highlightId="shortArc"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("vertexViewHighlight"))}
                >
                    short arc
                </InlineLinkedHighlight>{" "}
                between A and B, or right onto the{" "}
                <InlineLinkedHighlight
                    id="link-vertex-centre"
                    varName="vertexViewHighlight"
                    highlightId="centre"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("vertexViewHighlight"))}
                >
                    centre dot
                </InlineLinkedHighlight>
                , and read what the figure reports each time.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-vertex-figure" maxWidth="xl">
        <Block id="vertex-figure" padding="sm" hasVisualization>
            <VertexFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-vertex-insight" maxWidth="xl">
        <Block id="vertex-insight" padding="sm">
            <EditableParagraph id="para-vertex-insight" blockId="vertex-insight">
                Only two places behave: the centre hands you the full angle, and the long
                arc hands you exactly half of it. Slip onto the short arc between A and B
                and the reading jumps to 130°, which is neither.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-vertex-question" maxWidth="xl">
        <Block id="vertex-question" padding="md">
            <EditableParagraph id="para-vertex-question" blockId="vertex-question">
                So the halving only works when the corner point sits{" "}
                <InlineFeedback
                    varName="answerVertexRule"
                    correctValue="on the edge, on the long arc away from A and B"
                    position="terminal"
                    successMessage="— right, both angles have to stand on the same arc for the doubling to hold"
                    failureMessage="— have another look."
                    hint="Try each place in the figure and watch which reading is half of 100°"
                    visualizationHint={{
                        blockId: "vertex-figure",
                        hintKey: "vertex-feedback-hint",
                        label: "Discover it yourself",
                        resetVars: { vertexX: 260, vertexY: 212 },
                        steps: [
                            {
                                gesture: "drag",
                                label: "Drag V from the centre up onto the far edge and watch the angle halve",
                                position: { x: "50%", y: "52%" },
                                dragPath: { type: "line", startOffset: { x: 0, y: 24 }, endOffset: { x: 4, y: -28 } },
                                completionVar: "vertexY",
                                completionValue: 95,
                                completionTolerance: 14,
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answerVertexRule"
                        correctAnswer="on the edge, on the long arc away from A and B"
                        options={[
                            "anywhere inside the circle",
                            "on the edge, on the short arc between A and B",
                            "on the edge, on the long arc away from A and B",
                        ]}
                        {...choicePropsFromDefinition(getVariableInfo("answerVertexRule"))}
                    />
                </InlineFeedback>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
