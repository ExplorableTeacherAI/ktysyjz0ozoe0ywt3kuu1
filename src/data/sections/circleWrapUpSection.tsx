import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import { EditableH2, EditableParagraph, InlineSpotColor, InlineTooltip } from "@/components/atoms";
import { getVariableInfo, spotColorPropsFromDefinition } from "../variables";

export const circleWrapUpBlocks: ReactElement[] = [
    <StackLayout key="layout-wrapup-heading" maxWidth="xl">
        <Block id="wrapup-heading" padding="md">
            <EditableH2 id="h2-wrapup-heading" blockId="wrapup-heading">
                Wrapping Up
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapup-insight" maxWidth="xl">
        <Block id="wrapup-insight" padding="sm">
            <EditableParagraph id="para-wrapup-insight" blockId="wrapup-insight">
                So the shrinking turn in the stadium was never a trick of the eye. Two
                angles{" "}
                <InlineTooltip
                    id="tooltip-wrapup-standing-on-arc"
                    tooltip="An angle stands on an arc when its two arms end at the two ends of that arc."
                >
                    standing on the same arc
                </InlineTooltip>{" "}
                are locked together in a two to one ratio, and{" "}
                <InlineSpotColor
                    id="spot-wrapup-insight-centre-angle"
                    varName="centreAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("centreAngleTerm"))}
                >
                    the one at the centre
                </InlineSpotColor>{" "}
                is always the double, wherever along that arc you choose to stand.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapup-next" maxWidth="xl">
        <Block id="wrapup-next" padding="sm">
            <EditableParagraph id="para-wrapup-next" blockId="wrapup-next">
                Two things are worth carrying away. Both angles have to stand on the{" "}
                <InlineSpotColor
                    id="spot-wrapup-next-same-arc"
                    varName="arcTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("arcTerm"))}
                >
                    same arc
                </InlineSpotColor>
                , and you halve going out to the edge but double coming back in. Next
                comes the special case where that{" "}
                <InlineSpotColor
                    id="spot-wrapup-next-centre-angle"
                    varName="centreAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("centreAngleTerm"))}
                >
                    centre angle
                </InlineSpotColor>{" "}
                opens right out into a straight line, and the{" "}
                <InlineSpotColor
                    id="spot-wrapup-next-edge-angle"
                    varName="edgeAngleTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("edgeAngleTerm"))}
                >
                    angle on the edge
                </InlineSpotColor>{" "}
                turns into a perfect right angle.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
