import React, { useState, useEffect } from "react";
import SVG from "../SVG";

import TreeList from "../../containers/TreeList/TreeList";
import Resizer from "../../containers/Resizer";
import { fetchURLDetails } from "../../utils/url";
import { switchTheme } from "../../utils/themeList";

import "./styles.css";

function Pane({ toggleOpened, width, firstPageLoad, setFirstPageLoad }) {
  const [realoading, setRealoading] = useState(true);
  const [URLDetails, setURLDetails] = useState(fetchURLDetails());

  window.addEventListener("popstate", (_event) => {
    setRealoading(true);
  });

  useEffect(() => {
    if (realoading) {
      setURLDetails(fetchURLDetails());
      setRealoading(false);
    }
  }, [realoading]);

  return (
    <div className="tree-pane" style={{ width: width + "px" }}>
      <div className="pane-main">
        <div className="pane-header">
          <div className="spread">
            <div className="pane-details">
              <SVG
                icon="repo"
                height="12"
                style={{ verticalAlign: "middle" }}
              />{" "}
              {URLDetails.dirFormatted}
            </div>
            <div className="pane-icons">
              <span onClick={switchTheme} className="close-button">
                <SVG icon="half" height="9" />
              </span>
              <span onClick={toggleOpened} className="close-button">
                <SVG icon="close" height="12" />
              </span>
            </div>
          </div>
          <div className="pane-details" style={{ width: width - 12 + "px" }}>
            <SVG
              icon="branch"
              height="12"
              style={{ verticalAlign: "middle" }}
            />{" "}
            {URLDetails.branchName}
          </div>
        </div>
        <div className="tree-body">
          <TreeList
            firstPageLoad={firstPageLoad}
            setFirstPageLoad={setFirstPageLoad}
          />
        </div>
      </div>
      <Resizer />
    </div>
  );
}

export default Pane;
