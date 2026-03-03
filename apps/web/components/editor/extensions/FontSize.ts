import { Extension } from "@tiptap/core";

/**
 * Custom TipTap extension to set font-size via TextStyle marks.
 */
const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return { types: ["textStyle"] };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (el) => el.style.fontSize?.replace(/['"]+/g, ""),
                        renderHTML: (attrs) => {
                            if (!attrs.fontSize) return {};
                            return { style: `font-size: ${attrs.fontSize}` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize: string) =>
                    ({ chain }: any) =>
                        chain().setMark("textStyle", { fontSize }).run(),
            unsetFontSize:
                () =>
                    ({ chain }: any) =>
                        chain().setMark("textStyle", { fontSize: null }).run(),
        };
    },
});

export default FontSize;
