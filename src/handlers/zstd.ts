import CommonFormats from "src/CommonFormats.ts";
import type { FileData, FileFormat, FormatHandler } from "../FormatHandler.ts";
import JSZip from "jszip";

async function applyCompressionStream(bytes: Uint8Array, format: string, compress: boolean): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream();
  const transform = compress
    ? new CompressionStream(format as any)
    : new DecompressionStream(format as any);
  const outputStream = stream.pipeThrough(transform);
  return new Uint8Array(await new Response(outputStream).arrayBuffer());
}

class zstdHandler implements FormatHandler {
  public name = "zstd";

  public supportAnyInput = true;

  public supportedFormats: FileFormat[] = [
    {
      name: "Zstandard Compressed Data",
      format: "zst",
      extension: "zst",
      mime: "application/zstd",
      from: true,
      to: true,
      internal: "zstd",
      category: "archive",
      lossless: true
    },
    CommonFormats.ZIP.builder("zip").allowTo().markLossless()
  ];

  public ready = false;

  async init() {
    if (typeof CompressionStream !== "function" || typeof DecompressionStream !== "function") {
      throw new Error("Compression Streams API is unavailable.");
    }
    try {
      new CompressionStream("zstd" as any);
      new DecompressionStream("zstd" as any);
    } catch (_) {
      throw new Error("Zstandard is not supported by this browser.");
    }
    this.ready = true;
  }

  async doConvert(inputFiles: FileData[], inputFormat: FileFormat, outputFormat: FileFormat): Promise<FileData[]> {
    if (outputFormat.internal === "zstd") {
      return Promise.all(inputFiles.map(async (inputFile) => {
        const bytes = await applyCompressionStream(inputFile.bytes, "zstd", true);
        return {
          name: /\.(zst|zstd)$/i.test(inputFile.name) ? inputFile.name : `${inputFile.name}.zst`,
          bytes
        };
      }));
    }

    if (inputFormat.internal === "zstd" && outputFormat.internal === "zip") {
      const zip = new JSZip();

      for (const inputFile of inputFiles) {
        const bytes = await applyCompressionStream(inputFile.bytes, "zstd", false);
        const outputName = inputFile.name.replace(/\.(zst|zstd)$/i, "") || `${inputFile.name}.bin`;
        zip.file(outputName, bytes);
      }

      return [{
        name: "output.zip",
        bytes: await zip.generateAsync({ type: "uint8array" })
      }];
    }

    throw "Invalid conversion path.";
  }
}

export default zstdHandler;
