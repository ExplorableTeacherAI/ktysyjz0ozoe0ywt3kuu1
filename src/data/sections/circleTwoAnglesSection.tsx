import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFeedback,
    InlineLinkedHighlight,
    InlineScrubbleNumber,
    InlineSpotColor,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure, FigureSlider } from "@/components/molecules";
import { useSetVar } from "@/stores";
import {
    clozePropsFromDefinition,
    getVariableInfo,
    linkedHighlightPropsFromDefinition,
    numberPropsFromDefinition,
    spotColorPropsFromDefinition,
} from "../variables";
import { TwoAngleCircleDrawing, formatAngle } from "./circleTheoremGeometry";

function TwoAnglesFigure() {
    const setVar = useSetVar();

    return (
        <Figure
            id="two-angles-one-arc"
            onReset={() => {
                setVar("arcCentreAngle", 120);
                setVar("arcEdgePosition", 0.5);
                setVar("arcViewHighlight", "");
            }}
            caption="Point A never moves. Drag the indigo point P around the edge, or drag the teal point B to open the arc wider, and watch both readings at the top."
        >
            <TwoAngleCircleDrawing
                idPrefix="two-angles"
                centreVar="arcCentreAngle"
                positionVar="arcEdgePosition"
                highlightVar="arcViewHighlight"
                labelMode="words"
            />
            <div className="px-6 pb-5">
                <FigureSlider
                    varName="arcCentreAngle"
                    label="Angle at the centre"
                    {...numberPropsFromDefinition(getVariableInfo("arcCentreAngle"))}
                    formatValue={formatAngle}
                />
            </div>
            <InteractionHintSequence
                hintKey="two-angles-one-arc-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the indigo point P around the edge",
                        position: { x: "50%", y: "22%" },
                        dragPath: { type: "arc", startAngle: 200, endAngle: 340, radius: 30 },
                    },
                    {
                        gesture: "drag-circular",
                        label: "Drag the teal point B to open the arc",
                        position: { x: "70%", y: "65%" },
                        dragPath: { type: "arc", startAngle: -40, endAngle: 40, radius: 28 },
                    },
                ]}
            />
        </Figure>
    );
}

export const circleTwoAnglesBlocks: ReactElement[] = [
    <StackLayout key="layout-two-angles-heading" maxWidth="xl">
        <Block id="two-angles-heading" padding="md">
            <EditableH2 id="h2-two-angles-heading" blockId="two-angles-heading">
                Two Angles, One Arc
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-two-angles-setup" maxWidth="xl">
        <Block id="two-angles-setup" padding="sm">
            <EditableParagraph id="para-two-angles-setup" blockId="two-angles-setup">
                Here are the two floodlights, marked A and B, and the stretch of edge
                between them is the{" "}
                <InlineLinkedHighlight
                    id="link-two-angles-arc"
                    varName="arcViewHighlight"
                    highlightId="arc"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("arcViewHighlight"))}
                >
                    arc
                </InlineLinkedHighlight>
                . The{" "}
                <InlineSpotColor
                    varName="centreAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("centreAngleTerm"))}
                >
                    teal angle
                </InlineSpotColor>{" "}
                stands at the centre, and the{" "}
                <InlineSpotColor
                    varName="edgeAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("edgeAngleTerm"))}
                >
                    indigo one
                </InlineSpotColor>{" "}
                stands at P, out on the edge. Drag P right around the edge and see which
                of the two readings moves.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-two-angles-figure" maxWidth="xl">
        <Block id="two-angles-figure" padding="sm" hasVisualization>
            <TwoAnglesFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-two-angles-insight" maxWidth="xl">
        <Block id="two-angles-insight" padding="sm">
            <EditableParagraph id="para-two-angles-insight" blockId="two-angles-insight">
                P slides all the way along the top and the{" "}
                <InlineSpotColor
                    id="spot-two-angles-insight-edge-reading"
                    varName="edgeAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("edgeAngleTerm"))}
                >
                    indigo reading
                </InlineSpotColor>{" "}
                refuses to budge. With the{" "}
                <InlineSpotColor
                    id="spot-two-angles-insight-centre-angle"
                    varName="centreAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("centreAngleTerm"))}
                >
                    angle at the centre
                </InlineSpotColor>{" "}
                sitting at{" "}
                <InlineScrubbleNumber
                    varName="arcCentreAngle"
                    {...numberPropsFromDefinition(getVariableInfo("arcCentreAngle"))}
                    formatValue={formatAngle}
                />
                , the{" "}
                <InlineSpotColor
                    id="spot-two-angles-insight-edge-angle"
                    varName="edgeAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("edgeAngleTerm"))}
                >
                    angle out on the edge
                </InlineSpotColor>{" "}
                is exactly half of it, every single time.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-two-angles-question" maxWidth="xl">
        <Block id="two-angles-question" padding="md">
            <EditableParagraph id="para-two-angles-question" blockId="two-angles-question">
                So if the angle at the centre were{" "}
                <InlineSpotColor
                    id="spot-two-angles-question-centre-value"
                    varName="centreAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("centreAngleTerm"))}
                >
                    90°
                </InlineSpotColor>
                , the{" "}
                <InlineSpotColor
                    id="spot-two-angles-question-edge-angle"
                    varName="edgeAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("edgeAngleTerm"))}
                >
                    angle out at the edge
                </InlineSpotColor>{" "}
                would be{" "}
                <InlineFeedback
                    varName="answerTwoAnglesEdge"
                    correctValue={["45", "45°"]}
                    position="terminal"
                    successMessage="— exactly, half of 90 is 45, and the edge angle is always the smaller of the pair"
                    failureMessage="— not yet."
                    hint="The edge angle is the half, never the double"
                    visualizationHint={{
                        blockId: "two-angles-figure",
                        hintKey: "two-angles-feedback-hint",
                        label: "Discover it yourself",
                        resetVars: { arcCentreAngle: 120, arcEdgePosition: 0.5 },
                        steps: [
                            {
                                gesture: "drag-circular",
                                label: "Drag the teal point B until the centre reading says 90°",
                                position: { x: "70%", y: "65%" },
                                dragPath: { type: "arc", startAngle: -40, endAngle: 40, radius: 28 },
                                completionVar: "arcCentreAngle",
                                completionValue: 90,
                                completionTolerance: 3,
                            },
                        ],
                    }}
                >
                    <InlineClozeInput
                        varName="answerTwoAnglesEdge"
                        correctAnswer={["45", "45°"]}
                        {...clozePropsFromDefinition(getVariableInfo("answerTwoAnglesEdge"))}
                    />
                </InlineFeedback>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
