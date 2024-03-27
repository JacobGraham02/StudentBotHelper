import { useEffect, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import { getAllBotLogFiles } from "../../services/bot";

const LogsPageContent = ({ userLoggedIn }: { userLoggedIn: boolean }) => {
  const [showModal, setShowModal] = useState(false);

  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadFileContents, setDownloadFileContents] = useState("");

  const [botInfoLogFiles, setBotInfoLogFiles] = useState<any[]>([]);
  const [botErrorLogFiles, setBotErrorLogFiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchBotLogs = async () => {
      try {
        const botInfoLogsResponse = await getAllBotLogFiles(
          `studentbothelperinfo`
        );
        const botErrorLogsResponse = await getAllBotLogFiles(
          `studentbothelpererror`
        );
        setBotInfoLogFiles(botInfoLogsResponse.data);
        setBotErrorLogFiles(botErrorLogsResponse.data);
      } catch (error) {
        throw new Error(
          `There was an error when attempting to fetch all of the bot commands from the database: ${error}`
        );
      }
    };
    fetchBotLogs();
    // writeBotLogFile(`TestLogInfo2`, `Test log info file contents`, `studentbothelperinfo`);
    // writeBotLogFile(`TestLogError2`, `Test log error file contents`, `studentbothelpererror`);
  }, []); // Empty dependency array to only run once when component mounts

  const logFileDownload = ({
    fileName,
    fileContents,
  }: {
    fileName: string;
    fileContents: string;
  }) => {
    // Encapsulates the download logic within an inner function.
    const handleDownload = () => {
      // Creates a new Blob object from the fileContents string, specifying the MIME type as plain text.
      const fileDataBlob = new Blob([fileContents], { type: "text/plain" });
      // Generates a URL for the created Blob, allowing it to be referenced within the browser's environment.
      const url = URL.createObjectURL(fileDataBlob);
      // Creates an anchor (`<a>`) element programmatically. This element is used to trigger the download.
      const a = document.createElement("a");
      // Sets the `href` attribute of the anchor to the Blob URL, enabling the browser to download the Blob when the link is clicked.
      a.href = url;
      // Sets the `download` attribute with the desired file name, instructing the browser to download the Blob as a file with this name.
      a.download = fileName;
      // Programmatically clicks the anchor element, triggering the download process.
      a.click();
      // Revokes the created Blob URL to release browser resources, as it's no longer needed after the download is initiated.
      URL.revokeObjectURL(url);

      setShowModal(false);
    };
    handleDownload();
  };

  const downloadLogFileConfirmation = (
    logFileName: string,
    logFileContents: string
  ) => {
    setDownloadFileName(logFileName);
    setDownloadFileContents(logFileContents);
    setShowModal(true);
  };

  if (userLoggedIn) {
    return (
      <main id="main" className="container text-center">
        <CustomModal
          showModal={showModal}
          setShowModal={setShowModal}
          title={`Download: ${downloadFileName}`}
          body={downloadFileContents}
          cancelButtonText="Go back"
          confirmButtonText="Download"
          onConfirm={() => {
            logFileDownload({
              fileName: downloadFileName,
              fileContents: downloadFileContents,
            });
          }}
          size="xl"
        />
        <div className="row">
          <section className="col-md-6">
            <h2>Command information logs</h2>
            <h4>View and download your bot log files</h4>
            <ul className="list-unstyled">
              {botInfoLogFiles.map((infoLogFile, index) => (
                <li key={index} className="mb-1">
                  <a
                    href="#"
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadLogFileConfirmation(
                        infoLogFile.name,
                        infoLogFile.content
                      );
                    }}
                  >
                    {infoLogFile.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="col-md-6">
            <h2>Command error logs</h2>
            <h4>View and download your bot log files</h4>
            <ul className="list-unstyled">
              {botErrorLogFiles.map((errorLogFile, index) => (
                <li key={index} className="mb-1">
                  <a
                    href="#"
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadLogFileConfirmation(
                        errorLogFile.name,
                        errorLogFile.content
                      );
                    }}
                  >
                    {errorLogFile.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    );
  }
};

export default LogsPageContent;
