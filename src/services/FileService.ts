
export class FileService {
 public static downloadFile(filename: string, content: string, type: "csv" | "txt" = "txt") {
    const mimeType = type === "csv" ? "text/csv" : "text/plain";
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(`.${type}`) ? filename : `${filename}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
}