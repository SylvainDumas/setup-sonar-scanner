/**
 * Represents version information for a specific component.
 */
export declare class Source {
    url: string;
    digest?: string;
}
export declare class ToolInfo {
    source: Source;
    versionCache: string;
    binPath: string;
}
/**
 * Downloads the tool and caches it.
 *
 * @param source - The source information for the tool.
 * @returns The path to the downloaded tool.
 */
export declare function downloadTool(source: Source): Promise<string>;
