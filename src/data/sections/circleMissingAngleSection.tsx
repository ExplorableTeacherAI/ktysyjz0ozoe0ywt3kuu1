import { useEffect, type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineFeedback,
    InlineScrubbleNumber,
    InteractionHintSequence,
} from "@/components/atoms";
import { Figure, FigureSlider, FormulaBlock } from "@/components/molecules";
import { useSetVar, useVar } from "@/stores";
import {
    clozePropsFromDefinition,
    getVariableInfo,
    numberPropsFromDefinition,
    scrubVarsFromDefinitions,
} from "../variables";
import { CENTRE_HUE, EDGE_HUE, TwoAngleCircleDrawing, formatAngle } from "./circleTheoremGeometry";

/** Keeps the readable edge value in step with the centre angle. */
function useMirroredEdgeAngle() {
    const setVar = useSetVar();
    const centreAngle = useVar<number>("summaryCentreAngle", 80);
    useEffect(() => {
        setVar("summaryEdgeAngle", Math.round(centreAngle / 2));
    }, [centreAngle, setVar]);
}

function MissingAngleFigure() {
    const setVar = useSetVar();
    useMirroredEdgeAngle();

    return (
        <Figure
            id="missing-angle-summary"
            onReset={() => {
                setVar("summaryCentreAngle", 80);
                setVar("summaryEdgePosition", 0.5);
            }}
            caption="The theorem with the story stripped out: drag B to change x, drag P to move around the arc, and y stays at half of x."
        >
            <TwoAngleCircleDrawing
                idPrefix="missing-angle"
                centreVar="summaryCentreAngle"
                positionVar="summaryEdgePosition"
                labelMode="letters"
            />
            <div className="px-6 pb-5">
                <FigureSlider
                    varName="summaryCentreAngle"
                    label="Angle at the centre (x)"
                    {...numberPropsFromDefinition(getVariableInfo("summaryCentreAngle"))}
                    formatValue={formatAngle}
                />
            </div>
            <InteractionHintSequence
                hintKey="missing-angle-summary-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the teal point B to change x",
                        position: { x: "58%", y: "77%" },
                        dragPath: { type: "arc", startAngle: -40, endAngle: 40, radius: 28 },
                    },
                ]}
            />
        </Figure>
    );
}

export const circleMissingAngleBlocks: ReactElement[] = [
    <StackLayout key="layout-missing-angle-heading" maxWidth="xl">
        <Block id="missing-angle-heading" padding="md">
            <EditableH2 id="h2-missing-angle-heading" blockId="missing-angle-heading">
                Finding a Missing Angle
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-missing-angle-setup" maxWidth="xl">
        <Block id="missing-angle-setup" padding="sm">
            <EditableParagraph id="para-missing-angle-setup" blockId="missing-angle-setup">
                Strip away the stadium and the bare rule is left. Call the centre angle x
                and the edge angle y, then drag B and watch y follow x down at half the
                size. With x at{" "}
                <InlineScrubbleNumber
                    varName="summaryCentreAngle"
                    {...numberPropsFromDefinition(getVariableInfo("summaryCentreAngle"))}
                    formatValue={formatAngle}
                />
                , halving gives y.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-missing-angle-figure" maxWidth="xl">
        <Block id="missing-angle-figure" padding="sm" hasVisualization>
            <MissingAngleFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-missing-angle-formula" maxWidth="xl">
        <Block id="missing-angle-formula" padding="lg">
            <FormulaBlock
                latex="\clr{centre}{x} = 2 \times \clr{edge}{y} \;\longrightarrow\; \scrub{summaryCentreAngle}^\circ = 2 \times \val{summaryEdgeAngle}^\circ"
                colorMap={{ centre: CENTRE_HUE, edge: EDGE_HUE }}
                variables={scrubVarsFromDefinitions(["summaryCentreAngle"])}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-missing-angle-rule" maxWidth="xl">
        <Block id="missing-angle-rule" padding="sm">
            <EditableParagraph id="para-missing-angle-rule" blockId="missing-angle-rule">
                Halve to travel from the centre out to the edge, and double to travel back
                in. Everything below is that one move.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-missing-angle-practice-edge" maxWidth="xl">
        <Block id="missing-angle-practice-edge" padding="md">
            <EditableParagraph id="para-missing-angle-practice-edge" blockId="missing-angle-practice-edge">
                A circle has an angle of 110° at the centre. Someone standing on the edge,
                on the same arc, would measure{" "}
                <InlineFeedback
                    varName="answerPracticeEdge"
                    correctValue={["55", "55°"]}
                    position="terminal"
                    successMessage="— exactly, half of 110 is 55"
                    failureMessage="— close, but check the direction of travel."
                    hint="Moving out to the edge means halving, so 110 ÷ 2"
                    visualizationHint={{
                        blockId: "missing-angle-figure",
                        hintKey: "practice-edge-hint",
                        label: "Discover it yourself",
                        resetVars: { summaryCentreAngle: 80, summaryEdgePosition: 0.5 },
                        steps: [
                            {
                                gesture: "drag-circular",
                                label: "Drag the teal point B until x reads 110°, then read y",
                                position: { x: "58%", y: "77%" },
                                dragPath: { type: "arc", startAngle: -40, endAngle: 40, radius: 28 },
                                completionVar: "summaryCentreAngle",
                                completionValue: 110,
                                completionTolerance: 4,
                            },
                        ],
                    }}
                >
                    <InlineClozeInput
                        varName="answerPracticeEdge"
                        correctAnswer={["55", "55°"]}
                        {...clozePropsFromDefinition(getVariableInfo("answerPracticeEdge"))}
                    />
                </InlineFeedback>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,

];
