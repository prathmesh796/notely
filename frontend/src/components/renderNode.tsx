import { type JSX } from "react";

export function renderNode(
    node: any,
    path: number[],
    updateNode: (path: number[], newValue: string) => void,
    addNodeAfter?: (path: number[]) => void
) {
    switch (node.type) {
        case "heading":
            const Tag = `h${node.depth}` as keyof JSX.IntrinsicElements;
            const headingStyles: Record<number, React.CSSProperties> = {
                1: { fontSize: "2em", fontWeight: "bold", marginBlock: "0.67em" },
                2: { fontSize: "1.5em", fontWeight: "bold", marginBlock: "0.83em" },
                3: { fontSize: "1.17em", fontWeight: "bold", marginBlock: "1em" },
                4: { fontSize: "1em", fontWeight: "bold", marginBlock: "1.33em" },
                5: { fontSize: "0.83em", fontWeight: "bold", marginBlock: "1.67em" },
                6: { fontSize: "0.67em", fontWeight: "bold", marginBlock: "2.33em" },
            };
            return (
                <Tag style={headingStyles[node.depth]}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </Tag>
            );

        case "paragraph":
            return (
                <p style={{ marginBlock: "1em", lineHeight: 1.6 }}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </p>
            );

        case "text":
            return (
                <span
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            // Commit current edits
                            const newValue = (e.currentTarget.textContent || "").replace(/\u200B/g, "");
                            if (newValue !== node.value) {
                                updateNode(path, newValue);
                            }
                            // Insert a new empty paragraph after the current block
                            if (addNodeAfter) {
                                addNodeAfter(path);
                            }
                            (e.currentTarget as HTMLElement).blur();
                        }
                    }}
                    onBlur={(e) => {
                        const newValue = (e.currentTarget.textContent || "").replace(/\u200B/g, "");
                        if (newValue !== node.value) {
                            updateNode(path, newValue);
                        }
                    }}
                    style={{
                        display: node.value === "" ? "inline-block" : "inline",
                        outline: "none",
                        minHeight: node.value === "" ? "1em" : undefined,
                        minWidth: node.value === "" ? "100%" : undefined,
                    }}
                >
                    {node.value === ""
                        ? "\u200B"
                        : node.value.split("\n").flatMap((seg: string, i: number, arr: string[]) =>
                            i < arr.length - 1
                                ? [seg, <br key={`br-${i}`} />]
                                : [seg]
                        )}
                </span>
            );

        case "strong":
            return (
                <strong style={{ fontWeight: "bold" }}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </strong>
            );

        case "emphasis":
            return (
                <em style={{ fontStyle: "italic" }}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </em>
            );

        case "list":
            const ListTag = node.ordered ? "ol" : "ul";
            const listStyle: React.CSSProperties = node.ordered
                ? { listStyleType: "decimal", paddingLeft: "2em", marginBlock: "1em" }
                : { listStyleType: "disc", paddingLeft: "2em", marginBlock: "1em" };
            return (
                <ListTag style={listStyle}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </ListTag>
            );

        case "listItem":
            return (
                <li style={{ display: "list-item", marginBlock: "0.25em" }}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </li>
            );

        case "code":
            return (
                <pre style={{ backgroundColor: "#f4f4f5", padding: "1em", borderRadius: "0.375rem", overflowX: "auto", marginBlock: "1em", fontFamily: "monospace" }}>
                    <code
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || "";
                            if (newValue !== node.value) {
                                updateNode(path, newValue);
                            }
                        }}
                        style={{ outline: "none", fontFamily: "monospace", fontSize: "0.875em" }}
                    >
                        {node.value}
                    </code>
                </pre>
            );

        case "inlineCode":
            return (
                <code
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                        const newValue = e.currentTarget.textContent || "";
                        if (newValue !== node.value) {
                            updateNode(path, newValue);
                        }
                    }}
                    style={{ outline: "none", fontFamily: "monospace", fontSize: "0.875em", backgroundColor: "#f4f4f5", padding: "0.15em 0.4em", borderRadius: "0.25rem" }}
                >
                    {node.value}
                </code>
            );

        case "link":
            return (
                <a href={node.url} title={node.title} style={{ color: "#2563eb", textDecoration: "underline" }}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </a>
            );

        case "blockquote":
            return (
                <blockquote style={{ borderLeft: "4px solid #d1d5db", paddingLeft: "1em", marginBlock: "1em", color: "#6b7280", fontStyle: "italic" }}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode, addNodeAfter)}
                        </span>
                    ))}
                </blockquote>
            );

        case "break":
            return <br />;

        default:
            console.warn(`Unhandled node type: ${node.type}`, node);
            return null;
    }
}