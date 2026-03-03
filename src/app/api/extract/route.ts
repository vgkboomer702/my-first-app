import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const filename = file.name;
    const ext = filename.split(".").pop()?.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";
    let pageCount: number | undefined;
    let fileType = "";

    switch (ext) {
      case "pdf": {
        fileType = "PDF";
        const { extractText: extractPdfText, getMeta } = await import("unpdf");
        const pdfData = new Uint8Array(buffer);
        const { text: pdfPages, totalPages } = await extractPdfText(pdfData);
        text = pdfPages.join("\n");
        pageCount = totalPages;
        break;
      }

      case "docx": {
        fileType = "DOCX";
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
        break;
      }

      case "xlsx":
      case "xls": {
        fileType = ext.toUpperCase();
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheets: string[] = [];
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_txt(sheet);
          sheets.push(`--- Sheet: ${sheetName} ---\n${csv}`);
        }
        text = sheets.join("\n\n");
        pageCount = workbook.SheetNames.length;
        break;
      }

      case "pptx": {
        fileType = "PPTX";
        const { parseOffice } = await import("officeparser");
        const ast = await parseOffice(buffer);
        text = ast.toText();
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unsupported file type: .${ext}` },
          { status: 400 }
        );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted from this file. It may be image-based or empty." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: text.trim(),
      filename,
      fileType,
      ...(pageCount !== undefined && { pageCount }),
    });
  } catch (err: unknown) {
    console.error("Extraction error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: `Failed to extract text: ${message}` },
      { status: 500 }
    );
  }
}
