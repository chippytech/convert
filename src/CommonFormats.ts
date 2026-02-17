import { FormatDefinition } from "src/FormatHandler"

/**
 * Common format definitions which can be used to reduce boilerplate definitions
 */
const CommonFormats = {
    // images
    PNG: new FormatDefinition(
        "Portable Network Graphics",
        "png",
        "png",
        "image/png"
    ),
    JPEG: new FormatDefinition(
        "Joint Photographic Experts Group JFIF",
        "jpeg",
        "jpg",
        "image/jpeg"
    ),
    WEBP: new FormatDefinition(
        "WebP",
        "webp",
        "webp",
        "image/webp"
    ),
    GIF: new FormatDefinition(
        "CompuServe Graphics Interchange Format (GIF)",
        "gif",
        "gif",
        "image/gif"
    ),
    SVG: new FormatDefinition(
        "Scalable Vector Graphics",
        "svg",
        "svg",
        "image/svg+xml"
    ),
    // texts
    JSON: new FormatDefinition(
        "JavaScript Object Notation",
        "json",
        "json",
        "application/json"
    ),
    TEXT: new FormatDefinition(
        "Plain Text",
        "text",
        "txt",
        "text/plain"
    )
}

export default CommonFormats