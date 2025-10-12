import React from "react";

interface CsvTableProps {
  csvString: string;
  separator?: string;
}

const tableStyle: React.CSSProperties = {
  borderCollapse: "separate",
  borderSpacing: 0,
  width: "100%",
  maxWidth: "700px",
  margin: "0 auto",
  background: "#23272f",
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
  overflow: "hidden",
};

const cellBorder = "1px solid #444";

const thStyle: React.CSSProperties = {
  background: "#2d323c",
  color: "#f1f1f1",
  fontWeight: 700,
  padding: "12px 8px",
  border: cellBorder,
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 8px",
  border: cellBorder,
  textAlign: "left",
  color: "#e0e6ed",
};

const trHoverStyle: React.CSSProperties = {
  background: "#262b34",
};

const CsvTable: React.FC<CsvTableProps> = ({ csvString, separator = ";" }) => {
  if (!csvString) return null;
  const rows = csvString.split("\n").filter(Boolean).map(row => row.split(separator));
  const [header, ...body] = rows;

  return (
          <div className="mt-4">
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                <tr>
                  {header.map((cell, j) => (
                          <th key={j} style={thStyle}>{cell}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {body.map((row, i) => (
                        <tr key={i} style={i % 2 ? trHoverStyle : undefined}>
                          {row.map((cell, j) => (
                                  <td key={j} style={tdStyle}>{cell}</td>
                          ))}
                        </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
  );
};

export default CsvTable;