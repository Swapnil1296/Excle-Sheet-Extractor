import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcleData] = useState(null);

  const handleFile = (e) => {
    // currently include only csv & spreadsheet can add single excel sheet later in fileType array
    let fileType = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        setTypeError(null);

        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please Select only Excel Sheet types");
        setExcelFile(null);
      }
    } else {
      console.log("please Select your file");
    }
  };
  const handleFileSubmit = (event) => {
    event.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const workbookSheetNames = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workbookSheetNames];
      const data = XLSX.utils.sheet_to_json(workSheet);
      setExcleData(data.slice(0, 100));
    }
  };
  return (
    <div className="  w-full h-full ">
      <div className="flex flex-col m-10 justify-center items-center space-y-10">
        <h1 className="text-xl font-bold my-3"> Upload & View Excel Sheet</h1>

        <div>
          <form
            className="flex items-center space-y-6  flex-col justify-center items-center "
            onSubmit={handleFileSubmit}
          >
            <div className=" border border-slate-300 bg-slate-300">
              <input
                type="file"
                required
                onChange={handleFile}
                className="  bg-slate-300"
              />
            </div>
            <div>
              <button
                type="submit"
                className="border border-slate-300 bg-slate-300 rounded-md p-1"
              >
                Upload File
              </button>
            </div>
            {typeError && <div>{typeError}</div>}
          </form>
        </div>
        <div className="text-violet-700 text-xl">
          {excelData ? (
            <table className="table-auto bg-violet-100 p-2 overflow-x-auto m-5">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((keys) => (
                    <th key={keys} className="border border-slate-300 text-sm">
                      {keys}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key} className="border border-slate-300 text-sm">
                        {individualExcelData[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No file Uploaded Yet !!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
