import { type ReactElement } from "react";
import { StackLayout } from "@/components/layouts";
import { Block } from "@/components/templates";
import { EditableH2, EditableParagraph } from "@/components/atoms";

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
                angles standing on the same arc are locked together in a two to one
                ratio, and the one at the centre is always the double, wherever along
                that arc you choose to stand.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapup-next" maxWidth="xl">
        <Block id="wrapup-next" padding="sm">
            <EditableParagraph id="para-wrapup-next" blockId="wrapup-next">
                Two things are worth carrying away. Both angles have to stand on the same
                arc, and you halve going out to the edge but double coming back in. Next
                comes the special case where that centre angle opens right out into a
                straight line, and the angle on the edge turns into a perfect right angle.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
