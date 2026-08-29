/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /**
     * Correct answer for cloze input validation.
     * Accepts a single string, pipe-separated alternates (e.g. "first | 1 | 1st"),
     * or an array of accepted answers (e.g. ["first", "1", "1st"]).
     */
    correctAnswer?: string | string[];
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // SHARED COLOUR TERMS (prose <-> figure identity)
    // ========================================
    centreAngleTerm: {
        defaultValue: '',
        type: 'text',
        label: 'Centre angle term',
        description: 'Colour identity for the angle at the centre, used by InlineSpotColor',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.18)',
    },
    edgeAngleTerm: {
        defaultValue: '',
        type: 'text',
        label: 'Edge angle term',
        description: 'Colour identity for the angle at the edge, used by InlineSpotColor',
        color: '#8E90F5',
        bgColor: 'rgba(142, 144, 245, 0.18)',
    },

    // ========================================
    // SECTION: TWO ANGLES, ONE ARC
    // ========================================
    arcCentreAngle: {
        defaultValue: 120,
        type: 'number',
        label: 'Angle at the centre',
        description: 'Angle AOB at the centre of the intro circle',
        unit: '°',
        min: 40,
        max: 170,
        step: 1,
        color: '#62D0AD',
    },
    arcEdgePosition: {
        defaultValue: 0.5,
        type: 'number',
        label: 'Edge point position',
        description: 'Where point P sits along the major arc (0 near B, 1 near A)',
        min: 0.08,
        max: 0.92,
        step: 0.01,
        color: '#8E90F5',
    },
    arcViewHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Circle highlight',
        description: "Which part of the intro circle is highlighted: '' | 'arc' | 'centre' | 'edge'",
        color: '#64748B',
        bgColor: 'rgba(100, 116, 139, 0.20)',
    },
    answerTwoAnglesEdge: {
        defaultValue: '',
        type: 'text',
        label: 'Edge angle for a 90 degree centre angle',
        description: 'Student answer: angle at the edge when the centre angle is 90 degrees',
        placeholder: '???',
        correctAnswer: ['45', '45°'],
        color: '#8E90F5',
    },

    // ========================================
    // SECTION: ALWAYS DOUBLE, NEVER EQUAL
    // ========================================
    predictCentreAngle: {
        defaultValue: 140,
        type: 'number',
        label: 'Angle at the centre',
        description: 'Centre angle used in the prediction figure',
        unit: '°',
        min: 60,
        max: 170,
        step: 10,
        color: '#62D0AD',
    },
    predictGuessAngle: {
        defaultValue: 100,
        type: 'number',
        label: 'Your prediction',
        description: 'The edge angle the student predicts, in degrees',
        unit: '°',
        min: 5,
        max: 175,
        step: 1,
        color: '#F7B23B',
    },
    predictRevealed: {
        defaultValue: false,
        type: 'boolean',
        label: 'Prediction checked',
        description: 'Whether the true edge angle has been revealed',
    },
    answerDoubleCentre: {
        defaultValue: '',
        type: 'text',
        label: 'Centre angle from a 75 degree edge angle',
        description: 'Student answer: centre angle when the edge angle is 75 degrees',
        placeholder: '???',
        correctAnswer: ['150', '150°'],
        color: '#62D0AD',
    },

    // ========================================
    // SECTION: WHERE THE VERTEX SITS
    // ========================================
    vertexX: {
        defaultValue: 281,
        type: 'number',
        label: 'Vertex x position',
        description: 'Horizontal position of the draggable vertex, in figure units',
        min: 100,
        max: 420,
        step: 1,
        color: '#8E90F5',
    },
    vertexY: {
        defaultValue: 94,
        type: 'number',
        label: 'Vertex y position',
        description: 'Vertical position of the draggable vertex, in figure units',
        min: 60,
        max: 360,
        step: 1,
        color: '#8E90F5',
    },
    vertexViewHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Vertex figure highlight',
        description: "Which part of the vertex figure is highlighted: '' | 'centre' | 'shortArc'",
        color: '#64748B',
        bgColor: 'rgba(100, 116, 139, 0.20)',
    },
    answerVertexRule: {
        defaultValue: '',
        type: 'select',
        label: 'Where the halving rule works',
        description: 'Student answer: where the vertex must sit for the halving rule to hold',
        placeholder: '???',
        options: [
            'anywhere inside the circle',
            'on the edge, on the short arc between A and B',
            'on the edge, on the long arc away from A and B',
        ],
        correctAnswer: 'on the edge, on the long arc away from A and B',
        color: '#8E90F5',
    },

    // ========================================
    // SECTION: FINDING A MISSING ANGLE
    // ========================================
    summaryCentreAngle: {
        defaultValue: 80,
        type: 'number',
        label: 'Angle at the centre',
        description: 'Centre angle in the summary figure',
        unit: '°',
        min: 40,
        max: 170,
        step: 5,
        color: '#62D0AD',
    },
    summaryEdgePosition: {
        defaultValue: 0.5,
        type: 'number',
        label: 'Edge point position',
        description: 'Where point P sits along the major arc of the summary figure',
        min: 0.08,
        max: 0.92,
        step: 0.01,
        color: '#8E90F5',
    },
    summaryEdgeAngle: {
        defaultValue: 40,
        type: 'number',
        label: 'Angle at the edge',
        description: 'Half of the summary centre angle, kept in step by the figure',
        unit: '°',
        min: 20,
        max: 85,
        step: 1,
        color: '#8E90F5',
    },
    answerPracticeEdge: {
        defaultValue: '',
        type: 'text',
        label: 'Edge angle for a 110 degree centre angle',
        description: 'Student answer: edge angle when the centre angle is 110 degrees',
        placeholder: '???',
        correctAnswer: ['55', '55°'],
        color: '#8E90F5',
    },
    answerPracticeCentre: {
        defaultValue: '',
        type: 'text',
        label: 'Centre angle for a 32 degree edge angle',
        description: 'Student answer: centre angle when the edge angle is 32 degrees',
        placeholder: '???',
        correctAnswer: ['64', '64°'],
        color: '#62D0AD',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
