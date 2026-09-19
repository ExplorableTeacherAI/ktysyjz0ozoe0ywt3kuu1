import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import { EditableH1, EditableParagraph, InlineSpotColor } from "@/components/atoms";
import { getVariableInfo, spotColorPropsFromDefinition } from "../variables";

export const circleOrientBlocks: ReactElement[] = [
    <StackLayout key="layout-orient-title" maxWidth="xl">
        <Block id="orient-title" padding="md">
            <EditableH1 id="h1-orient-title" blockId="orient-title">
                Circle Theorems: Angles in a Circle
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-orient-hook" maxWidth="xl">
        <Block id="orient-hook" padding="sm">
            <EditableParagraph id="para-orient-hook" blockId="orient-hook">
                Picture a round stadium with two floodlights on the rim. Standing at the
                exact centre, you have to turn a long way to look from one lamp to the
                other. Walk out to the rim, look at the same two lamps, and suddenly the
                turn is much smaller.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-orient-promise" maxWidth="xl">
        <Block id="orient-promise" padding="sm">
            <EditableParagraph id="para-orient-promise" blockId="orient-promise">
                That shrink is not random, and it is not a little bit smaller either. By
                the end of this lesson you will find a missing angle in a circle from one
                number alone. We begin with what every circle gives us: a centre, an edge,
                and a stretch of edge called an{" "}
                <InlineSpotColor
                    id="spot-orient-promise-arc"
                    varName="arcTerm"
                    {...spotColorPropsFromDefinition(getVariableInfo("arcTerm"))}
                >
                    arc
                </InlineSpotColor>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
