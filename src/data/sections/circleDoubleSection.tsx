import React, { useEffect, type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    Button,
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFeedback,
    InlineScrubbleNumber,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure, FigureSlider } from "@/components/molecules";
import { useSetVar, useVar } from "@/stores";
import { clamp, remap } from "@/lib/motion";
import {
    clozePropsFromDefinition,
    getVariableInfo,
    numberPropsFromDefinition,
} from "../variables";
import {
    ANCHOR_A,
    AngleMark,
    CENTRE_HUE,
    DragHandle,
    EDGE_HUE,
    GUESS_HUE,
    HandleShadow,
    INK,
    INK_QUIET,
    INK_STRUCTURE,
    formatAngle,
    pointOnCircle,
    pointerToView,
    useDragState,
} from "./circleTheoremGeometry";

// ── Local view geometry: circle above, prediction scale below ────────────────

const WIDTH = 520;
const HEIGHT = 430;
const CIRCLE_CENTRE = { x: 260, y: 178 };
const CIRCLE_RADIUS = 100;

const SCALE_Y = 348;
const SCALE_LEFT = 70;
const SCALE_RIGHT = 450;
const SCALE_MAX = 180;

const valueToX = (value: number) => remap(value, 0, SCALE_MAX, SCALE_LEFT, SCALE_RIGHT);
const xToValue = (x: number) => remap(x, SCALE_LEFT, SCALE_RIGHT, 0, SCALE_MAX);

/** Keep a centred label fully inside the viewBox. */
const clampLabelX = (x: number, text: string, fontSize = 12) => {
    const half = (text.length * fontSize * 0.6) / 2;
    return clamp(x, 20 + half, WIDTH - 20 - half);
};

function PredictionDrawing() {
    const setVar = useSetVar();
    const centreAngle = useVar<number>("predictCentreAngle", 140);
    const guess = useVar<number>("predictGuessAngle", 100);
    const revealed = useVar<boolean>("predictRevealed", false);
    const guessDrag = useDragState();
    const svgRef = React.useRef<SVGSVGElement>(null);

    // A new centre angle is a new question — hide the previous answer.
    useEffect(() => {
        setVar("predictRevealed", false);
    }, [centreAngle, setVar]);

    const bAngle = ANCHOR_A + centreAngle;
    const pAngle = bAngle + (360 - centreAngle) / 2;
    const pointA = pointOnCircle(ANCHOR_A, CIRCLE_RADIUS, CIRCLE_CENTRE);
    const pointB = pointOnCircle(bAngle, CIRCLE_RADIUS, CIRCLE_CENTRE);
    const pointP = pointOnCircle(pAngle, CIRCLE_RADIUS, CIRCLE_CENTRE);
    const trueEdge = centreAngle / 2;

    const handleGuessMove = (event: React.PointerEvent<SVGCircleElement>) => {
        if (!guessDrag.draggingRef.current) return;
        const pointer = pointerToView(event, svgRef.current, WIDTH, HEIGHT);
        setVar("predictGuessAngle", Math.round(clamp(xToValue(pointer.x), 5, 175)));
        setVar("predictRevealed", false);
    };

    const guessX = valueToX(guess);
    const centreX = valueToX(centreAngle);
    const trueX = valueToX(trueEdge);

    const guessLabel = `your prediction: ${formatAngle(guess)}`;
    const centreLabel = `angle at the centre: ${formatAngle(centreAngle)}`;
    const trueLabel = `the real angle at the edge: ${formatAngle(trueEdge)}`;

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block w-full select-none"
            role="img"
            aria-label="A circle with an unlabelled angle at the edge, and a scale for predicting its size"
        >
            <defs>
                <HandleShadow id="prediction-handle-shadow" />
            </defs>

            {/* The circle: centre angle shown, edge angle deliberately unlabelled. */}
            <circle
                cx={CIRCLE_CENTRE.x}
                cy={CIRCLE_CENTRE.y}
                r={CIRCLE_RADIUS}
                fill="none"
                stroke={INK_QUIET}
                strokeWidth="1.5"
            />
            <line x1={CIRCLE_CENTRE.x} y1={CIRCLE_CENTRE.y} x2={pointA.x} y2={pointA.y} stroke={CENTRE_HUE} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={CIRCLE_CENTRE.x} y1={CIRCLE_CENTRE.y} x2={pointB.x} y2={pointB.y} stroke={CENTRE_HUE} strokeWidth="2.5" strokeLinecap="round" />
            <AngleMark
                vertex={CIRCLE_CENTRE}
                first={pointA}
                second={pointB}
                color={CENTRE_HUE}
                radius={34}
                label={formatAngle(centreAngle)}
            />

            <line x1={pointP.x} y1={pointP.y} x2={pointA.x} y2={pointA.y} stroke={revealed ? EDGE_HUE : INK_STRUCTURE} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={pointP.x} y1={pointP.y} x2={pointB.x} y2={pointB.y} stroke={revealed ? EDGE_HUE : INK_STRUCTURE} strokeWidth="2.5" strokeLinecap="round" />
            <AngleMark
                vertex={pointP}
                first={pointA}
                second={pointB}
                color={revealed ? EDGE_HUE : INK_STRUCTURE}
                radius={28}
                label={revealed ? formatAngle(trueEdge) : "?"}
            />

            <circle cx={pointA.x} cy={pointA.y} r="5" fill={INK_STRUCTURE} />
            <text x={pointA.x - 14} y={pointA.y + 16} fill={INK} fontSize="12" textAnchor="middle">A</text>
            <circle cx={pointB.x} cy={pointB.y} r="5" fill={INK_STRUCTURE} />
            <text x={pointB.x + 14} y={pointB.y + 16} fill={INK} fontSize="12" textAnchor="middle">B</text>
            <circle cx={pointP.x} cy={pointP.y} r="5" fill={revealed ? EDGE_HUE : INK_STRUCTURE} />
            <text x={pointP.x} y={pointP.y - 14} fill={INK} fontSize="12" textAnchor="middle">P</text>
            <circle cx={CIRCLE_CENTRE.x} cy={CIRCLE_CENTRE.y} r="4.5" fill={INK_STRUCTURE} />
            <text x={CIRCLE_CENTRE.x} y={CIRCLE_CENTRE.y + 22} fill={INK} fontSize="12" textAnchor="middle">centre</text>

            {/* The prediction scale — the comparand lives here. */}
            <line x1={SCALE_LEFT} y1={SCALE_Y} x2={SCALE_RIGHT} y2={SCALE_Y} stroke={INK_STRUCTURE} strokeWidth="2" strokeLinecap="round" />
            {[0, 45, 90, 135, 180].map((tick) => (
                <g key={tick}>
                    <line x1={valueToX(tick)} y1={SCALE_Y} x2={valueToX(tick)} y2={SCALE_Y + 8} stroke={INK_QUIET} strokeWidth="2" strokeLinecap="round" />
                    <text x={valueToX(tick)} y={SCALE_Y + 24} fill={INK_QUIET} fontSize="11" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatAngle(tick)}
                    </text>
                </g>
            ))}

            {/* Teal tick: the centre angle, marked on the same scale. */}
            <line x1={centreX} y1={SCALE_Y - 12} x2={centreX} y2={SCALE_Y + 12} stroke={CENTRE_HUE} strokeWidth="3" strokeLinecap="round" />
            <text x={clampLabelX(centreX, centreLabel)} y={SCALE_Y + 44} fill={CENTRE_HUE} fontSize="12" fontWeight="600" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>
                {centreLabel}
            </text>

            {/* Indigo tick: the truth, only after the student commits. */}
            {revealed && (
                <>
                    <line x1={trueX} y1={SCALE_Y - 12} x2={trueX} y2={SCALE_Y + 12} stroke={EDGE_HUE} strokeWidth="3" strokeLinecap="round" />
                    <text x={clampLabelX(trueX, trueLabel)} y={SCALE_Y + 64} fill={EDGE_HUE} fontSize="12" fontWeight="600" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {trueLabel}
                    </text>
                </>
            )}

            {/* The draggable prediction marker. */}
            <text x={clampLabelX(guessX, guessLabel)} y={SCALE_Y - 26} fill={GUESS_HUE} fontSize="12" fontWeight="600" textAnchor="middle" style={{ fontVariantNumeric: "tabular-nums" }}>
                {guessLabel}
            </text>
            <DragHandle position={{ x: guessX, y: SCALE_Y }} color={GUESS_HUE} shadowId="prediction-handle-shadow" active={guessDrag.active} radius={10} />
            <circle
                cx={guessX}
                cy={SCALE_Y}
                r="24"
                fill="transparent"
                style={guessDrag.cursorStyle}
                {...guessDrag.handlers}
                onPointerMove={handleGuessMove}
            />
        </svg>
    );
}

function PredictionVerdict() {
    const centreAngle = useVar<number>("predictCentreAngle", 140);
    const guess = useVar<number>("predictGuessAngle", 100);
    const revealed = useVar<boolean>("predictRevealed", false);
    if (!revealed) return null;

    const trueEdge = centreAngle / 2;
    if (Math.abs(guess - trueEdge) <= 4) {
        return (
            <span className="text-[#22c55e]">
                Spot on. The angle at the edge sits at half the centre reading.
            </span>
        );
    }
    if (Math.abs(guess - centreAngle) <= 8) {
        return (
            <span className="text-[#334155]">
                That is the centre reading repeated. The angle at the edge only reaches
                half as far along the scale.
            </span>
        );
    }
    if (guess > trueEdge) {
        return (
            <span className="text-[#334155]">
                Too far along the scale. Halving the centre reading lands you on the mark.
            </span>
        );
    }
    return (
        <span className="text-[#334155]">
            Not quite far enough. Halving the centre reading lands you on the mark.
        </span>
    );
}

function PredictionFigure() {
    const setVar = useSetVar();
    const revealed = useVar<boolean>("predictRevealed", false);

    return (
        <Figure
            id="predict-edge-angle"
            onReset={() => {
                setVar("predictCentreAngle", 140);
                setVar("predictGuessAngle", 100);
                setVar("predictRevealed", false);
            }}
            caption="The angle at P is hidden behind a question mark. Drag the marker on the scale to your prediction, then check it against the truth."
        >
            <PredictionDrawing />
            <div className="px-6 pb-2 flex flex-wrap items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVar("predictRevealed", true)}
                    disabled={revealed}
                >
                    Check my prediction
                </Button>
                <span className="text-[13px] leading-snug">
                    <PredictionVerdict />
                </span>
            </div>
            <div className="px-6 pb-5">
                <FigureSlider
                    varName="predictCentreAngle"
                    label="Angle at the centre"
                    {...numberPropsFromDefinition(getVariableInfo("predictCentreAngle"))}
                    formatValue={formatAngle}
                />
            </div>
            <InteractionHintSequence
                hintKey="predict-edge-angle-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the marker to your prediction",
                        position: { x: "54%", y: "69%" },
                        dragPath: { type: "line", startOffset: { x: -34, y: 0 }, endOffset: { x: 34, y: 0 } },
                    },
                ]}
            />
        </Figure>
    );
}

export const circleDoubleBlocks: ReactElement[] = [
    <StackLayout key="layout-double-heading" maxWidth="xl">
        <Block id="double-heading" padding="md">
            <EditableH2 id="h2-double-heading" blockId="double-heading">
                Always Double, Never Equal
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-double-setup" maxWidth="xl">
        <Block id="double-setup" padding="sm">
            <EditableParagraph id="para-double-setup" blockId="double-setup">
                Time to commit before you look. The angle at the centre reads{" "}
                <InlineScrubbleNumber
                    varName="predictCentreAngle"
                    {...numberPropsFromDefinition(getVariableInfo("predictCentreAngle"))}
                    formatValue={formatAngle}
                />
                , while the angle at P wears a question mark. Drag the marker along the
                scale to where you think that hidden angle lands, then press check.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-double-figure" maxWidth="xl">
        <Block id="double-figure" padding="sm" hasVisualization>
            <PredictionFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-double-insight" maxWidth="xl">
        <Block id="double-insight" padding="sm">
            <EditableParagraph id="para-double-insight" blockId="double-insight">
                Plenty of people park the marker level with the teal tick, because equal
                feels natural. The truth always lands halfway between zero and that tick,
                no matter which centre angle you pick.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-double-question" maxWidth="xl">
        <Block id="double-question" padding="md">
            <EditableParagraph id="para-double-question" blockId="double-question">
                Now run it backwards. A photographer standing on the edge measures 75°
                between the two floodlights, so the angle back at the centre must be{" "}
                <InlineFeedback
                    varName="answerDoubleCentre"
                    correctValue={["150", "150°"]}
                    position="terminal"
                    successMessage="— yes, doubling is the way back, and 2 × 75 = 150"
                    failureMessage="— not this time."
                    hint="Going from the edge to the centre, the angle grows rather than shrinks"
                    visualizationHint={{
                        blockId: "double-figure",
                        hintKey: "double-feedback-hint",
                        label: "Discover it yourself",
                        resetVars: { predictCentreAngle: 150, predictGuessAngle: 100, predictRevealed: false },
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the marker to 75° on the scale, then press check",
                                position: { x: "44%", y: "69%" },
                                dragPath: { type: "line", startOffset: { x: -34, y: 0 }, endOffset: { x: 34, y: 0 } },
                                completionVar: "predictGuessAngle",
                                completionValue: 75,
                                completionTolerance: 4,
                            },
                        ],
                    }}
                >
                    <InlineClozeInput
                        varName="answerDoubleCentre"
                        correctAnswer={["150", "150°"]}
                        {...clozePropsFromDefinition(getVariableInfo("answerDoubleCentre"))}
                    />
                </InlineFeedback>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
