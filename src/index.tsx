import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// 백엔드 미연결 시 목데이터 모드 (REACT_APP_USE_MOCK=true)
if (process.env.REACT_APP_USE_MOCK === "true") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./mocks/setupMock").setupMock();
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

reportWebVitals();
